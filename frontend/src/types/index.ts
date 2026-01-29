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
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

export interface Chamado {
    id: string;
    title: string;
    description: string;
    status: TicketStatusType;
    priority: TicketPriorityType;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
