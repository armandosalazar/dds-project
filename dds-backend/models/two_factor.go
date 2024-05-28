package models

import "github.com/jinzhu/gorm"

type TwoFactor struct {
	gorm.Model
	UserID uint
	OTP    []byte `gorm:"not null"`
}
