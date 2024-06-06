package controllers

import (
	"dds-backends/database"
	"dds-backends/models"
	"dds-backends/utils/token"
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

	db.Save(&user)

	if user.TwoFactorEnabled {
		ctx.JSON(http.StatusOK, gin.H{
			"message":          "2FA enabled",
			"twoFactorEnabled": user.TwoFactorEnabled,
			"twoFactorImage":   user.TwoFactor.ImageBase64,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"twoFactorEnabled": user.TwoFactorEnabled,
	})
}

type Verify2FARequest struct {
	Email string `json:"email" binding:"required"`
	TOTP  string `json:"totp" binding:"required"`
}

func Verify2FA(ctx *gin.Context) {
	var req Verify2FARequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	user := models.User{}

	db := database.GetDbConnection()

	db.Where("email = ?", req.Email).Preload("TwoFactor").First(&user)

	if !user.TwoFactorEnabled {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "2FA not enabled",
		})
		return
	}

	valid := totp.Validate(req.TOTP, user.TwoFactor.Secret)

	if !valid {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid TOTP",
		})
		return
	}

	token, err := token.GenerateToken(user.Email)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":          "logged in",
		"token":            token,
		"twoFactorEnabled": user.TwoFactorEnabled,
		"twoFactorImage":   user.TwoFactor.ImageBase64,
	})

}
