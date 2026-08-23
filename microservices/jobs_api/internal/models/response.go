package models

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
}

type Meta struct {
	Total      int    `json:"total"`
	Limit      int    `json:"limit"`
	NextCursor string `json:"next_cursor,omitempty"`
	PrevCursor string `json:"prev_cursor,omitempty"`
}

type SuggestItem struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Type  string `json:"type"`
}
