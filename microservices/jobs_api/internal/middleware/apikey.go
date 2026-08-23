package middleware

import (
	"github.com/gofiber/fiber/v2"
)

// APIKeyAuth returns a middleware that validates the X-API-Key header.
func APIKeyAuth(apiKey string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if apiKey == "" {
			// No API key configured, skip authentication
			return c.Next()
		}

		provided := c.Get("X-API-Key")
		if provided != apiKey {
			return c.Status(401).JSON(fiber.Map{
				"success": false,
				"error":   "unauthorized: invalid or missing API key",
			})
		}

		return c.Next()
	}
}
