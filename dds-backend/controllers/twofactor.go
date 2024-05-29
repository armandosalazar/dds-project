package controllers

import (
	"dds-backends/database"
	"dds-backends/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/pquerna/otp/totp"
)

func Enable2FA(ctx *gin.Context) {
	email := ctx.GetString("email")

	fmt.Println(email)

	user := models.User{}
	db := database.GetDbConnection()
	db.Where("email = ?", email).Preload("TwoFactor").First(&user)

	user.TwoFactorEnabled = !user.TwoFactorEnabled

	if len(user.TwoFactor.Url) == 0 {
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

		user.TwoFactor.Url = otp.URL()
		user.TwoFactor.Secret = otp.Secret()
	}

	db.Save(&user)

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
