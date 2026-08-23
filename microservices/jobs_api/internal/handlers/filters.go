package handlers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jobsira/jobs-api/internal/cache"
	"github.com/jobsira/jobs-api/internal/config"
	"github.com/jobsira/jobs-api/internal/models"
)

type FiltersHandler struct {
	db    *pgxpool.Pool
	cache *cache.MemoryCache
	cfg   *config.Config
}

func NewFiltersHandler(db *pgxpool.Pool, cache *cache.MemoryCache, cfg *config.Config) *FiltersHandler {
	return &FiltersHandler{db: db, cache: cache, cfg: cfg}
}

// GetFilters returns all distinct filter values currently present in the database.
// GET /api/v1/filters
func (h *FiltersHandler) GetFilters(c *fiber.Ctx) error {
	cacheKey := "filters"
	if data, ok := h.cache.Get(cacheKey); ok {
		return c.JSON(models.APIResponse{Success: true, Data: data})
	}

	filters := models.FilterValues{}

	queries := map[string]*[]string{
		"SELECT DISTINCT opportunity_type FROM opportunities WHERE status = 'ACTIVE' ORDER BY 1": &filters.OpportunityTypes,
		"SELECT DISTINCT sector FROM opportunities WHERE status = 'ACTIVE' ORDER BY 1":           &filters.Sectors,
		"SELECT DISTINCT contract_type FROM opportunities WHERE status = 'ACTIVE' ORDER BY 1":    &filters.ContractTypes,
		"SELECT DISTINCT work_mode FROM opportunities WHERE status = 'ACTIVE' ORDER BY 1":        &filters.WorkModes,
		"SELECT DISTINCT experience_level FROM opportunities WHERE status = 'ACTIVE' ORDER BY 1": &filters.ExperienceLevels,
		"SELECT DISTINCT education_level FROM opportunities WHERE status = 'ACTIVE' ORDER BY 1":  &filters.EducationLevels,
		"SELECT DISTINCT country FROM opportunities WHERE status = 'ACTIVE' ORDER BY 1":          &filters.Countries,
		"SELECT DISTINCT city FROM opportunities WHERE status = 'ACTIVE' AND city IS NOT NULL ORDER BY 1": &filters.Cities,
		"SELECT DISTINCT source_name FROM opportunities WHERE status = 'ACTIVE' ORDER BY 1":     &filters.SourceNames,
	}

	for query, target := range queries {
		rows, err := h.db.Query(context.Background(), query)
		if err != nil {
			continue
		}
		values := make([]string, 0)
		for rows.Next() {
			var val string
			if err := rows.Scan(&val); err == nil {
				values = append(values, val)
			}
		}
		rows.Close()
		*target = values
	}

	h.cache.Set(cacheKey, filters, h.cfg.CacheTTLFilters)

	return c.JSON(models.APIResponse{Success: true, Data: filters})
}
