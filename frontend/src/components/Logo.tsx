import { SquareTerminal } from 'lucide-react';

export function Logo() {
    return (
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <SquareTerminal size={24} strokeWidth={3} />
            <span>HelpDesk+</span>
        </div>
    );
}
