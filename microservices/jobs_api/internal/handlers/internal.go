package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jobsira/jobs-api/internal/cache"
	"github.com/jobsira/jobs-api/internal/models"
)

type InternalHandler struct {
	db    *pgxpool.Pool
	cache *cache.MemoryCache
}

func NewInternalHandler(db *pgxpool.Pool, cache *cache.MemoryCache) *InternalHandler {
	return &InternalHandler{db: db, cache: cache}
}

// Health returns the API health status. Used by Docker healthcheck.
// GET /api/v1/health
func (h *InternalHandler) Health(c *fiber.Ctx) error {
	if err := h.db.Ping(c.Context()); err != nil {
		return c.Status(503).JSON(fiber.Map{
			"status":   "unhealthy",
			"database": "unreachable",
		})
	}

	return c.JSON(fiber.Map{
		"status":   "ok",
		"database": "connected",
	})
}

// CacheInvalidate clears the entire in-memory cache.
// POST /api/v1/internal/cache/invalidate
func (h *InternalHandler) CacheInvalidate(c *fiber.Ctx) error {
	h.cache.Invalidate()
	return c.JSON(models.APIResponse{Success: true, Data: "cache invalidated"})
}
