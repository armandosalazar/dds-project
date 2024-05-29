package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Enable2FARequest struct {
	Enable bool `json:"enable" binding:"required"`
}

func Enable2FA(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "enabled",
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
