import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

let inMemoryCsrfToken = '';

function readCookie(name) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : '';
}

export function setCsrfToken(token) {
  if (token) {
    inMemoryCsrfToken = token;
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const csrf = inMemoryCsrfToken || readCookie('modu_csrf_token');
  if (csrf) {
    config.headers['x-csrf-token'] = csrf;
  }
  return config;
});

export const publicApi = {
  getSiteSettings: () => apiClient.get('/public/site-settings').then((r) => r.data.data),
  getDivisions: () => apiClient.get('/public/divisions').then((r) => r.data.data),
  getDivisionBySlug: (slug) =>
    apiClient.get(`/public/divisions/${encodeURIComponent(slug)}`).then((r) => r.data.data),
  getProducts: (params = {}) =>
    apiClient.get('/public/products', { params }).then((r) => r.data.data),
  getProductBySlug: (slug) =>
    apiClient.get(`/public/products/${encodeURIComponent(slug)}`).then((r) => r.data.data),
  getServices: () => apiClient.get('/public/services').then((r) => r.data.data),
  getIndustries: () => apiClient.get('/public/industries').then((r) => r.data.data),
  submitEnquiry: (payload) =>
    apiClient.post('/public/enquiries', payload).then((r) => r.data),
};

export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    if (res.data?.data?.csrfToken) {
      setCsrfToken(res.data.data.csrfToken);
    }
    return res.data;
  },
  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    setCsrfToken('');
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    if (res.data?.data?.csrfToken) {
      setCsrfToken(res.data.data.csrfToken);
    }
    return res.data.data;
  },
};

export const adminApi = {
  getDashboard: () => apiClient.get('/admin/dashboard').then((r) => r.data.data),

  getDivisions: () => apiClient.get('/admin/divisions').then((r) => r.data.data),
  createDivision: (payload) => apiClient.post('/admin/divisions', payload).then((r) => r.data),
  updateDivision: (id, payload) =>
    apiClient.put(`/admin/divisions/${id}`, payload).then((r) => r.data),
  deleteDivision: (id) => apiClient.delete(`/admin/divisions/${id}`).then((r) => r.data),

  getProducts: (params = {}) =>
    apiClient.get('/admin/products', { params }).then((r) => r.data),
  createProduct: (payload) => apiClient.post('/admin/products', payload).then((r) => r.data),
  updateProduct: (id, payload) =>
    apiClient.put(`/admin/products/${id}`, payload).then((r) => r.data),
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`).then((r) => r.data),

  getServices: () => apiClient.get('/admin/services').then((r) => r.data.data),
  createService: (payload) => apiClient.post('/admin/services', payload).then((r) => r.data),
  updateService: (id, payload) =>
    apiClient.put(`/admin/services/${id}`, payload).then((r) => r.data),
  deleteService: (id) => apiClient.delete(`/admin/services/${id}`).then((r) => r.data),

  getIndustries: () => apiClient.get('/admin/industries').then((r) => r.data.data),
  createIndustry: (payload) => apiClient.post('/admin/industries', payload).then((r) => r.data),
  updateIndustry: (id, payload) =>
    apiClient.put(`/admin/industries/${id}`, payload).then((r) => r.data),
  deleteIndustry: (id) => apiClient.delete(`/admin/industries/${id}`).then((r) => r.data),

  getEnquiries: (params = {}) =>
    apiClient.get('/admin/enquiries', { params }).then((r) => r.data),
  getEnquiryById: (id) => apiClient.get(`/admin/enquiries/${id}`).then((r) => r.data.data),
  updateEnquiry: (id, payload) =>
    apiClient.put(`/admin/enquiries/${id}`, payload).then((r) => r.data),
  addEnquiryNote: (id, note) =>
    apiClient.post(`/admin/enquiries/${id}/notes`, { note }).then((r) => r.data),
  getExportEnquiriesUrl: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        searchParams.set(k, v);
      }
    });
    const qs = searchParams.toString();
    return `${API_BASE_URL}/admin/enquiries/export${qs ? `?${qs}` : ''}`;
  },

  getMedia: (params = {}) =>
    apiClient.get('/admin/media', { params }).then((r) => r.data.data),
  uploadMedia: (formData) =>
    apiClient
      .post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),
  deleteMedia: (id) => apiClient.delete(`/admin/media/${id}`).then((r) => r.data),

  getSiteSettings: () => apiClient.get('/admin/site-settings').then((r) => r.data.data),
  updateSiteSettings: (payload) =>
    apiClient.put('/admin/site-settings', payload).then((r) => r.data),
};

export default apiClient;
