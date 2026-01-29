import { requireAuth, getUser, logout } from '../auth.js';

requireAuth();

document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  
  if (user) {
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-role').textContent = user.role;
    
    // Update avatar with name
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
    document.getElementById('profile-avatar').src = avatarUrl;
    
    // Update topbar avatar as well if main.js hasn't done it yet (though main.js should handle it globally if implemented there, but let's be safe)
    const topbarAvatar = document.querySelector('.user-avatar img');
    if (topbarAvatar) topbarAvatar.src = avatarUrl;
    
    const topbarName = document.querySelector('.user-name');
    if (topbarName) topbarName.textContent = user.name;
  }
  
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  });
});
