/**
 * Service Worker for AutoDetailing
 * Implements caching strategies for static assets and API responses
 * Workbox-style approach with vanilla JavaScript (no dependencies)
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Maximum number of entries for API cache
const MAX_API_ENTRIES = 100;

// Image cache expiration time (30 days in milliseconds)
const IMAGE_CACHE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

// Precache critical assets
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico'
];

// ======== UTILITY FUNCTIONS ========

/**
 * Limit the number of entries in a cache
 */
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  
  if (requests.length > maxEntries) {
    // Delete oldest entries (first in, first out)
    const entriesToDelete = requests.slice(0, requests.length - maxEntries);
    await Promise.all(
      entriesToDelete.map(request => cache.delete(request))
    );
  }
}

/**
 * Clean up expired image cache entries
 */
async function cleanupExpiredImages() {
  const cache = await caches.open(IMAGE_CACHE);
  const requests = await cache.keys();
  const now = Date.now();
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const cachedTime = response.headers.get('sw-cached-time');
      if (cachedTime && (now - parseInt(cachedTime, 10)) > IMAGE_CACHE_MAX_AGE) {
        await cache.delete(request);
      }
    }
  }
}

/**
 * Check if a request is an API request
 */
function isAPIRequest(request) {
  return request.url.includes('/api/');
}

/**
 * Check if a request is an image
 */
function isImageRequest(request) {
  const destination = request.destination;
  const acceptHeader = request.headers.get('Accept') || '';
  return destination === 'image' || 
         acceptHeader.includes('image') ||
         /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(request.url);
}

/**
 * Check if a request is a static asset (JS, CSS, fonts)
 */
function isStaticAsset(request) {
  const destination = request.destination;
  const url = request.url;
  
  return destination === 'script' || 
         destination === 'style' ||
         destination === 'font' ||
         /\.(js|css|woff2?|ttf|otf)$/i.test(url);
}

/**
 * Create a response with timestamp header for cache expiration
 */
function createDatedResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cached-time', Date.now().toString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

/**
 * Get offline fallback page
 */
async function getOfflineFallback() {
  const cache = await caches.open(STATIC_CACHE);
  return cache.match('/offline.html');
}

// ======== INSTALL EVENT ========

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching critical assets...');
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[SW] Failed to precache some assets:', err);
          // Continue even if some assets fail
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('[SW] Precaching complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

// ======== ACTIVATE EVENT ========

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('static-') || 
                     cacheName.startsWith('api-') || 
                     cacheName.startsWith('images-');
            })
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== API_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      
      // Clean up expired images
      cleanupExpiredImages(),
      
      // Claim clients immediately
      self.clients.claim()
    ])
    .then(() => {
      console.log('[SW] Activation complete');
    })
    .catch((error) => {
      console.error('[SW] Activation failed:', error);
    })
  );
});

// ======== FETCH EVENT ========

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (except for APIs)
  if (url.origin !== self.location.origin && !isAPIRequest(request)) {
    return;
  }
  
  // Handle different types of requests
  if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    // Default: Cache First for navigation requests
    event.respondWith(handleNavigationRequest(request));
  }
});

// ======== STRATEGY HANDLERS ========

/**
 * Cache First strategy for static assets (JS, CSS, fonts)
 * - Try cache first
 * - Fall back to network
 * - Update cache with network response
 */
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  try {
    // Try cache first
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached response and update in background
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
        })
        .catch(() => {
          // Network failed, but we have cached response
        });
      
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Static asset fetch failed:', error);
    throw error;
  }
}

/**
 * Network First + Stale-While-Revalidate for API responses
 * - Try network first
 - Fall back to cache if offline
 * - Update cache with fresh response
 * - Limit cache size
 */
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // Clone and cache the response
      const responseToCache = networkResponse.clone();
      
      await cache.put(request, responseToCache);
      await limitCacheSize(API_CACHE, MAX_API_ENTRIES);
      
      return networkResponse;
    }
    
    // Network returned error, try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving stale API response from cache');
      return cachedResponse;
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[SW] Network failed, trying cache for API:', request.url);
    
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // No cache available, return offline error response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'You are offline and this data is not cached.' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Cache First with expiration for images
 * - Try cache first
 * - Fall back to network
 * - Store with timestamp for expiration
 */
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  
  try {
    // Check cache first
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if expired
      const cachedTime = cachedResponse.headers.get('sw-cached-time');
      const now = Date.now();
      
      if (!cachedTime || (now - parseInt(cachedTime, 10)) < IMAGE_CACHE_MAX_AGE) {
        // Not expired, return cached response
        return cachedResponse;
      }
      
      // Expired, delete from cache
      await cache.delete(request);
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      // Store with timestamp
      const datedResponse = createDatedResponse(networkResponse.clone());
      await cache.put(request, datedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Image fetch failed:', error);
    
    // Try to return cached version even if expired
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Cache First for navigation requests with offline fallback
 */
async function handleNavigationRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  try {
    // Try cache first for HTML pages
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update in background
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
        })
        .catch(() => {
          // Network failed, cached version is fine
        });
      
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation failed, serving offline page');
    
    // Try to serve cached index.html or offline fallback
    const offlineFallback = await getOfflineFallback();
    if (offlineFallback) {
      return offlineFallback;
    }
    
    // Last resort: try cached index.html
    const indexFallback = await cache.match('/index.html');
    if (indexFallback) {
      return indexFallback;
    }
    
    throw error;
  }
}

// ======== MESSAGE HANDLING ========

self.addEventListener('message', (event) => {
  if (!event.data) return;
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHES':
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        }).then(() => {
          event.ports[0]?.postMessage({ success: true });
        })
      );
      break;
      
    case 'GET_CACHE_STATUS':
      event.waitUntil(
        Promise.all([
          caches.open(STATIC_CACHE).then(c => c.keys()).then(r => r.length),
          caches.open(API_CACHE).then(c => c.keys()).then(r => r.length),
          caches.open(IMAGE_CACHE).then(c => c.keys()).then(r => r.length)
        ]).then(([staticCount, apiCount, imageCount]) => {
          event.ports[0]?.postMessage({
            static: staticCount,
            api: apiCount,
            images: imageCount,
            version: CACHE_VERSION
          });
        })
      );
      break;
      
    default:
      break;
  }
});

// ======== SYNC EVENT (for background sync) ========

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-api-requests') {
    console.log('[SW] Background sync triggered');
    // Handle background sync for queued API requests
    // This can be extended to sync pending requests when coming back online
  }
});

// ======== PUSH EVENT (for push notifications) ========

self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.data || {},
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'AutoDetailing', options)
  );
});

// ======== NOTIFICATION CLICK ========

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

console.log('[SW] Service Worker script loaded');
