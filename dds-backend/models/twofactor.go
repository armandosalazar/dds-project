package models

import "gorm.io/gorm"

type TwoFactor struct {
	gorm.Model
	TOTP []byte
}
