import axios from 'axios';

// Criação da instância do Axios para comunicação com o Backend
// Configura a URL base e cabeçalhos padrão
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333', // URL base da API (variável de ambiente ou fallback)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptador de Requisição
// Antes de cada requisição sair, verifica se existe um token salvo
// e o injeta no cabeçalho Authorization
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
