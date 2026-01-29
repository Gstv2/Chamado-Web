import { FastifyRequest, FastifyReply } from 'fastify';
import { ChamadoService } from '../services/ChamadoService';
import { Prisma } from '@prisma/client';

// Controlador de Chamados
// Responsável pela lógica de entrada/saída HTTP e delegação para o Service
export class ChamadoController {
  private chamadoService: ChamadoService;

  constructor(chamadoService: ChamadoService) {
    this.chamadoService = chamadoService;
  }

  // Método para criar um chamado
  async create(request: FastifyRequest, reply: FastifyReply) {
    // Validação manual simples (idealmente usar Zod)
    const { titulo, descricao, prioridade } = request.body as any;
    
    // O ID do usuário vem do token JWT (middleware ensureAuthenticated)
    const user = request.user as { sub: string }; 

    if (!titulo || !descricao) {
      return reply.status(400).send({ message: 'Título e descrição são obrigatórios.' });
    }

    try {
      const data: Prisma.ChamadoCreateInput = {
        titulo,
        descricao,
        prioridade: prioridade || 'MEDIA',
        usuario: {
          connect: { id: user.sub }
        }
      };

      const chamado = await this.chamadoService.create(data);
      return reply.status(201).send(chamado);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: 'Erro ao criar chamado.' });
    }
  }

  // Método para listar chamados (User vê os seus, Admin vê todos)
  async list(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { sub: string; role: string };
    try {
      const chamados = await this.chamadoService.listByRole(user.sub, user.role);
      return reply.send(chamados);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: 'Erro ao listar chamados.' });
    }
  }

  // Método para buscar um chamado por ID
  async show(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    try {
      const chamado = await this.chamadoService.findById(id);
      if (!chamado) {
        return reply.status(404).send({ message: 'Chamado não encontrado.' });
      }
      return reply.send(chamado);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: 'Erro ao buscar chamado.' });
    }
  }

  // Método para atualizar um chamado (status/prioridade)
  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { status, prioridade, titulo, descricao } = request.body as any;

    try {
      // Prepara objeto de update apenas com campos fornecidos
      const data: Prisma.ChamadoUpdateInput = {};
      if (status) data.status = status;
      if (prioridade) data.prioridade = prioridade;
      if (titulo) data.titulo = titulo;
      if (descricao) data.descricao = descricao;

      const chamado = await this.chamadoService.update(id, data);
      return reply.send(chamado);
    } catch (error: any) {
      request.log.error(error);
      if (error.message === 'Chamado não encontrado.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Erro ao atualizar chamado.' });
    }
  }

  // Método para deletar um chamado (Admin apenas)
  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    try {
      await this.chamadoService.delete(id);
      return reply.status(204).send(); // No Content
    } catch (error: any) {
      request.log.error(error);
      if (error.message === 'Chamado não encontrado.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Erro ao deletar chamado.' });
    }
  }
}
