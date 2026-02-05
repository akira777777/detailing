// Caching utilities for improved performance

class MemoryCache {
  constructor(defaultTTL = 300000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  // Set cache value with TTL
  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expiry
    });
    
    // Clean expired entries periodically
    if (this.cache.size > 1000) {
      this.cleanup();
    }
  }

  // Get cache value
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  // Delete cache entry
  delete(key) {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  stats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;
    
    for (const item of this.cache.values()) {
      if (now > item.expiry) {
        expired++;
      } else {
        active++;
      }
    }
    
    return {
      total: this.cache.size,
      active,
      expired,
      hitRate: this.hitRate || 0
    };
  }
}

// Create global cache instances
export const caches = {
  // Service data cache (longer TTL)
  services: new MemoryCache(1800000), // 30 minutes
  
  // User session cache
  sessions: new MemoryCache(3600000), // 1 hour
  
  // Booking data cache (shorter TTL)
  bookings: new MemoryCache(300000), // 5 minutes
  
  // Vehicle data cache
  vehicles: new MemoryCache(600000) // 10 minutes
};

// Cache decorator for async functions
export function cached(cacheKey, ttl, cacheInstance = caches.services) {
  return function(target, propertyName, descriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function(...args) {
      const key = typeof cacheKey === 'function' 
        ? cacheKey.apply(this, args) 
        : cacheKey;
      
      // Try to get from cache first
      const cachedResult = cacheInstance.get(key);
      if (cachedResult !== null) {
        return cachedResult;
      }
      
      // Execute original method
      const result = await method.apply(this, args);
      
      // Store in cache
      cacheInstance.set(key, result, ttl);
      
      return result;
    };
    
    return descriptor;
  };
}

// Database query caching wrapper
export async function cachedQuery(queryFunction, cacheKey, ttl = 300000, cacheInstance = caches.services) {
  try {
    // Try cache first
    const cachedResult = cacheInstance.get(cacheKey);
    if (cachedResult !== null) {
      return cachedResult;
    }
    
    // Execute query
    const result = await queryFunction();
    
    // Cache result
    cacheInstance.set(cacheKey, result, ttl);
    
    return result;
  } catch (error) {
    console.error('Cached query error:', error);
    throw error;
  }
}

// Bulk cache operations
export function bulkCacheOperations(operations) {
  return Promise.all(
    operations.map(({ key, value, ttl, cacheInstance = caches.services }) => {
      return cacheInstance.set(key, value, ttl);
    })
  );
}

// Cache warming functions
export async function warmServiceCaches(db) {
  try {
    // Warm service packages cache
    const packages = await cachedQuery(
      () => db.query('SELECT * FROM service_packages WHERE is_active = true'),
      'service_packages:active',
      1800000
    );
    
    // Warm service modules cache
    const modules = await cachedQuery(
      () => db.query('SELECT * FROM service_modules WHERE is_active = true'),
      'service_modules:active',
      1800000
    );
    
    console.log('✅ Service caches warmed successfully');
    return { packages, modules };
  } catch (error) {
    console.error('❌ Failed to warm service caches:', error);
    throw error;
  }
}

// Cache invalidation helpers
export function invalidateRelatedCaches(entityType) {
  switch (entityType) {
    case 'booking':
      caches.bookings.clear();
      break;
    case 'vehicle':
      caches.vehicles.clear();
      break;
    case 'service':
      caches.services.clear();
      break;
    case 'user':
      caches.sessions.clear();
      break;
    default:
      // Clear all caches for safety
      Object.values(caches).forEach(cache => cache.clear());
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  start(label) {
    this.metrics.set(label, {
      start: process.hrtime.bigint(),
      count: 0
    });
  }

  end(label) {
    const metric = this.metrics.get(label);
    if (metric) {
      const end = process.hrtime.bigint();
      const duration = Number(end - metric.start) / 1000000; // Convert to milliseconds
      
      metric.count++;
      metric.totalTime = (metric.totalTime || 0) + duration;
      metric.avgTime = metric.totalTime / metric.count;
      metric.maxTime = Math.max(metric.maxTime || 0, duration);
      metric.minTime = Math.min(metric.minTime || Infinity, duration);
      
      this.metrics.set(label, metric);
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  reset() {
    this.metrics.clear();
  }
}

export const perfMonitor = new PerformanceMonitor();

// Export cache utilities
export { MemoryCache };
export default { caches, cached, cachedQuery, perfMonitor };