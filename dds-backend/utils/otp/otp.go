package otp

import (
	"dds-backends/database"
	"dds-backends/models"
	"fmt"

	// "github.com/sec51/twofactor"
)

func GetOtpFromDb() *twofactor.Totp {
	db := database.GetDbConnection()

	var twoFactor models.TwoFactor

	if err := db.First(&twoFactor).Error; err != nil {
		panic("Error to get otp from database")
	}

	fmt.Println(twoFactor.OTP)

	issuer := "DistroTech"
	otp, err := twofactor.TOTPFromBytes(twoFactor.OTP, issuer)

	if err != nil {
		panic("Error to create otp")
	}

	defer db.Close()

	return otp
}
