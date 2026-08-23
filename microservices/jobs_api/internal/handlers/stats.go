package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jobsira/jobs-api/internal/cache"
	"github.com/jobsira/jobs-api/internal/config"
	"github.com/jobsira/jobs-api/internal/models"
)

type StatsHandler struct {
	db    *pgxpool.Pool
	cache *cache.MemoryCache
	cfg   *config.Config
}

func NewStatsHandler(db *pgxpool.Pool, cache *cache.MemoryCache, cfg *config.Config) *StatsHandler {
	return &StatsHandler{db: db, cache: cache, cfg: cfg}
}

// GetStats returns global counters for the platform.
// GET /api/v1/stats
func (h *StatsHandler) GetStats(c *fiber.Ctx) error {
	cacheKey := "stats"
	if data, ok := h.cache.Get(cacheKey); ok {
		return c.JSON(models.APIResponse{Success: true, Data: data})
	}

	stats := models.Stats{ByType: make(map[string]int)}

	h.db.QueryRow(context.Background(),
		"SELECT COUNT(*) FROM opportunities WHERE status = 'ACTIVE'",
	).Scan(&stats.TotalActive)

	h.db.QueryRow(context.Background(),
		"SELECT COUNT(*) FROM opportunities WHERE status = 'ACTIVE' AND published_at >= CURRENT_DATE",
	).Scan(&stats.NewToday)

	h.db.QueryRow(context.Background(),
		"SELECT COUNT(*) FROM opportunities WHERE status = 'ACTIVE' AND deadline IS NOT NULL AND deadline > NOW() AND deadline <= NOW() + INTERVAL '7 days'",
	).Scan(&stats.ExpiringIn7d)

	rows, err := h.db.Query(context.Background(),
		"SELECT opportunity_type, COUNT(*) FROM opportunities WHERE status = 'ACTIVE' GROUP BY opportunity_type",
	)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var t string
			var count int
			if rows.Scan(&t, &count) == nil {
				stats.ByType[t] = count
			}
		}
	}

	h.cache.Set(cacheKey, stats, h.cfg.CacheTTLStats)

	return c.JSON(models.APIResponse{Success: true, Data: stats})
}

// GetDistribution returns opportunity counts grouped by sector and country.
// GET /api/v1/stats/distribution
func (h *StatsHandler) GetDistribution(c *fiber.Ctx) error {
	cacheKey := "distribution"
	if data, ok := h.cache.Get(cacheKey); ok {
		return c.JSON(models.APIResponse{Success: true, Data: data})
	}

	dist := models.Distribution{}

	sectorRows, err := h.db.Query(context.Background(),
		"SELECT sector, COUNT(*) AS cnt FROM opportunities WHERE status = 'ACTIVE' GROUP BY sector ORDER BY cnt DESC LIMIT 15",
	)
	if err == nil {
		defer sectorRows.Close()
		for sectorRows.Next() {
			var item models.DistributionItem
			if sectorRows.Scan(&item.Label, &item.Count) == nil {
				dist.BySector = append(dist.BySector, item)
			}
		}
	}

	countryRows, err := h.db.Query(context.Background(),
		"SELECT country, COUNT(*) AS cnt FROM opportunities WHERE status = 'ACTIVE' GROUP BY country ORDER BY cnt DESC LIMIT 15",
	)
	if err == nil {
		defer countryRows.Close()
		for countryRows.Next() {
			var item models.DistributionItem
			if countryRows.Scan(&item.Label, &item.Count) == nil {
				dist.ByCountry = append(dist.ByCountry, item)
			}
		}
	}

	h.cache.Set(cacheKey, dist, h.cfg.CacheTTLStats)

	return c.JSON(models.APIResponse{Success: true, Data: dist})
}
