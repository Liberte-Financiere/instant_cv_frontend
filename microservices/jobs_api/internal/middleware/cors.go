package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

// CORS returns a middleware that sets CORS headers based on allowed origins.
func CORS(allowedOrigins string) fiber.Handler {
	origins := strings.Split(allowedOrigins, ",")
	originSet := make(map[string]bool)
	for _, o := range origins {
		originSet[strings.TrimSpace(o)] = true
	}

	return func(c *fiber.Ctx) error {
		origin := c.Get("Origin")

		if allowedOrigins == "*" || originSet[origin] {
			c.Set("Access-Control-Allow-Origin", origin)
		}

		c.Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Content-Type, X-API-Key")
		c.Set("Access-Control-Max-Age", "86400")

		if c.Method() == fiber.MethodOptions {
			return c.SendStatus(204)
		}

		return c.Next()
	}
}
