package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email            string `gorm:"size:255;not null;unique"`
	Password         string `gorm:"size:255;not null"`
	RoleID           uint
	Role             Role
	TwoFactorEnabled bool
	TwoFactorID      uint
	TwoFactor        TwoFactor
	Posts            []Post `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}
