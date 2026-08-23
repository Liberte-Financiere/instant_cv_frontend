package middleware

import (
	"log/slog"
	"runtime/debug"

	"github.com/gofiber/fiber/v2"
)

// Recovery returns a middleware that recovers from panics and returns a 500 error
// instead of crashing the entire server.
func Recovery() fiber.Handler {
	return func(c *fiber.Ctx) error {
		defer func() {
			if r := recover(); r != nil {
				slog.Error("panic recovered",
					"error", r,
					"stack", string(debug.Stack()),
					"path", c.Path(),
					"method", c.Method(),
				)
				c.Status(500).JSON(fiber.Map{
					"success": false,
					"error":   "internal server error",
				})
			}
		}()
		return c.Next()
	}
}
