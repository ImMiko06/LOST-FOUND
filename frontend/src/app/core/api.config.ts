const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const API_BASE_URL = isLocalhost
  ? 'http://127.0.0.1:8000/api'
  : 'https://your-render-backend.onrender.com/api';
