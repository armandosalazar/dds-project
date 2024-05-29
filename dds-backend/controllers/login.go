package controllers

import (
	"dds-backends/database"
	"dds-backends/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(ctx *gin.Context) {
	var req LoginRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	db := database.GetDbConnection()

	var user models.User

	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "user not found",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid password",
		})
		return
	}

	if user.TwoFactorEnabled {
		ctx.JSON(http.StatusOK, gin.H{
			"message":   "two factor enabled",
			"twofactor": true,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":   "logged in",
		"twofactor": false,
	})
}
