import { storageGet, storageSet, storageRemove } from './storage.js';

export const isAuthenticated = () => {
  return !!storageGet('token');
};

export const setToken = (token) => {
  storageSet('token', token);
};

export const setUser = (user) => {
  storageSet('user', user);
};

export const login = (token, user) => {
  setToken(token);
  setUser(user);
};

export const logout = () => {
  storageRemove('token');
  storageRemove('user');
  window.location.href = 'login.html';
};

export const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
};

export const getUser = () => {
  return storageGet('user');
};

export const isAdmin = () => {
  const user = getUser();
  return user && user.role === 'ADMIN';
};

export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};
