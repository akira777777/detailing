import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadPolyfills } from './utils/polyfills.js'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration.scope))
      .catch(error => console.log('SW registration failed:', error));
  });
}

// Load polyfills for older browsers before rendering
loadPolyfills().then(() => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}).catch(error => {
  console.error('Failed to load polyfills:', error);
  // Render anyway - polyfills are enhancements, not requirements
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
});
