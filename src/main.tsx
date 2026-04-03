import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Apply persisted theme before first render to prevent flash
const storedTheme = localStorage.getItem('finio-theme') ?? 'light';
const resolvedTheme = storedTheme === 'system'
  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  : storedTheme;
document.documentElement.classList.add(resolvedTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
