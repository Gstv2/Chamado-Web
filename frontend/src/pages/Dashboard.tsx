
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import api from '../services/api';
import { type Chamado, TicketStatus } from '../types';

export function Dashboard() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);

    // Busca a lista de chamados ao carregar o componente
    useEffect(() => {
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

        fetchTickets();
    }, []);

    // Função para excluir um chamado
    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este chamado?')) return;

        try {
            await api.delete(`/chamados/${id}`);
            // Atualiza o estado local removendo o item excluído para evitar novo request
            setTickets(tickets.filter(t => t.id !== id));
        } catch (error: any) {
            console.error('Erro ao deletar chamado:', error);
            const message = error.response?.data?.message || error.message || 'Erro ao deletar chamado.';
            alert(message);
        }
    };

    // Helper para definir a cor do badge de status
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
            <Header
                action={
                    <button
                        onClick={() => navigate('/chamados/new')}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
                    >
                        Novo Chamado
                    </button>
                }
            />

            <main className="max-w-5xl mx-auto py-8 px-4">
                <div className="card">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Meus Chamados</h2>

                    {loading ? (
                        <div className="text-center p-8 text-gray-500">Carregando...</div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 border rounded-md border-dashed">
                            Nenhum chamado encontrado.
                        </div>
                    ) : (
                        <div className="border rounded-md bg-white overflow-hidden">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="list-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{ticket.titulo}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{ticket.descricao.substring(0, 100)}{ticket.descricao.length > 100 ? '...' : ''}</p>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <span className={`badge ${getStatusBadgeClass(ticket.status)} whitespace-nowrap`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => navigate(`/chamados/edit/${ticket.id}`)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(ticket.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                            >
                                                Excluir
                                            </button>
                                        </div>
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

