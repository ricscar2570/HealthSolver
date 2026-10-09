const configured =
  (typeof window !== 'undefined' && window.__HEALTHSOLVER_API_BASE_URL__) ||
  'http://localhost:8000';

export const API_BASE_URL = String(configured).replace(/\/+$/, '');

export const apiUrl = (path) => {
  const normalized = String(path || '').startsWith('/') ? String(path) : '/' + String(path || '');
  return API_BASE_URL + normalized;
};
