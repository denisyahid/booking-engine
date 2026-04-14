/**
 * API Service Layer for Booking Engine
 * Centralized API helper using axios with interceptors
 * All API calls should go through this service
 */
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://10.108.118.71:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - attach token if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) => api.post('/public/auth/login', { email, password }),
  register: (data) => api.post('/public/auth/register', data),
  logout: () => api.post('/public/auth/logout'),
  getMe: () => api.get('/public/auth/me'),
  updateProfile: (data) => api.put('/public/auth/profile', data),
  changePassword: (data) => api.post('/public/auth/change-password', data),
  forgotPassword: (email) => api.post('/public/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/public/auth/reset-password', data),
  googleCallback: (code) => api.post('/public/auth/google/callback', { code }),
};

// ==================== HOTEL API ====================
export const hotelAPI = {
  list: () => api.get('/public/hotels'),
  detail: (slug) => api.get(`/public/hotels/${slug}`),
  // Legacy endpoints for backward compatibility
  legacyDetail: (slug) => api.get(`/hotel/${slug}`),
  legacyImages: (slug) => api.get(`/${slug}/image`),
};

// ==================== ROOM API ====================
export const roomAPI = {
  byHotel: (slug) => api.get(`/${slug}/room`),
  byId: (id) => api.get(`/room/${id}`),
  latest: (slug) => api.get(`/latestroom/${slug}`),
  images: () => api.get('/images'),
  imagesById: (id) => api.get(`/${id}/room/image`),
};

// ==================== FACILITY API ====================
export const facilityAPI = {
  all: () => api.get('/facilities'),
  hotelFacilities: (slug) => api.get(`/${slug}/facilities`),
  facilityCategories: (slug) => api.get(`/${slug}/facilities/categories`),
  roomFacilities: (id) => api.get(`/facilities/${id}`),
};

// ==================== RATE API ====================
export const rateAPI = {
  all: () => api.get('/rate'),
  specialRates: () => api.get('/specialrate'),
  roomRateDates: (params) => api.get('/room/rate/date', { params }),
};

// ==================== CONTENT API ====================
export const contentAPI = {
  reviews: (slug) => api.get(`/${slug}/review`),
  advantages: (slug) => api.get(`/advantage/${slug}`),
  policies: (slug) => api.get(`/${slug}/policies`),
  faq: (slug) => api.get(`/${slug}/faq`),
  nearby: (slug) => api.get(`/${slug}/nearby`),
};

// ==================== DESTINATION API ====================
export const destinationAPI = {
  list: () => api.get('/destination'),
  search: (params) => api.get('/destination/search', { params }),
  detail: (slug) => api.get(`/destination/${slug}`),
  images: (slug) => api.get(`/destination/image/${slug}`),
  reviews: (slug) => api.get(`/destination/review/${slug}`),
  nearby: (slug) => api.get(`/destination/nearby/${slug}`),
  guestPhotos: (slug) => api.get(`/destination/guest/${slug}`),
  facilities: (slug) => api.get(`/destination/facility/${slug}`),
  faq: (slug) => api.get(`/destination/faq/${slug}`),
};

// ==================== BOOKING API ====================
export const bookingAPI = {
  create: (data) => api.post('/public/bookings', data),
  // Legacy callers now use public endpoint to avoid CSRF issues on /post/booking
  createLegacy: (data) => api.post('/public/bookings', data),
  getByCode: (code) => api.get(`/public/bookings/${code}`),
  getMyBookings: (params) => api.get('/public/bookings/my', { params }),
};

// ==================== PAYMENT API ====================
export const paymentAPI = {
  createSnap: (data) => api.post('/public/payment/snap', data),
  createLegacy: (data) => api.post('/payment', data),
};

// ==================== AVAILABILITY API ====================
export const availabilityAPI = {
  check: (data) => api.post('/public/availability/check', data),
};

// ==================== DISCOUNT API ====================
export const discountAPI = {
  list: () => api.get('/public/discounts'),
  redeemCoupon: (code) => api.post('/public/coupon/redeem', { code }),
};

export default api;
