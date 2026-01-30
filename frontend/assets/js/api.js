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
    let errorMessage = response.statusText;
    try {
        if (data && data.message) {
            errorMessage = data.message;
        } else if (data && data.error) {
            errorMessage = data.error;
        } else if (typeof data === 'string') {
            errorMessage = data;
        }
    } catch (e) { /* ignore parsing errors */ }
    
    throw new Error(errorMessage || `Erro ${response.status}`);
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

  // Fix: Remove Content-Type if no body is present (prevents "Body cannot be empty" error on DELETE/GET)
  if (!config.body) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    console.error(`API Error on ${endpoint}: ${error.message}`);
    // Enhance network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Erro de conexão com o servidor. Verifique se a API está online ou se há bloqueio de CORS.');
    }
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
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  deletarChamado: (id) => request(ENDPOINTS.CHAMADOS.DELETE(id), {
    method: 'DELETE'
  })
};
