import api from '../api.js';
import { setToken, setUser, isAuthenticated, parseJwt } from '../auth.js';
import { setLoading } from '../ui.js';

if (isAuthenticated()) {
  window.location.href = 'dashboard.html';
}

const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = form.querySelector('button');

  try {
    setLoading(btn, true);
    
    // 1. Authenticate
    const response = await api.login(email, password);
    
    if (response.token) {
      // 2. Save Token
      setToken(response.token);
      
      // 3. Get User Details
      let user = null;
      
      try {
        // Tenta buscar na API
        user = await api.me();
      } catch (userError) {
        console.warn('API /me falhou, tentando extrair dados do token...');
        
        // Fallback: extrai do JWT
        const payload = parseJwt(response.token);
        if (payload) {
           user = {
             id: payload.id || payload.sub,
             email: payload.email,
             name: payload.name || payload.nome || payload.username || 'Usuário',
             role: payload.role || payload.perfil || 'USER'
           };
        }
      }

      if (user) {
        setUser(user);
        window.location.href = 'dashboard.html';
      } else {
        throw new Error('Login realizado, mas não foi possível identificar o usuário.');
      }
    } else {
      throw new Error('Token não recebido da API');
    }
    
  } catch (error) {
    console.error(error);
    alert(error.message || 'Erro ao realizar login');
  } finally {
    setLoading(btn, false);
  }
});
