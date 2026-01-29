export const TicketStatus = {
    ABERTO: 'ABERTO',
    EM_ANDAMENTO: 'EM_ANDAMENTO',
    FECHADO: 'FECHADO'
} as const;

export type TicketStatusType = typeof TicketStatus[keyof typeof TicketStatus];

export const TicketPriority = {
    BAIXA: 'BAIXA',
    MEDIA: 'MEDIA',
    ALTA: 'ALTA'
} as const;

export type TicketPriorityType = typeof TicketPriority[keyof typeof TicketPriority];


export interface User {
    id: string;
    nome: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

export interface Chamado {
    id: string;
    titulo: string;
    descricao: string;
    status: TicketStatusType;
    prioridade: TicketPriorityType;
    usuarioId: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
