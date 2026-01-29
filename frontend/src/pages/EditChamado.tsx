import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import api from '../services/api';
import { TicketPriority, TicketStatus, type Chamado } from '../types';

export function EditChamado() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState<string>(TicketPriority.MEDIA);
    const [status, setStatus] = useState<string>(TicketStatus.ABERTO);
    
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Carrega os dados do chamado para edição
    useEffect(() => {
        async function fetchChamado() {
            try {
                const response = await api.get<Chamado>(`/chamados/${id}`);
                const ticket = response.data;
                setTitulo(ticket.titulo);
                setDescricao(ticket.descricao);
                setPrioridade(ticket.prioridade);
                setStatus(ticket.status);
            } catch (error) {
                console.error('Erro ao buscar chamado:', error);
                alert('Erro ao carregar dados do chamado.');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        }
        fetchChamado();
    }, [id, navigate]);

    // Envia as alterações para a API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        console.log('Tentando atualizar chamado:', { id, titulo, descricao, prioridade, status });

        try {
            await api.patch(`/chamados/${id}`, {
                titulo,
                descricao,
                prioridade,
                status
            });
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Erro ao atualizar chamado:', error);
            const message = error.response?.data?.message || error.message || 'Erro ao atualizar chamado';
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-3xl mx-auto py-8 px-4">
                <div className="card">
                    <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Editar Chamado</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="input-group">
                            <label className="input-label">Titulo</label>
                            <input
                                type="text"
                                className="input-field"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                                minLength={5}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Descrição</label>
                            <textarea
                                className="input-field h-32 resize-none"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                required
                                minLength={10}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="input-group">
                                <label className="input-label">Prioridade</label>
                                <select
                                    className="input-field"
                                    value={prioridade}
                                    onChange={(e) => setPrioridade(e.target.value)}
                                >
                                    <option value={TicketPriority.BAIXA}>Baixa</option>
                                    <option value={TicketPriority.MEDIA}>Média</option>
                                    <option value={TicketPriority.ALTA}>Alta</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Status</label>
                                <select
                                    className="input-field"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    disabled={status === TicketStatus.FECHADO} // Se já fechado, talvez não deva reabrir por aqui? Deixarei aberto.
                                >
                                    <option value={TicketStatus.ABERTO}>Aberto</option>
                                    <option value={TicketStatus.EM_ANDAMENTO}>Em Andamento</option>
                                    <option value={TicketStatus.FECHADO}>Fechado</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn bg-gray-500 hover:bg-gray-600 text-white px-8 w-auto"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-8 w-auto"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
