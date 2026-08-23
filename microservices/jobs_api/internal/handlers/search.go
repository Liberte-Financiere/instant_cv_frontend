package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jobsira/jobs-api/internal/models"
)

type SearchHandler struct {
	db *pgxpool.Pool
}

func NewSearchHandler(db *pgxpool.Pool) *SearchHandler {
	return &SearchHandler{db: db}
}

// Suggest returns autocomplete suggestions based on a partial query.
// GET /api/v1/search/suggest?q=ingén
func (h *SearchHandler) Suggest(c *fiber.Ctx) error {
	q := c.Query("q")
	if len(q) < 2 {
		return c.JSON(models.APIResponse{Success: true, Data: []models.SuggestItem{}})
	}

	rows, err := h.db.Query(context.Background(), `
		SELECT id, title, opportunity_type
		FROM opportunities
		WHERE status = 'ACTIVE' AND title ILIKE $1
		ORDER BY priority_score DESC
		LIMIT 10
	`, "%"+q+"%")
	if err != nil {
		return c.Status(500).JSON(models.APIResponse{Success: false, Error: "search failed"})
	}
	defer rows.Close()

	suggestions := make([]models.SuggestItem, 0)
	for rows.Next() {
		var s models.SuggestItem
		if err := rows.Scan(&s.ID, &s.Title, &s.Type); err == nil {
			suggestions = append(suggestions, s)
		}
	}

	return c.JSON(models.APIResponse{Success: true, Data: suggestions})
}
