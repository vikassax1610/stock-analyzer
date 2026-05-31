import axios from 'axios';

// Base API client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data and handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Redirect to login if not already on the login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Network error';
    return Promise.reject(new Error(message));
  }
);

// ─── Stock APIs ───────────────────────────────────────────────────────────────

export const fetchStockSignal = (symbol) =>
  api.get(`/stock/${encodeURIComponent(symbol)}`);

export const fetchChartData = (symbol, period = '6mo') =>
  api.get(`/stock/chart/${encodeURIComponent(symbol)}?period=${period}`);

// ─── Market APIs ──────────────────────────────────────────────────────────────

export const fetchMarketOverview = () =>
  api.get('/market/overview');

export const fetchGainers = (limit = 10) =>
  api.get(`/market/gainers?limit=${limit}`);

export const fetchLosers = (limit = 10) =>
  api.get(`/market/losers?limit=${limit}`);

export const fetchMovers = (limit = 10) =>
  api.get(`/market/movers?limit=${limit}`);

export const fetchRecommendations = (limit = 10, minPrice = null, maxPrice = null) => {
  let url = `/market/recommendations?limit=${limit}`;
  if (minPrice !== null) url += `&minPrice=${minPrice}`;
  if (maxPrice !== null) url += `&maxPrice=${maxPrice}`;
  return api.get(url);
};

export const refreshRecommendations = (limit = 10, minPrice = null, maxPrice = null) => {
  let url = `/market/recommendations/refresh?limit=${limit}`;
  if (minPrice !== null) url += `&minPrice=${minPrice}`;
  if (maxPrice !== null) url += `&maxPrice=${maxPrice}`;
  return api.post(url);
};

// ─── Signal APIs ──────────────────────────────────────────────────────────────

export const fetchRecentSignals = (limit = 20) =>
  api.get(`/signals/recent?limit=${limit}`);

export const fetchSignalHistory = (symbol, limit = 50) =>
  api.get(`/signals/history/${encodeURIComponent(symbol)}?limit=${limit}`);

// ─── Options APIs ─────────────────────────────────────────────────────────────

export const fetchOptionsSignal = (symbol) =>
  api.get(`/options/${encodeURIComponent(symbol)}`);

// ─── Watchlist APIs ───────────────────────────────────────────────────────────

export const fetchWatchlist = () =>
  api.get('/watchlist');

export const addToWatchlistAPI = (symbol, companyName = '') =>
  api.post('/watchlist', { symbol, companyName });

export const removeFromWatchlistAPI = (symbol) =>
  api.delete(`/watchlist/${encodeURIComponent(symbol)}`);

// ─── Auth APIs ────────────────────────────────────────────────────────────────

export const loginAPI = (email, password) =>
  api.post('/auth/login', { email, password });

export default api;

