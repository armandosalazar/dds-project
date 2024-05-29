package models

import "gorm.io/gorm"

type TwoFactor struct {
	gorm.Model
	Url         string `json:"url"`
	Secret      string
	ImageBase64 string `json:"image_base64"`
}
