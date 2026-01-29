import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import api from '../services/api';

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Manipula o cadastro de novo usuário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Faz a requisição direta para a API
            await api.post('/users', { 
                nome: name, 
                email, 
                senha: password 
            });
            // Redireciona para login após sucesso
            navigate('/login');
        } catch (err) {
            setError('Erro ao criar conta. Tente novamente.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container-center">
            <div className="card w-full max-w-md">
                <div className="mb-8">
                    <Logo />
                </div>

                <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Cadastro</h1>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Nome</label>
                        <input
                            type="text"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Senha</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary mt-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Já tem uma conta? <Link to="/login" className="link">Faça login</Link>
                </div>
            </div>
        </div>
    );
}
