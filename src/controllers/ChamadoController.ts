import { FastifyRequest, FastifyReply } from 'fastify';
import { IChamadoRepository } from '../interfaces/IChamadoRepository';

// Controlador de Chamados
// Responsável pela lógica de negócio das operações relacionadas a chamados (tickets)
export class ChamadoController {
  private chamadoRepository: IChamadoRepository;

  constructor(chamadoRepository: IChamadoRepository) {
    this.chamadoRepository = chamadoRepository;
  }

  // Método para criar um chamado
  // TODO: Implementar lógica de criação com validação e associação ao usuário
  async create(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(201).send({ message: 'Chamado created (placeholder)' });
  }

  // Método para listar todos os chamados
  async list(request: FastifyRequest, reply: FastifyReply) {
    const chamados = await this.chamadoRepository.findAll();
    return reply.send(chamados);
  }
}
