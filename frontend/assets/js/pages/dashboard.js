import api from '../api.js';
import { requireAuth, isAdmin } from '../auth.js';

requireAuth();

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#tickets-table tbody');
  const admin = isAdmin();
  
  try {
    const tickets = await api.listarChamados();
    
    // Update Stats
    const counts = {
      ABERTO: 0,
      EM_ANDAMENTO: 0,
      FECHADO: 0
    };
    
    tickets.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    
    document.getElementById('count-aberto').textContent = counts.ABERTO;
    document.getElementById('count-andamento').textContent = counts.EM_ANDAMENTO;
    document.getElementById('count-fechado').textContent = counts.FECHADO;
    
    // Render Table (Last 5)
    const recentTickets = tickets.slice(0, 5); // Just first 5 for dashboard
    
    if (recentTickets.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum chamado encontrado</td></tr>';
    } else {
      tableBody.innerHTML = recentTickets.map(ticket => {
        let actionBtn = '';
        if (admin) {
             // For dashboard, maybe we just link to the main list or show a simple edit button that goes to chamados page?
             // User asked for "UMA ÚNICA TELA" behavior.
             // Simplest is to just link to Details for both, or Edit for Admin.
             // Since dashboard doesn't have the modal logic, let's make it link to chamados.html
             // But to keep it simple and consistent:
             actionBtn = `<a href="chamados.html?id=${ticket.id}&mode=edit" class="btn btn-secondary btn-sm">Gerenciar</a>`;
        } else {
             actionBtn = `<a href="chamados.html?id=${ticket.id}&mode=view" class="btn btn-secondary btn-sm">Ver Detalhes</a>`;
        }
        
        return `
        <tr>
          <td>
            <div style="font-weight: 500;">${ticket.titulo}</div>
            <div style="font-size: 0.8rem; color: #a4b0be;">#${ticket.id}</div>
          </td>
          <td><span class="badge badge-${ticket.status.toLowerCase()}">${ticket.status.replace('_', ' ')}</span></td>
          <td><span class="badge badge-${ticket.prioridade.toLowerCase()}">${ticket.prioridade}</span></td>
          <td>
            ${actionBtn}
          </td>
        </tr>
      `}).join('');
    }
    
  } catch (error) {
    console.error(error);
  }
});
