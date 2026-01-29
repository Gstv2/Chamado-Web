
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import api from '../services/api';
import { type Chamado, TicketStatus } from '../types';

export function Dashboard() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Chamado[]>([]);
    const [loading, setLoading] = useState(true);

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
                                <div key={ticket.id} className="list-item">
                                    <div>
                                        <h3>{ticket.title}</h3>
                                        <p>{ticket.description.substring(0, 50)}...</p>
                                    </div>
                                    <span className={`badge ${getStatusBadgeClass(ticket.status)} `}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

