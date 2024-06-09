package models

import "gorm.io/gorm"

type TwoFactor struct {
	gorm.Model
	Url         string
	Secret      string
	ImageBase64 string
}
