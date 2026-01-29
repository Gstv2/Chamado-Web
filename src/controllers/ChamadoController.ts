import { FastifyRequest, FastifyReply } from 'fastify';
import { ChamadoService } from '../services/ChamadoService';

interface UserPayload {
  id: string;
  role: string;
}

export class ChamadoController {
  constructor(private chamadoService: ChamadoService) { }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { titulo, descricao } = request.body as { titulo: string; descricao: string };
    const user = request.user as UserPayload;

    try {
      const chamado = await this.chamadoService.create({
        titulo,
        descricao,
        usuarioId: user.id
      });
      return reply.code(201).send(chamado);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as UserPayload;
    const chamados = await this.chamadoService.list(user.id, user.role);
    return reply.send(chamados);
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.user as UserPayload;

    try {
      const chamado = await this.chamadoService.findById(id, user.id, user.role);
      return reply.send(chamado);
    } catch (error: any) {
      if (error.message === 'Chamado não encontrado.') {
        return reply.code(404).send({ error: error.message });
      }
      if (error.message === 'Acesso negado.') {
        return reply.code(403).send({ error: error.message });
      }
      return reply.code(500).send({ error: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { status, prioridade } = request.body as { status?: string; prioridade?: string };
    const user = request.user as UserPayload;

    try {
      const chamado = await this.chamadoService.update(id, user.role, { status, prioridade });
      return reply.send(chamado);
    } catch (error: any) {
      if (error.message === 'Chamado não encontrado.') {
        return reply.code(404).send({ error: error.message });
      }
      if (error.message.includes('Apenas administradores')) {
        return reply.code(403).send({ error: error.message });
      }
      return reply.code(400).send({ error: error.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.user as UserPayload;

    try {
      await this.chamadoService.delete(id, user.role);
      return reply.code(204).send();
    } catch (error: any) {
      if (error.message === 'Chamado não encontrado.') {
        return reply.code(404).send({ error: error.message });
      }
      if (error.message.includes('Apenas administradores')) {
        return reply.code(403).send({ error: error.message });
      }
      return reply.code(400).send({ error: error.message });
    }
  }
}
