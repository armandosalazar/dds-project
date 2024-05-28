package main

import (
	"crypto"
	"encoding/base64"
	"fmt"
	"net/http"

	"dds-backends/controllers"
	"dds-backends/models"
	"dds-backends/utils/otp"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sec51/twofactor"
)

type RegisterInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type TwoFactorVerifyInput struct {
	Token string `json:"token" binding:"required"`
	Code  string `json:"code" binding:"required"`
}

func main() {
	models.ConnectDatabase()

	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"POST", "GET", "PUT", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept", "User-Agent", "Cache-Control", "Pragma"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true

	router.Use(cors.New(config))

	api := router.Group("/api")

	api.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// api.POST("/register", func(c *gin.Context) {
	// 	var input RegisterInput

	// 	if err := c.ShouldBindJSON(&input); err != nil {
	// 		c.JSON(400, gin.H{
	// 			"error": err.Error(),
	// 		})
	// 		return
	// 	}

	// 	user := models.User{}

	// 	user.Email = input.Email
	// 	user.Password = input.Password
	// 	user.TwoFactorEnabled = true

	// 	_, err := user.SaveUser()

	// 	if err != nil {
	// 		c.JSON(400, gin.H{
	// 			"error": err.Error(),
	// 		})
	// 		return
	// 	}

	// 	c.JSON(200, gin.H{
	// 		"message": "registered",
	// 	})
	// })
	api.GET("/validate", func(ctx *gin.Context) {
		otp := otp.GetOtpFromDb()

		qrBytes, _ := otp.QR()

		qrBase64 := base64.StdEncoding.EncodeToString(qrBytes)

		ctx.JSON(http.StatusOK, gin.H{
			"qrBase64": qrBase64,
		})

	})
	api.POST("/validate/:code", func(ctx *gin.Context) {
		code := ctx.Params.ByName("code")

		otp := otp.GetOtpFromDb()

		if err := otp.Validate(code); err != nil {
			ctx.JSON(http.StatusForbidden, gin.H{
				"error": err.Error(),
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"code": code,
		})

	})

	api.POST("/register", controllers.Register)

	api.POST("/login", func(c *gin.Context) {
		var input LoginInput

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}

		user := models.User{}
		user.Email = input.Email
		user.Password = input.Password

		fmt.Println(user)

		token, err := models.LoginCheck(user.Email, user.Password)

		if err != nil {
			c.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}

		otp, err := twofactor.NewTOTP(user.Email, "", crypto.SHA1, 8)

		if err != nil {
			c.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}

		fmt.Println(otp)

		qrBytes, err := otp.QR()

		if err != nil {
			c.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}

		qrBase64 := base64.StdEncoding.EncodeToString(qrBytes)

		qr := fmt.Sprintf("data:image/png;base64,%s", qrBase64)

		c.JSON(200, gin.H{
			"token": token,
			"qr":    qr,
		})
	})

	api.POST("/two-factor/verify", func(c *gin.Context) {
		var input TwoFactorVerifyInput

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}

		tkn := input.Token
		code := input.Code

		fmt.Println(tkn)
		fmt.Println(code)

		otp, err := twofactor.NewTOTP("luis@email.com", "", crypto.SHA1, 8)

		if err != nil {
			c.JSON(400, gin.H{
				"errorxx": err.Error(),
			})
			return
		}

		err = otp.Validate(code)

		if err != nil {
			c.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(200, gin.H{
			"message": "valid code",
		})
	})

	router.Run(":8080")
}
