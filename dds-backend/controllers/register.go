package controllers

import (
	"dds-backends/database"
	"dds-backends/models"
	"net/http"

	"github.com/gin-gonic/gin"
	// "github.com/sec51/twofactor"
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

	if err := user.BeforeSave(); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	db := database.GetDbConnection()

	if err := db.Create(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "registered",
	})
}
