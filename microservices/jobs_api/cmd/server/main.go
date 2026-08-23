package main

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/jobsira/jobs-api/internal/cache"
	"github.com/jobsira/jobs-api/internal/config"
	"github.com/jobsira/jobs-api/internal/database"
	"github.com/jobsira/jobs-api/internal/router"
)

func main() {
	// Structured JSON logging
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	})))

	cfg, err := config.Load()
	if err != nil {
		slog.Error("failed to load config", "error", err)
		os.Exit(1)
	}

	db, err := database.NewPool(cfg.DatabaseURL)
	if err != nil {
		slog.Error("failed to connect to database", "error", err)
		os.Exit(1)
	}
	defer db.Close()
	slog.Info("database connection established")

	memCache := cache.New()

	app := fiber.New(fiber.Config{
		AppName:      "Jobsira Opportunity API",
		ServerHeader: "",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		},
	})

	router.Setup(app, db, memCache, cfg)

	addr := fmt.Sprintf(":%s", cfg.Port)
	slog.Info("starting server", "port", cfg.Port, "environment", cfg.Environment)
	if err := app.Listen(addr); err != nil {
		slog.Error("server failed", "error", err)
		os.Exit(1)
	}
}
