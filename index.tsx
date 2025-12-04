import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function mountApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    // If the DOM isn't ready yet, try again later.
    return false;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  return true;
}

// Try to mount immediately; if the script ran before the body was parsed,
// wait for DOMContentLoaded and try again.
if (!mountApp()) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      mountApp();
    });
  } else {
    // document already ready but mount failed for some other reason; attempt once more.
    mountApp();
  }
}
