package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"size:255;not null;unique" json:"email"`
	Password string `gorm:"size:255;not null" json:"password"`
	// relationship
	RoleID uint `json:"role_id"`
	Role   Role
	// two factor
	TwoFactorEnabled bool `json:"two_factor_enabled"`
	// relationship
	TwoFactorID uint `json:"two_factor_id"`
	TwoFactor   TwoFactor
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}
