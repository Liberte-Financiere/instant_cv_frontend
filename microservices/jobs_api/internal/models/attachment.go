package models

import "time"

type Attachment struct {
	ID           int        `json:"id"`
	OriginalURL  *string    `json:"original_url,omitempty"`
	Filename     *string    `json:"filename,omitempty"`
	FileType     *string    `json:"file_type,omitempty"`
	MimeType     *string    `json:"mime_type,omitempty"`
	FileSize     *int64     `json:"file_size,omitempty"`
	StorageURL   *string    `json:"storage_url,omitempty"`
	IsDownloaded bool       `json:"is_downloaded"`
	CreatedAt    time.Time  `json:"created_at"`
}
