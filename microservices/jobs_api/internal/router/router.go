package router

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jobsira/jobs-api/internal/cache"
	"github.com/jobsira/jobs-api/internal/config"
	"github.com/jobsira/jobs-api/internal/handlers"
	"github.com/jobsira/jobs-api/internal/middleware"
)

func Setup(app *fiber.App, db *pgxpool.Pool, c *cache.MemoryCache, cfg *config.Config) {
	// Global middleware
	app.Use(middleware.Recovery())
	app.Use(middleware.Logger())
	app.Use(middleware.CORS(cfg.CORSAllowedOrigins))
	app.Use(middleware.RateLimit(100, 1*time.Minute))

	// Initialize handlers
	oppHandler := handlers.NewOpportunityHandler(db, c, cfg)
	searchHandler := handlers.NewSearchHandler(db)
	filtersHandler := handlers.NewFiltersHandler(db, c, cfg)
	statsHandler := handlers.NewStatsHandler(db, c, cfg)
	trackingHandler := handlers.NewTrackingHandler(db)
	internalHandler := handlers.NewInternalHandler(db, c)

	api := app.Group("/api/v1")

	// Public routes
	api.Get("/opportunities", oppHandler.List)
	api.Get("/opportunities/trending", oppHandler.Trending)
	api.Get("/opportunities/expiring-soon", oppHandler.ExpiringSoon)
	api.Get("/opportunities/:id", oppHandler.GetByID)
	api.Get("/opportunities/:id/similar", oppHandler.Similar)

	api.Get("/search/suggest", searchHandler.Suggest)
	api.Get("/filters", filtersHandler.GetFilters)

	api.Get("/stats", statsHandler.GetStats)
	api.Get("/stats/distribution", statsHandler.GetDistribution)

	// Tracking routes (lightweight writes)
	api.Post("/opportunities/:id/view", trackingHandler.RecordView)
	api.Post("/opportunities/:id/click", trackingHandler.RecordClick)

	// Infrastructure routes (protected by API key)
	api.Get("/health", internalHandler.Health)

	internal := api.Group("/internal", middleware.APIKeyAuth(cfg.APIKey))
	internal.Post("/cache/invalidate", internalHandler.CacheInvalidate)
}
