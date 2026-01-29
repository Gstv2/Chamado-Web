import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import api from '../services/api';
import { type Chamado, TicketStatus } from '../types';

export function AdminChamados() {
    const [tickets, setTickets] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    // Busca todos os chamados (Admin tem acesso a tudo)
    async function fetchTickets() {
        try {
            const response = await api.get<Chamado[]>('/chamados');
            setTickets(response.data);
        } catch (error) {
            console.error('Erro ao buscar chamados:', error);
        } finally {
            setLoading(false);
        }
    }

    // Atualiza o status de um chamado (ex: Resolver)
    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/chamados/${id}`, { status: newStatus });
            fetchTickets(); // Recarrega a lista para refletir a mudança
        } catch (error: any) {
            console.error('Erro ao atualizar status:', error);
            const message = error.response?.data?.message || error.message || 'Erro ao atualizar status';
            alert(message);
        }
    };

    // Remove um chamado do sistema
    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este chamado?')) return;

        try {
            await api.delete(`/chamados/${id}`);
            // Atualiza estado local
            setTickets(tickets.filter(t => t.id !== id));
        } catch (error: any) {
            console.error('Erro ao deletar chamado:', error);
            const message = error.response?.data?.message || error.message || 'Erro ao deletar chamado';
            alert(message);
        }
    };

    // Helper para classes CSS baseadas no status
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case TicketStatus.ABERTO: return 'badge-gray';
            case TicketStatus.EM_ANDAMENTO: return 'badge-yellow';
            case TicketStatus.FECHADO: return 'badge-green';
            default: return 'badge-gray';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-5xl mx-auto py-8 px-4">
                <div className="card">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Gerenciar Chamados</h2>

                    {loading ? (
                        <div className="text-center p-8 text-gray-500">Carregando...</div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 border rounded-md border-dashed">
                            Nenhum chamado encontrado.
                        </div>
                    ) : (
                        <div className="border rounded-md bg-white overflow-hidden">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="list-item flex flex-col sm:flex-row gap-4 sm:items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold">{ticket.titulo}</h3>
                                            <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{ticket.descricao}</p>
                                        <p className="text-xs text-gray-400">ID: {ticket.id} • Prioridade: {ticket.prioridade}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {ticket.status !== TicketStatus.FECHADO && (
                                            <button
                                                onClick={() => handleUpdateStatus(ticket.id, TicketStatus.FECHADO)}
                                                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                                            >
                                                Resolver
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(ticket.id)}
                                            className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
