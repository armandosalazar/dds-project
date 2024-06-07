package models

import "gorm.io/gorm"

type TwoFactor struct {
	gorm.Model
	Id          uint   `json:"id"`
	Url         string `json:"url"`
	Secret      string
	ImageBase64 string `json:"image_base64"`
}
