import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import api from '../services/api';
import { TicketPriority } from '../types';

export function CreateChamado() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState<string>(TicketPriority.BAIXA);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    // Envia o novo chamado para a API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post('/chamados', {
                titulo,
                descricao,
                prioridade,
            });
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Erro ao criar chamado:', error);
            const message = error.response?.data?.message || error.message || 'Erro ao criar chamado';
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-3xl mx-auto py-8 px-4">
                <div className="card">
                    <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Novo Chamado</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="input-group">
                            <label className="input-label">Titulo</label>
                            <input
                                type="text"
                                className="input-field"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Descrição</label>
                            <textarea
                                className="input-field h-32 resize-none"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                required
                            ></textarea>
                        </div>

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

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="btn btn-primary px-8 w-auto"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Criando...' : 'Criar'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
