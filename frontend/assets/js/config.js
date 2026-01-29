export const API_BASE_URL = 'http://44.215.110.144:3333';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    ME: '/me' // TODO: Verify this endpoint
  },
  CHAMADOS: {
    LIST: '/chamados',
    CREATE: '/chamados',
    DETAIL: (id) => `/chamados/${id}`,
    UPDATE: (id) => `/chamados/${id}`,
    DELETE: (id) => `/chamados/${id}`
  }
};
