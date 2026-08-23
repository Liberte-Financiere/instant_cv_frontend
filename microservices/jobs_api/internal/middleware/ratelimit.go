package middleware

import (
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
)

type visitor struct {
	count    int
	resetAt  time.Time
}

// RateLimit returns a middleware that limits requests per IP.
// maxRequests per window duration.
func RateLimit(maxRequests int, window time.Duration) fiber.Handler {
	var mu sync.Mutex
	visitors := make(map[string]*visitor)

	// Cleanup old entries periodically
	go func() {
		ticker := time.NewTicker(window)
		defer ticker.Stop()
		for range ticker.C {
			mu.Lock()
			now := time.Now()
			for ip, v := range visitors {
				if now.After(v.resetAt) {
					delete(visitors, ip)
				}
			}
			mu.Unlock()
		}
	}()

	return func(c *fiber.Ctx) error {
		ip := c.IP()

		mu.Lock()
		v, exists := visitors[ip]
		if !exists || time.Now().After(v.resetAt) {
			visitors[ip] = &visitor{count: 1, resetAt: time.Now().Add(window)}
			mu.Unlock()
			return c.Next()
		}

		v.count++
		if v.count > maxRequests {
			mu.Unlock()
			return c.Status(429).JSON(fiber.Map{
				"success": false,
				"error":   "too many requests, please try again later",
			})
		}
		mu.Unlock()

		return c.Next()
	}
}
