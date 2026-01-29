import { API_BASE_URL, ENDPOINTS } from './config.js';
import { storageGet } from './storage.js';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = storageGet('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data;
};

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

export default {
  // Auth
  login: (email, password) => request(ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, senha: password })
  }),

  register: (name, email, password) => request(ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify({ nome: name, email, senha: password })
  }),

  me: () => request(ENDPOINTS.AUTH.ME),

  // Chamados
  listarChamados: () => request(ENDPOINTS.CHAMADOS.LIST),

  criarChamado: (data) => request(ENDPOINTS.CHAMADOS.CREATE, {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  obterChamado: (id) => request(ENDPOINTS.CHAMADOS.DETAIL(id)),

  atualizarChamado: (id, data) => request(ENDPOINTS.CHAMADOS.UPDATE(id), {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deletarChamado: (id) => request(ENDPOINTS.CHAMADOS.DELETE(id), {
    method: 'DELETE'
  })
};
