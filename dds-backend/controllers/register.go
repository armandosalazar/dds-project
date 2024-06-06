package controllers

import (
	"bytes"
	"dds-backends/database"
	"dds-backends/models"
	"encoding/base64"
	"image/png"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/pquerna/otp/totp"
)

type RegisterRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Register(ctx *gin.Context) {
	var req RegisterRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	user := models.User{
		Email:            req.Email,
		Password:         req.Password,
		TwoFactorEnabled: false,
		TwoFactor:        models.TwoFactor{},
	}

	db := database.GetDbConnection()

	twoFactor := models.TwoFactor{}
	otp, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "DDS",
		AccountName: req.Email,
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	twoFactor.Url = otp.URL()
	twoFactor.Secret = otp.Secret()
	image, err := otp.Image(200, 200)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	buffer := new(bytes.Buffer)
	err = png.Encode(buffer, image)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	twoFactor.ImageBase64 = base64.StdEncoding.EncodeToString(buffer.Bytes())

	if err := db.Create(&twoFactor).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	user.TwoFactorID = twoFactor.ID

	user.RoleID = 2

	if err := db.Create(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "registered successfully",
	})
}
