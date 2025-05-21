
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make sure we wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found!");
  }

  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
