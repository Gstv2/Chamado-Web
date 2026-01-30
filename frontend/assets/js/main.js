// Global main script
import { getUser, logout } from './auth.js?v=4';

document.addEventListener('DOMContentLoaded', () => {
  // Setup Mobile Toggle
  const toggleBtn = document.querySelector('.btn-mobile-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Load User Info in Topbar
  const user = getUser();
  const userNameEl = document.querySelector('.user-name');
  if (user && userNameEl) {
    userNameEl.textContent = user.name;
  }
});
