package models

type Stats struct {
	TotalActive    int            `json:"total_active"`
	NewToday       int            `json:"new_today"`
	ExpiringIn7d   int            `json:"expiring_in_7d"`
	ByType         map[string]int `json:"by_type"`
}

type DistributionItem struct {
	Label string `json:"label"`
	Count int    `json:"count"`
}

type Distribution struct {
	BySector  []DistributionItem `json:"by_sector"`
	ByCountry []DistributionItem `json:"by_country"`
}
