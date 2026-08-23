package config

import (
	"fmt"
	"os"
	"time"
)

type Config struct {
	Port                string
	Environment         string
	DatabaseURL         string
	APIKey              string
	CORSAllowedOrigins  string
	CacheTTLDefault     time.Duration
	CacheTTLFilters     time.Duration
	CacheTTLStats       time.Duration
}

func Load() (*Config, error) {
	dbURL := os.Getenv("NEON_DB")
	if dbURL == "" {
		return nil, fmt.Errorf("NEON_DB environment variable is required")
	}

	cfg := &Config{
		Port:               getEnvOrDefault("PORT", "8080"),
		Environment:        getEnvOrDefault("ENVIRONMENT", "development"),
		DatabaseURL:        dbURL,
		APIKey:             getEnvOrDefault("API_KEY", ""),
		CORSAllowedOrigins: getEnvOrDefault("CORS_ALLOWED_ORIGINS", "*"),
		CacheTTLDefault:    parseDuration("CACHE_TTL_DEFAULT", 5*time.Minute),
		CacheTTLFilters:    parseDuration("CACHE_TTL_FILTERS", 30*time.Minute),
		CacheTTLStats:      parseDuration("CACHE_TTL_STATS", 15*time.Minute),
	}

	return cfg, nil
}

func getEnvOrDefault(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func parseDuration(envKey string, fallback time.Duration) time.Duration {
	val := os.Getenv(envKey)
	if val == "" {
		return fallback
	}
	d, err := time.ParseDuration(val)
	if err != nil {
		return fallback
	}
	return d
}
