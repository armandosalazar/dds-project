package models

import "gorm.io/gorm"

type TwoFactor struct {
	gorm.Model
	UserID uint
	OTP    []byte
}
