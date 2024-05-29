package middleware

import (
	"dds-backends/utils/token"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authorization := ctx.GetHeader("Authorization")
		authorizationToken := authorization[7:]

		tokenJwt, err := token.VerifyToken(authorizationToken)

		if err != nil || !tokenJwt.Valid {
			ctx.JSON(401, gin.H{
				"error": "Unauthorized",
			})
			ctx.Abort()
			return
		}

		email, err := token.GetEmailFromToken(authorizationToken)
		if err != nil {
			ctx.JSON(401, gin.H{
				"error": "Unauthorized",
			})
			ctx.Abort()
			return
		}

		ctx.Set("email", email)
		ctx.Next()
	}
}
