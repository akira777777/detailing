/**
 * Service Worker Registration Utility
 * Handles registration, updates, and communication with the Service Worker
 */

(function() {
  'use strict';

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Workers not supported');
    return;
  }

  const SW_URL = '/service-worker.js';
  let swRegistration = null;
  let isUpdateAvailable = false;

  /**
   * Register the Service Worker
   */
  async function register() {
    try {
      swRegistration = await navigator.serviceWorker.register(SW_URL, {
        scope: '/',
        updateViaCache: 'imports'
      });

      console.log('[SW] Registered:', swRegistration.scope);

      // Handle updates
      swRegistration.addEventListener('updatefound', () => {
        const newWorker = swRegistration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New update available
            console.log('[SW] New version available');
            isUpdateAvailable = true;
            showUpdateNotification();
          }
        });
      });

      // Listen for messages from SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          console.log('[SW] Service Worker updated');
        }
      });

      return swRegistration;
    } catch (error) {
      console.error('[SW] Registration failed:', error);
      throw error;
    }
  }

  /**
   * Unregister the Service Worker
   */
  async function unregister() {
    if (!swRegistration) return;
    
    const result = await swRegistration.unregister();
    console.log('[SW] Unregistered:', result);
    return result;
  }

  /**
   * Check for Service Worker updates
   */
  async function checkForUpdates() {
    if (!swRegistration) return;
    
    try {
      await swRegistration.update();
      console.log('[SW] Update check complete');
    } catch (error) {
      console.error('[SW] Update check failed:', error);
    }
  }

  /**
   * Skip waiting and activate new Service Worker
   */
  async function skipWaiting() {
    if (!swRegistration || !swRegistration.waiting) return;
    
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  /**
   * Clear all caches
   */
  async function clearCaches() {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          resolve(true);
        } else {
          reject(new Error('Failed to clear caches'));
        }
      };

      if (swRegistration && swRegistration.active) {
        swRegistration.active.postMessage(
          { type: 'CLEAR_CACHES' },
          [messageChannel.port2]
        );
      } else {
        reject(new Error('No active Service Worker'));
      }
    });
  }

  /**
   * Get cache status
   */
  async function getCacheStatus() {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      if (swRegistration && swRegistration.active) {
        swRegistration.active.postMessage(
          { type: 'GET_CACHE_STATUS' },
          [messageChannel.port2]
        );
      } else {
        reject(new Error('No active Service Worker'));
      }
    });
  }

  /**
   * Show update notification UI
   */
  function showUpdateNotification() {
    // Dispatch custom event for app to handle
    window.dispatchEvent(new CustomEvent('sw-update-available', {
      detail: { skipWaiting, checkForUpdates }
    }));

    // Also show a simple notification if no handler is set
    if (typeof window.showUpdateUI !== 'function') {
      console.log('[SW] Update available. Call skipWaiting() to update.');
    }
  }

  /**
   * Check if app is running in standalone mode (PWA)
   */
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  /**
   * Check if app is online
   */
  function isOnline() {
    return navigator.onLine;
  }

  // Register on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', register);
  } else {
    register();
  }

  // Periodic update checks (every hour)
  setInterval(checkForUpdates, 60 * 60 * 1000);

  // Check for updates when coming back online
  window.addEventListener('online', () => {
    console.log('[SW] Back online, checking for updates...');
    checkForUpdates();
  });

  // Expose API globally
  window.serviceWorkerAPI = {
    register,
    unregister,
    checkForUpdates,
    skipWaiting,
    clearCaches,
    getCacheStatus,
    isStandalone,
    isOnline,
    get registration() { return swRegistration; },
    get isUpdateAvailable() { return isUpdateAvailable; }
  };

})();
