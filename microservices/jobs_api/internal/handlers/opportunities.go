package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jobsira/jobs-api/internal/cache"
	"github.com/jobsira/jobs-api/internal/config"
	"github.com/jobsira/jobs-api/internal/models"
)

type OpportunityHandler struct {
	db    *pgxpool.Pool
	cache *cache.MemoryCache
	cfg   *config.Config
}

func NewOpportunityHandler(db *pgxpool.Pool, cache *cache.MemoryCache, cfg *config.Config) *OpportunityHandler {
	return &OpportunityHandler{db: db, cache: cache, cfg: cfg}
}

// List returns paginated opportunities with optional filters.
// GET /api/v1/opportunities?type=JOB_LOCAL&sector=INFORMATIQUE_TECH&country=Burkina+Faso&search=dev&limit=20&cursor=100
func (h *OpportunityHandler) List(c *fiber.Ctx) error {
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	if limit < 1 || limit > 100 {
		limit = 20
	}

	cursor, _ := strconv.Atoi(c.Query("cursor", "0"))

	conditions := []string{"status = 'ACTIVE'", "(deadline IS NULL OR deadline >= NOW())"}
	args := []interface{}{}
	argIndex := 1

	if v := c.Query("type"); v != "" {
		types := strings.Split(v, ",")
		placeholders := make([]string, len(types))
		for i, t := range types {
			placeholders[i] = fmt.Sprintf("$%d", argIndex)
			args = append(args, strings.TrimSpace(t))
			argIndex++
		}
		conditions = append(conditions, fmt.Sprintf("opportunity_type IN (%s)", strings.Join(placeholders, ",")))
	}

	if v := c.Query("sector"); v != "" {
		conditions = append(conditions, fmt.Sprintf("sector = $%d", argIndex))
		args = append(args, v)
		argIndex++
	}

	if v := c.Query("country"); v != "" {
		conditions = append(conditions, fmt.Sprintf("country = $%d", argIndex))
		args = append(args, v)
		argIndex++
	}

	if v := c.Query("contract"); v != "" {
		conditions = append(conditions, fmt.Sprintf("contract_type = $%d", argIndex))
		args = append(args, v)
		argIndex++
	}

	if v := c.Query("work_mode"); v != "" {
		conditions = append(conditions, fmt.Sprintf("work_mode = $%d", argIndex))
		args = append(args, v)
		argIndex++
	}

	if v := c.Query("remote"); v == "true" {
		conditions = append(conditions, "remote_allowed = true")
	}

	if v := c.Query("search"); v != "" {
		conditions = append(conditions, fmt.Sprintf("(title ILIKE $%d OR organization ILIKE $%d)", argIndex, argIndex))
		args = append(args, "%"+v+"%")
		argIndex++
	}

	if cursor > 0 {
		conditions = append(conditions, fmt.Sprintf("id < $%d", argIndex))
		args = append(args, cursor)
		argIndex++
	}

	where := strings.Join(conditions, " AND ")

	// Count total matching results (without cursor/limit)
	countConditions := []string{"status = 'ACTIVE'", "(deadline IS NULL OR deadline >= NOW())"}
	countArgs := []interface{}{}
	countArgIndex := 1

	if v := c.Query("type"); v != "" {
		types := strings.Split(v, ",")
		placeholders := make([]string, len(types))
		for i, t := range types {
			placeholders[i] = fmt.Sprintf("$%d", countArgIndex)
			countArgs = append(countArgs, strings.TrimSpace(t))
			countArgIndex++
		}
		countConditions = append(countConditions, fmt.Sprintf("opportunity_type IN (%s)", strings.Join(placeholders, ",")))
	}
	if v := c.Query("sector"); v != "" {
		countConditions = append(countConditions, fmt.Sprintf("sector = $%d", countArgIndex))
		countArgs = append(countArgs, v)
		countArgIndex++
	}
	if v := c.Query("country"); v != "" {
		countConditions = append(countConditions, fmt.Sprintf("country = $%d", countArgIndex))
		countArgs = append(countArgs, v)
		countArgIndex++
	}
	if v := c.Query("contract"); v != "" {
		countConditions = append(countConditions, fmt.Sprintf("contract_type = $%d", countArgIndex))
		countArgs = append(countArgs, v)
		countArgIndex++
	}
	if v := c.Query("work_mode"); v != "" {
		countConditions = append(countConditions, fmt.Sprintf("work_mode = $%d", countArgIndex))
		countArgs = append(countArgs, v)
		countArgIndex++
	}
	if v := c.Query("remote"); v == "true" {
		countConditions = append(countConditions, "remote_allowed = true")
	}
	if v := c.Query("search"); v != "" {
		countConditions = append(countConditions, fmt.Sprintf("(title ILIKE $%d OR organization ILIKE $%d)", countArgIndex, countArgIndex))
		countArgs = append(countArgs, "%"+v+"%")
		countArgIndex++
	}

	countWhere := strings.Join(countConditions, " AND ")
	var total int
	err := h.db.QueryRow(context.Background(),
		fmt.Sprintf("SELECT COUNT(*) FROM opportunities WHERE %s", countWhere),
		countArgs...,
	).Scan(&total)
	if err != nil {
		return c.Status(500).JSON(models.APIResponse{Success: false, Error: "failed to count opportunities"})
	}

	args = append(args, limit)
	query := fmt.Sprintf(`
		SELECT id, title, opportunity_type, work_mode, contract_type, sector, organization,
			   experience_level, education_level, salary_min, salary_max, salary_currency,
			   country, city, remote_allowed, deadline, published_at, priority_score,
			   source_name, tags_json, positions_count, views_count, clicks_count
		FROM opportunities
		WHERE %s
		ORDER BY priority_score DESC, published_at DESC NULLS LAST, id DESC
		LIMIT $%d
	`, where, argIndex)

	rows, err := h.db.Query(context.Background(), query, args...)
	if err != nil {
		return c.Status(500).JSON(models.APIResponse{Success: false, Error: "failed to query opportunities"})
	}
	defer rows.Close()

	items := make([]models.OpportunityListItem, 0)
	var lastID int
	for rows.Next() {
		var item models.OpportunityListItem
		var tagsJSON *string
		err := rows.Scan(
			&item.ID, &item.Title, &item.OpportunityType, &item.WorkMode, &item.ContractType,
			&item.Sector, &item.Organization, &item.ExperienceLevel, &item.EducationLevel,
			&item.SalaryMin, &item.SalaryMax, &item.SalaryCurrency,
			&item.Country, &item.City, &item.RemoteAllowed, &item.Deadline,
			&item.PublishedAt, &item.PriorityScore, &item.SourceName, &tagsJSON, &item.PositionsCount,
			&item.ViewsCount, &item.ClicksCount,
		)
		if err != nil {
			continue
		}
		item.Tags = parseJSONArray(tagsJSON)
		items = append(items, item)
		lastID = item.ID
	}

	var nextCursor string
	if len(items) == limit {
		nextCursor = strconv.Itoa(lastID)
	}

	return c.JSON(models.APIResponse{
		Success: true,
		Data:    items,
		Meta: &models.Meta{
			Total:      total,
			Limit:      limit,
			NextCursor: nextCursor,
		},
	})
}

// GetByID returns a single opportunity with its attachments.
// GET /api/v1/opportunities/:id
func (h *OpportunityHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.APIResponse{Success: false, Error: "invalid opportunity ID"})
	}

	var opp models.Opportunity
	var tagsJSON, docsJSON, countriesJSON *string

	err = h.db.QueryRow(context.Background(), `
		SELECT id, title, reference, opportunity_type, work_mode, contract_type, sector,
			   organization, experience_level, education_level, salary_min, salary_max,
			   salary_currency, salary_period, positions_count, gender_requirement,
			   age_min, age_max, application_url, application_email, application_method,
			   application_instructions, contact_name, contact_email, contact_phone,
			   requires_cv, requires_cover_letter, required_documents_json,
			   published_at, deadline, location, country, city, region,
			   remote_allowed, countries_eligible_json, source_name, source_url,
			   description, priority_score, status, tags_json, views_count, clicks_count
		FROM opportunities WHERE id = $1 AND status = 'ACTIVE'
	`, id).Scan(
		&opp.ID, &opp.Title, &opp.Reference, &opp.OpportunityType, &opp.WorkMode,
		&opp.ContractType, &opp.Sector, &opp.Organization, &opp.ExperienceLevel,
		&opp.EducationLevel, &opp.SalaryMin, &opp.SalaryMax, &opp.SalaryCurrency,
		&opp.SalaryPeriod, &opp.PositionsCount, &opp.GenderRequirement,
		&opp.AgeMin, &opp.AgeMax, &opp.ApplicationURL, &opp.ApplicationEmail,
		&opp.ApplicationMethod, &opp.ApplicationInstructions,
		&opp.ContactName, &opp.ContactEmail, &opp.ContactPhone,
		&opp.RequiresCV, &opp.RequiresCoverLetter, &docsJSON,
		&opp.PublishedAt, &opp.Deadline, &opp.Location, &opp.Country, &opp.City,
		&opp.Region, &opp.RemoteAllowed, &countriesJSON, &opp.SourceName, &opp.SourceURL,
		&opp.Description, &opp.PriorityScore, &opp.Status, &tagsJSON, &opp.ViewsCount, &opp.ClicksCount,
	)
	if err != nil {
		return c.Status(404).JSON(models.APIResponse{Success: false, Error: "opportunity not found"})
	}

	opp.Tags = parseJSONArray(tagsJSON)
	opp.RequiredDocuments = parseJSONArray(docsJSON)
	opp.CountriesEligible = parseJSONArray(countriesJSON)

	// Fetch attachments
	attachRows, err := h.db.Query(context.Background(), `
		SELECT id, original_url, filename, file_type, mime_type, file_size,
			   storage_url, is_downloaded, created_at
		FROM opportunity_attachments
		WHERE opportunity_id = $1
	`, id)
	if err == nil {
		defer attachRows.Close()
		for attachRows.Next() {
			var a models.Attachment
			if err := attachRows.Scan(
				&a.ID, &a.OriginalURL, &a.Filename, &a.FileType, &a.MimeType,
				&a.FileSize, &a.StorageURL, &a.IsDownloaded, &a.CreatedAt,
			); err == nil {
				opp.Attachments = append(opp.Attachments, a)
			}
		}
	}
	if opp.Attachments == nil {
		opp.Attachments = []models.Attachment{}
	}

	return c.JSON(models.APIResponse{Success: true, Data: opp})
}

// Similar returns opportunities in the same sector/country, excluding the current one.
// GET /api/v1/opportunities/:id/similar
func (h *OpportunityHandler) Similar(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(models.APIResponse{Success: false, Error: "invalid opportunity ID"})
	}

	var sector, country string
	err = h.db.QueryRow(context.Background(),
		"SELECT sector, country FROM opportunities WHERE id = $1", id,
	).Scan(&sector, &country)
	if err != nil {
		return c.Status(404).JSON(models.APIResponse{Success: false, Error: "opportunity not found"})
	}

	rows, err := h.db.Query(context.Background(), `
		SELECT id, title, opportunity_type, work_mode, contract_type, sector, organization,
			   experience_level, education_level, salary_min, salary_max, salary_currency,
			   country, city, remote_allowed, deadline, published_at, priority_score,
			   source_name, tags_json, positions_count, views_count, clicks_count
		FROM opportunities
		WHERE status = 'ACTIVE' AND id != $1 AND (sector = $2 OR country = $3) AND (deadline IS NULL OR deadline >= NOW())
		ORDER BY
			CASE WHEN sector = $2 AND country = $3 THEN 0
				 WHEN sector = $2 THEN 1
				 ELSE 2
			END,
			priority_score DESC, published_at DESC NULLS LAST
		LIMIT 6
	`, id, sector, country)
	if err != nil {
		return c.Status(500).JSON(models.APIResponse{Success: false, Error: "failed to query similar opportunities"})
	}
	defer rows.Close()

	items := scanListItems(rows)
	return c.JSON(models.APIResponse{Success: true, Data: items})
}

// Trending returns high-priority, recently published opportunities.
// GET /api/v1/opportunities/trending
func (h *OpportunityHandler) Trending(c *fiber.Ctx) error {
	cacheKey := "trending"
	if data, ok := h.cache.Get(cacheKey); ok {
		return c.JSON(models.APIResponse{Success: true, Data: data})
	}

	rows, err := h.db.Query(context.Background(), `
		SELECT id, title, opportunity_type, work_mode, contract_type, sector, organization,
			   experience_level, education_level, salary_min, salary_max, salary_currency,
			   country, city, remote_allowed, deadline, published_at, priority_score,
			   source_name, tags_json, positions_count, views_count, clicks_count
		FROM opportunities
		WHERE status = 'ACTIVE' AND (deadline IS NULL OR deadline >= NOW())
		ORDER BY priority_score DESC, published_at DESC NULLS LAST
		LIMIT 12
	`)
	if err != nil {
		return c.Status(500).JSON(models.APIResponse{Success: false, Error: "failed to query trending"})
	}
	defer rows.Close()

	items := scanListItems(rows)
	h.cache.Set(cacheKey, items, h.cfg.CacheTTLDefault)

	return c.JSON(models.APIResponse{Success: true, Data: items})
}

// ExpiringSoon returns active opportunities whose deadline is within the next 7 days.
// GET /api/v1/opportunities/expiring-soon
func (h *OpportunityHandler) ExpiringSoon(c *fiber.Ctx) error {
	cacheKey := "expiring-soon"
	if data, ok := h.cache.Get(cacheKey); ok {
		return c.JSON(models.APIResponse{Success: true, Data: data})
	}

	rows, err := h.db.Query(context.Background(), `
		SELECT id, title, opportunity_type, work_mode, contract_type, sector, organization,
			   experience_level, education_level, salary_min, salary_max, salary_currency,
			   country, city, remote_allowed, deadline, published_at, priority_score,
			   source_name, tags_json, positions_count, views_count, clicks_count
		FROM opportunities
		WHERE status = 'ACTIVE'
			AND deadline IS NOT NULL
			AND deadline > NOW()
			AND deadline <= NOW() + INTERVAL '7 days'
		ORDER BY deadline ASC
		LIMIT 20
	`)
	if err != nil {
		return c.Status(500).JSON(models.APIResponse{Success: false, Error: "failed to query expiring opportunities"})
	}
	defer rows.Close()

	items := scanListItems(rows)
	h.cache.Set(cacheKey, items, h.cfg.CacheTTLDefault)

	return c.JSON(models.APIResponse{Success: true, Data: items})
}

// scanListItems scans rows into OpportunityListItem slice. Shared helper.
func scanListItems(rows interface{ Next() bool; Scan(dest ...interface{}) error }) []models.OpportunityListItem {
	items := make([]models.OpportunityListItem, 0)
	for rows.Next() {
		var item models.OpportunityListItem
		var tagsJSON *string
		err := rows.Scan(
			&item.ID, &item.Title, &item.OpportunityType, &item.WorkMode, &item.ContractType,
			&item.Sector, &item.Organization, &item.ExperienceLevel, &item.EducationLevel,
			&item.SalaryMin, &item.SalaryMax, &item.SalaryCurrency,
			&item.Country, &item.City, &item.RemoteAllowed, &item.Deadline,
			&item.PublishedAt, &item.PriorityScore, &item.SourceName, &tagsJSON, &item.PositionsCount,
			&item.ViewsCount, &item.ClicksCount,
		)
		if err != nil {
			continue
		}
		item.Tags = parseJSONArray(tagsJSON)
		items = append(items, item)
	}
	return items
}

func parseJSONArray(raw *string) []string {
	if raw == nil || *raw == "" {
		return []string{}
	}
	var result []string
	if err := json.Unmarshal([]byte(*raw), &result); err != nil {
		return []string{}
	}
	return result
}

// unused import guard
var _ = time.Now
