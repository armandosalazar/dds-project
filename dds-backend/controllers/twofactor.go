package controllers

import (
	"bytes"
	"dds-backends/database"
	"dds-backends/models"
	"encoding/base64"
	"fmt"
	"image/png"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/pquerna/otp/totp"
)

func Enable2FA(ctx *gin.Context) {
	email := ctx.GetString("email")

	fmt.Println(email)

	user := models.User{}
	db := database.GetDbConnection()
	db.Where("email = ?", email).First(&user)

	user.TwoFactorEnabled = !user.TwoFactorEnabled

	fmt.Println("[*] len(user.TwoFactor.Url):", len(user.TwoFactor.Url))

	if len(user.TwoFactor.Url) == 0 && user.TwoFactorEnabled {
		otp, err := totp.Generate(totp.GenerateOpts{
			Issuer:      "DDS",
			AccountName: email,
		})

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		fmt.Println("[*] otp.URL():", otp.URL())
		fmt.Println("[*] otp.Secret():", otp.Secret())

		user.TwoFactor.Url = otp.URL()
		user.TwoFactor.Secret = otp.Secret()
		imagen, err := otp.Image(200, 200)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		buffer := new(bytes.Buffer)
		err = png.Encode(buffer, imagen)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		user.TwoFactor.ImageBase64 = base64.StdEncoding.EncodeToString(buffer.Bytes())

	}

	db.Save(&user)

	if user.TwoFactorEnabled {
		ctx.JSON(http.StatusOK, gin.H{
			"message":       "2FA enabled",
			"twoFatEnabled": user.TwoFactorEnabled,
			"image":         user.TwoFactor.ImageBase64,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"twoFatEnabled": user.TwoFactorEnabled,
	})
}

type Verify2FARequest struct {
	TOTP string `json:"totp" binding:"required"`
}

func Verify2FA(ctx *gin.Context) {
	var req Verify2FARequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// code := req.TOTP

	ctx.JSON(http.StatusOK, gin.H{
		"message": "verified",
	})
}
