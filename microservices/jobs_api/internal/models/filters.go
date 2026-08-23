package models

type FilterValues struct {
	OpportunityTypes []string `json:"opportunity_types"`
	Sectors          []string `json:"sectors"`
	ContractTypes    []string `json:"contract_types"`
	WorkModes        []string `json:"work_modes"`
	ExperienceLevels []string `json:"experience_levels"`
	EducationLevels  []string `json:"education_levels"`
	Countries        []string `json:"countries"`
	Cities           []string `json:"cities"`
	SourceNames      []string `json:"source_names"`
}
