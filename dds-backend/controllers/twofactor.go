package controllers

import (
	"dds-backends/database"
	"dds-backends/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Enable2FA(ctx *gin.Context) {
	email := ctx.GetString("email")

	fmt.Println(email)

	user := models.User{}
	db := database.GetDbConnection()
	db.Where("email = ?", email).First(&user)
	user.TwoFactorEnabled = !user.TwoFactorEnabled
	db.Save(&user)

	fmt.Println(user)

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
