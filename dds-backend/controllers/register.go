package controllers

import (
	"crypto"
	"net/http"

	"dds-backends/models"

	"github.com/gin-gonic/gin"
	"github.com/sec51/twofactor"
)

func Register(context *gin.Context) {
	email := "armando@email.com"
	issuer := "DistroTech"

	otp, err := twofactor.NewTOTP(email, issuer, crypto.SHA1, 8)

	if err != nil {
		panic("Error to create otp")
	}

	otpBytes, _ := otp.ToBytes()

	u := models.User{}

	u.Email = email
	u.Password = "holamundo"
	u.TwoFactorEnabled = true
	u.TwoFactor = models.TwoFactor{
		OTP: otpBytes,
	}

	u.SaveUser()

	context.JSON(http.StatusOK, gin.H{
		"message": "registered",
	})
}
