import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    action?: React.ReactNode;
}

export function Header({ action }: HeaderProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                <Logo />
                <div className="flex items-center gap-4">
                    {action}
                    <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">
                        Sair
                    </button>
                </div>
            </div>
        </header>
    );
}
