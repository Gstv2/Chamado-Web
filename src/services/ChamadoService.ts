import { Chamado } from '@prisma/client';
import { IChamadoRepository } from '../interfaces/IChamadoRepository';

interface CreateChamadoDTO {
    titulo: string;
    descricao: string;
    usuarioId: string;
}

interface UpdateChamadoDTO {
    status?: string;
    prioridade?: string;
}

export class ChamadoService {
    constructor(private chamadoRepository: IChamadoRepository) { }

    async create({ titulo, descricao, usuarioId }: CreateChamadoDTO): Promise<Chamado> {
        return this.chamadoRepository.create({
            titulo,
            descricao,
            usuario: { connect: { id: usuarioId } },
            status: 'ABERTO',
            prioridade: 'MEDIA',
        });
    }

    async list(usuarioId: string, role: string): Promise<Chamado[]> {
        if (role === 'ADMIN') {
            return this.chamadoRepository.findAll();
        }
        return this.chamadoRepository.findByUserId(usuarioId);
    }

    async findById(id: string, usuarioId: string, role: string): Promise<Chamado> {
        const chamado = await this.chamadoRepository.findById(id);

        if (!chamado) {
            throw new Error('Chamado não encontrado.');
        }

        if (role !== 'ADMIN' && chamado.usuarioId !== usuarioId) {
            throw new Error('Acesso negado.'); // Or Forbidden
        }

        return chamado;
    }

    async update(id: string, role: string, data: UpdateChamadoDTO): Promise<Chamado> {
        if (role !== 'ADMIN') {
            throw new Error('Apenas administradores podem atualizar chamados.');
        }

        if (data.status && !['ABERTO', 'EM_ANDAMENTO', 'FECHADO'].includes(data.status)) {
            throw new Error('Status inválido. Use: ABERTO, EM_ANDAMENTO, FECHADO.');
        }

        if (data.prioridade && !['BAIXA', 'MEDIA', 'ALTA'].includes(data.prioridade)) {
            throw new Error('Prioridade inválida. Use: BAIXA, MEDIA, ALTA.');
        }

        // Ensure only status and priority are updated (enforced by DTO and logic here)
        // Also check if exists? Repository update throws if not found usually, but explicit check is better for nice error.
        const existing = await this.chamadoRepository.findById(id);
        if (!existing) {
            throw new Error('Chamado não encontrado.');
        }

        return this.chamadoRepository.update(id, data);
    }

    async delete(id: string, role: string): Promise<void> {
        if (role !== 'ADMIN') {
            throw new Error('Apenas administradores podem excluir chamados.');
        }

        const existing = await this.chamadoRepository.findById(id);
        if (!existing) {
            throw new Error('Chamado não encontrado.');
        }

        return this.chamadoRepository.delete(id);
    }
}
