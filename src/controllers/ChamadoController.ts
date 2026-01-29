import { FastifyRequest, FastifyReply } from 'fastify';
import { ChamadoService } from '../services/ChamadoService';
import { Prisma } from '@prisma/client';
import { createChamadoSchema, updateChamadoSchema } from '../schemas/chamado.schemas';

// Controlador de Chamados
// Responsável pela lógica de entrada/saída HTTP e delegação para o Service
export class ChamadoController {
  private chamadoService: ChamadoService;

  constructor(chamadoService: ChamadoService) {
    this.chamadoService = chamadoService;
  }

  // Método para criar um chamado
  async create(request: FastifyRequest, reply: FastifyReply) {
    // Validação com Zod
    const { titulo, descricao, prioridade } = createChamadoSchema.parse(request.body);
    
    // O ID do usuário vem do token JWT (middleware ensureAuthenticated)
    const user = request.user as { sub: string }; 

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
  }

  // Método para listar chamados (User vê os seus, Admin vê todos)
  async list(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { sub: string; role: string };
    const chamados = await this.chamadoService.listByRole(user.sub, user.role);
    return reply.send(chamados);
  }

  // Método para buscar um chamado por ID
  async show(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const chamado = await this.chamadoService.findById(id);
    
    // Se não encontrar, lança erro 404 (AppError poderia ser usado, mas aqui retornamos direto)
    if (!chamado) {
       return reply.status(404).send({ message: 'Chamado não encontrado.' });
    }

    return reply.send(chamado);
  }

  // Método para atualizar um chamado (status/prioridade)
  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { status, prioridade, titulo, descricao } = updateChamadoSchema.parse(request.body);

    // Prepara objeto de update apenas com campos fornecidos
    const data: Prisma.ChamadoUpdateInput = {};
    if (status) data.status = status;
    if (prioridade) data.prioridade = prioridade;
    if (titulo) data.titulo = titulo;
    if (descricao) data.descricao = descricao;

    const chamado = await this.chamadoService.update(id, data);
    return reply.send(chamado);
  }

  // Método para deletar um chamado (Admin apenas)
  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await this.chamadoService.delete(id);
    return reply.status(204).send(); // No Content
  }
}
