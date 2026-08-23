package models

import "time"

type Opportunity struct {
	ID                      int        `json:"id"`
	Title                   string     `json:"title"`
	Reference               *string    `json:"reference,omitempty"`
	OpportunityType         string     `json:"opportunity_type"`
	WorkMode                string     `json:"work_mode"`
	ContractType            string     `json:"contract_type"`
	Sector                  string     `json:"sector"`
	Organization            string     `json:"organization"`
	ExperienceLevel         string     `json:"experience_level"`
	EducationLevel          string     `json:"education_level"`
	SalaryMin               *float64   `json:"salary_min,omitempty"`
	SalaryMax               *float64   `json:"salary_max,omitempty"`
	SalaryCurrency          string     `json:"salary_currency"`
	SalaryPeriod            string     `json:"salary_period"`
	PositionsCount          int        `json:"positions_count"`
	GenderRequirement       *string    `json:"gender_requirement,omitempty"`
	AgeMin                  *int       `json:"age_min,omitempty"`
	AgeMax                  *int       `json:"age_max,omitempty"`
	ApplicationURL          *string    `json:"application_url,omitempty"`
	ApplicationEmail        *string    `json:"application_email,omitempty"`
	ApplicationMethod       string     `json:"application_method"`
	ApplicationInstructions *string    `json:"application_instructions,omitempty"`
	ContactName             *string    `json:"contact_name,omitempty"`
	ContactEmail            *string    `json:"contact_email,omitempty"`
	ContactPhone            *string    `json:"contact_phone,omitempty"`
	RequiresCV              bool       `json:"requires_cv"`
	RequiresCoverLetter     bool       `json:"requires_cover_letter"`
	RequiredDocuments       []string   `json:"required_documents"`
	PublishedAt             *time.Time `json:"published_at,omitempty"`
	Deadline                *time.Time `json:"deadline,omitempty"`
	Location                *string    `json:"location,omitempty"`
	Country                 string     `json:"country"`
	City                    *string    `json:"city,omitempty"`
	Region                  *string    `json:"region,omitempty"`
	RemoteAllowed           bool       `json:"remote_allowed"`
	CountriesEligible       []string   `json:"countries_eligible,omitempty"`
	SourceName              string     `json:"source_name"`
	SourceURL               string     `json:"source_url"`
	Description             *string    `json:"description,omitempty"`
	PriorityScore           int        `json:"priority_score"`
	Status                  string     `json:"status"`
	Tags                    []string   `json:"tags"`
	ViewsCount              int        `json:"views_count"`
	ClicksCount             int        `json:"clicks_count"`
	Attachments             []Attachment `json:"attachments,omitempty"`
}

// OpportunityListItem is a lightweight version for list endpoints.
// Excludes heavy fields like description, application_instructions, raw_content.
type OpportunityListItem struct {
	ID              int        `json:"id"`
	Title           string     `json:"title"`
	OpportunityType string     `json:"opportunity_type"`
	WorkMode        string     `json:"work_mode"`
	ContractType    string     `json:"contract_type"`
	Sector          string     `json:"sector"`
	Organization    string     `json:"organization"`
	ExperienceLevel string     `json:"experience_level"`
	EducationLevel  string     `json:"education_level"`
	SalaryMin       *float64   `json:"salary_min,omitempty"`
	SalaryMax       *float64   `json:"salary_max,omitempty"`
	SalaryCurrency  string     `json:"salary_currency"`
	Country         string     `json:"country"`
	City            *string    `json:"city,omitempty"`
	RemoteAllowed   bool       `json:"remote_allowed"`
	Deadline        *time.Time `json:"deadline,omitempty"`
	PublishedAt     *time.Time `json:"published_at,omitempty"`
	PriorityScore   int        `json:"priority_score"`
	SourceName      string     `json:"source_name"`
	Tags            []string   `json:"tags"`
	PositionsCount  int        `json:"positions_count"`
	ViewsCount      int        `json:"views_count"`
	ClicksCount     int        `json:"clicks_count"`
}
