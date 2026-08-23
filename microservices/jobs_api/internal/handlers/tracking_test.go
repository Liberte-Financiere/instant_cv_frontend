package handlers

import (
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestTrackingHandler_InvalidID(t *testing.T) {
	// Setup Fiber app
	app := fiber.New()
	
	// Create handler with a nil db (we expect it to fail before hitting the db)
	h := NewTrackingHandler(nil)
	
	app.Post("/api/v1/opportunities/:id/view", h.RecordView)
	app.Post("/api/v1/opportunities/:id/click", h.RecordClick)

	tests := []struct {
		name     string
		endpoint string
	}{
		{"RecordView with invalid ID", "/api/v1/opportunities/invalid/view"},
		{"RecordClick with invalid ID", "/api/v1/opportunities/invalid/click"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", tt.endpoint, nil)
			resp, err := app.Test(req)
			
			assert.NoError(t, err)
			assert.Equal(t, 400, resp.StatusCode)
		})
	}
}
