package handlers

import (
	"context"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jobsira/jobs-api/internal/models"
)

type TrackingHandler struct {
	db *pgxpool.Pool
}

func NewTrackingHandler(db *pgxpool.Pool) *TrackingHandler {
	return &TrackingHandler{db: db}
}

// RecordView increments the view counter for an opportunity.
// POST /api/v1/opportunities/:id/view
func (h *TrackingHandler) RecordView(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.APIResponse{Success: false, Error: "invalid ID"})
	}

	// Fire-and-forget: we don't block the response on the DB write
	go func() {
		h.db.Exec(context.Background(),
			"UPDATE opportunities SET priority_score = priority_score + 1, views_count = views_count + 1 WHERE id = $1", id)
	}()

	return c.JSON(models.APIResponse{Success: true})
}

// RecordClick tracks when a user clicks the "Apply" button.
// POST /api/v1/opportunities/:id/click
func (h *TrackingHandler) RecordClick(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.APIResponse{Success: false, Error: "invalid ID"})
	}

	// Increment both priority_score (for trending algorithm) and clicks_count (for analytics)
	go func() {
		h.db.Exec(context.Background(),
			"UPDATE opportunities SET priority_score = priority_score + 2, clicks_count = clicks_count + 1 WHERE id = $1", id)
	}()

	return c.JSON(models.APIResponse{Success: true})
}
