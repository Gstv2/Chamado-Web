import api from '../api.js?v=4';
import { requireAuth } from '../auth.js?v=4';

requireAuth();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('new-ticket-form');
  
  // Custom Dropdown Logic
  const customSelect = document.getElementById('custom-prioridade');
  const selectTrigger = customSelect.querySelector('.custom-select-trigger');
  const customOptions = customSelect.querySelectorAll('.custom-option');
  const hiddenSelect = document.getElementById('prioridade');
  const selectedValueSpan = selectTrigger.querySelector('.selected-value');

  // Toggle Dropdown
  selectTrigger.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing immediately
    customSelect.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove('open');
    }
  });

  // Select Option
  customOptions.forEach(option => {
    option.addEventListener('click', () => {
      const value = option.getAttribute('data-value');
      
      // Update Hidden Select
      hiddenSelect.value = value;
      
      // Update Trigger Text (Clone the content of the selected option)
      selectedValueSpan.innerHTML = option.innerHTML;
      
      // Update Visual Selection State
      customOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      // Close Dropdown
      customSelect.classList.remove('open');
    });
  });

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';
    
    const data = {
      titulo: document.getElementById('titulo').value,
      prioridade: hiddenSelect.value, // Use the hidden select value
      descricao: document.getElementById('descricao').value,
      status: 'ABERTO' // Ensure status is sent
    };
    
    try {
      await api.criarChamado(data);
      
      // Success feedback
      alert('Chamado criado com sucesso!');
      window.location.href = 'chamados.html';
      
    } catch (error) {
      console.error(error);
      alert('Erro ao criar chamado. Tente novamente.');
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
});
