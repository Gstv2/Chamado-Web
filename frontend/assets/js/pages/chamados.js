import api from '../api.js?v=4';
import { requireAuth, getUser, isAdmin } from '../auth.js?v=4';

requireAuth();

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#chamados-table tbody');
  const user = getUser();
  
  // Setup Modal Logic (Close buttons mainly)
  setupModalBase();
  
  // Render loading state
  tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Carregando chamados...</td></tr>';

  try {
    const tickets = await api.listarChamados();
    
    if (tickets.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum chamado encontrado</td></tr>';
      return;
    }

    renderTable(tickets);
    
    // Check URL params for auto-opening modal
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id');
    const mode = urlParams.get('mode');
    
    if (ticketId && (mode === 'edit' || mode === 'view')) {
      // Find the ticket in the list or fetch it
      const ticket = tickets.find(t => t.id == ticketId);
      if (ticket) {
        // If user is not admin but tries to edit, force view
        const effectiveMode = (mode === 'edit' && !admin) ? 'view' : mode;
        openModal(ticket, effectiveMode);
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

  } catch (error) {
    console.error('Erro ao carregar chamados:', error);
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center" style="color: var(--danger-color);">Erro ao carregar dados</td></tr>';
  }
});

function renderTable(tickets) {
  const tableBody = document.querySelector('#chamados-table tbody');
  const admin = isAdmin();
  
  tableBody.innerHTML = tickets.map(ticket => {
    // Determine badge classes
    const statusBadge = `badge-${ticket.status.toLowerCase()}`;
    const priorityBadge = `badge-${ticket.prioridade.toLowerCase()}`;
    
    // Determine actions based on role
    let actionButtons = '';
    
    if (admin) {
      // ADMIN: Editar (Full control) + Excluir
      actionButtons = `
        <button class="btn btn-secondary btn-sm btn-edit" data-id="${ticket.id}" data-mode="edit">Editar</button>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${ticket.id}" style="margin-left: 5px;">Excluir</button>
      `;
    } else {
      // USER: Ver Detalhes (Read only)
      actionButtons = `
        <button class="btn btn-secondary btn-sm btn-edit" data-id="${ticket.id}" data-mode="view">Ver detalhes</button>
      `;
    }

    return `
      <tr id="ticket-row-${ticket.id}">
        <td>
          <div style="font-weight: 500;">${ticket.titulo}</div>
          <div style="font-size: 0.8rem; color: #a4b0be;">#${ticket.id}</div>
        </td>
        <td>${ticket.usuario ? (ticket.usuario.nome || ticket.usuario.email || 'Usuário') : 'N/A'}</td>
        <td><span class="badge ${statusBadge}">${ticket.status.replace('_', ' ')}</span></td>
        <td><span class="badge ${priorityBadge}">${ticket.prioridade}</span></td>
        <td>
          ${actionButtons}
        </td>
      </tr>
    `;
  }).join('');

  // Attach event listeners for actions
  attachActionListeners();
}

function attachActionListeners() {
  // Edit/View buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      const mode = e.target.getAttribute('data-mode'); // 'edit' or 'view'
      
      try {
         // Fetch latest data for this ticket to populate modal
         const ticket = await api.obterChamado(id);
         openModal(ticket, mode);
      } catch (err) {
         console.error(err);
         alert('Erro ao carregar detalhes do chamado.');
      }
    });
  });

  // Delete buttons (Admin only)
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      if (confirm(`Tem certeza que deseja excluir o chamado #${id}?`)) {
        try {
          await api.deletarChamado(id);
          // Remove row from DOM
          const row = document.getElementById(`ticket-row-${id}`);
          if (row) row.remove();
          alert('Chamado excluído com sucesso!');
        } catch (error) {
          console.error(error);
          alert('Erro ao excluir chamado: ' + (error.message || 'Erro desconhecido'));
        }
      }
    });
  });
}

// Modal Functions
function setupModalBase() {
  const modal = document.getElementById('edit-modal');
  const closeBtns = document.querySelectorAll('.close-modal-btn');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

function openModal(ticket, mode) {
  const modal = document.getElementById('edit-modal');
  const modalHeader = modal.querySelector('.modal-header h3');
  const modalBody = modal.querySelector('.modal-body');
  
  // Set Title
  modalHeader.textContent = mode === 'edit' ? 'Editar Chamado' : 'Detalhes do Chamado';
  
  // Generate Content based on Mode
  if (mode === 'edit') {
    // ADMIN: Form with Selects
    modalBody.innerHTML = `
      <form id="edit-status-form">
        <input type="hidden" id="edit-ticket-id" value="${ticket.id}">
        
        <div class="form-group">
          <label class="form-label">Título</label>
          <input type="text" class="form-control" value="${ticket.titulo}" disabled style="background: #f5f6fa;">
        </div>

        <div class="form-group">
          <label class="form-label">Criado por</label>
          <input type="text" class="form-control" value="${ticket.usuario ? (ticket.usuario.nome || ticket.usuario.email || 'Usuário') : 'N/A'}" disabled style="background: #f5f6fa;">
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-status">Status</label>
          <select id="edit-status" class="form-control" required>
            <option value="ABERTO" ${ticket.status === 'ABERTO' ? 'selected' : ''}>ABERTO</option>
            <option value="EM_ANDAMENTO" ${ticket.status === 'EM_ANDAMENTO' ? 'selected' : ''}>EM ANDAMENTO</option>
            <option value="FECHADO" ${ticket.status === 'FECHADO' ? 'selected' : ''}>FECHADO</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-priority">Prioridade</label>
          <select id="edit-priority" class="form-control" required>
            <option value="BAIXA" ${ticket.prioridade === 'BAIXA' ? 'selected' : ''}>BAIXA</option>
            <option value="MEDIA" ${ticket.prioridade === 'MEDIA' ? 'selected' : ''}>MEDIA</option>
            <option value="ALTA" ${ticket.prioridade === 'ALTA' ? 'selected' : ''}>ALTA</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary close-modal-btn-inner">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar Alterações</button>
        </div>
      </form>
    `;
    
    // Attach form submit listener
    const form = modalBody.querySelector('#edit-status-form');
    form.addEventListener('submit', handleFormSubmit);
    
  } else {
    // USER: Read-only Spans
    const statusBadge = `badge-${ticket.status.toLowerCase()}`;
    const priorityBadge = `badge-${ticket.prioridade.toLowerCase()}`;
    
    modalBody.innerHTML = `
      <div class="form-group">
        <label class="form-label">Título</label>
        <div style="padding: 10px; background: #f5f6fa; border-radius: 4px;">${ticket.titulo}</div>
      </div>

      <div class="form-group">
        <label class="form-label">Criado por</label>
        <div style="padding: 10px; background: #f5f6fa; border-radius: 4px;">${ticket.usuario ? (ticket.usuario.nome || ticket.usuario.email || 'Usuário') : 'N/A'}</div>
      </div>

      <div class="form-group">
        <label class="form-label">Status</label>
        <div>
          <span class="badge ${statusBadge}" style="font-size: 1rem;">${ticket.status.replace('_', ' ')}</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Prioridade</label>
        <div>
          <span class="badge ${priorityBadge}" style="font-size: 1rem;">${ticket.prioridade}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary close-modal-btn-inner">Fechar</button>
      </div>
    `;
  }

  // Re-attach inner close button listener
  const innerCloseBtn = modalBody.querySelector('.close-modal-btn-inner');
  if (innerCloseBtn) {
    innerCloseBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.classList.add('active');
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.querySelector('#edit-ticket-id').value;
  const newStatus = form.querySelector('#edit-status').value;
  const newPriority = form.querySelector('#edit-priority').value;
  
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  try {
    btn.disabled = true;
    btn.textContent = 'Salvando...';

    // Get current ticket to preserve other fields
    const currentTicket = await api.obterChamado(id);
    
    // Construct clean payload with only allowed fields
    const payload = {
      id: Number(id), // Include ID as number just in case
      titulo: currentTicket.titulo,
      descricao: currentTicket.descricao,
      status: newStatus,
      prioridade: newPriority
    };
    
    await api.atualizarChamado(id, payload);
    
    alert('Chamado atualizado com sucesso!');
    document.getElementById('edit-modal').classList.remove('active');
    
    // Refresh List
    const tickets = await api.listarChamados();
    renderTable(tickets);
    
  } catch (error) {
    console.error(error);
    alert('Erro ao atualizar: ' + (error.message || 'Erro desconhecido'));
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}
