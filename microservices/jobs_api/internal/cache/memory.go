package cache

import (
	"sync"
	"time"
)

type entry struct {
	data      interface{}
	expiresAt time.Time
}

// MemoryCache is a simple thread-safe in-memory cache with TTL support.
// It will be replaced by Redis in a future iteration.
type MemoryCache struct {
	mu      sync.RWMutex
	entries map[string]entry
}

func New() *MemoryCache {
	c := &MemoryCache{
		entries: make(map[string]entry),
	}
	go c.cleanup()
	return c
}

func (c *MemoryCache) Get(key string) (interface{}, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	e, exists := c.entries[key]
	if !exists {
		return nil, false
	}
	if time.Now().After(e.expiresAt) {
		return nil, false
	}
	return e.data, true
}

func (c *MemoryCache) Set(key string, data interface{}, ttl time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.entries[key] = entry{
		data:      data,
		expiresAt: time.Now().Add(ttl),
	}
}

func (c *MemoryCache) Invalidate() {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.entries = make(map[string]entry)
}

// cleanup removes expired entries every 2 minutes to prevent memory leaks.
func (c *MemoryCache) cleanup() {
	ticker := time.NewTicker(2 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		c.mu.Lock()
		now := time.Now()
		for key, e := range c.entries {
			if now.After(e.expiresAt) {
				delete(c.entries, key)
			}
		}
		c.mu.Unlock()
	}
}
