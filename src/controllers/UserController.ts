import { FastifyRequest, FastifyReply } from 'fastify';
import { IUserRepository } from '../interfaces/IUserRepository';

// Controlador de Usuários
// Responsável pela lógica de negócio das operações relacionadas a usuários
export class UserController {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  // Método para criar um usuário
  // TODO: Implementar lógica de criação com hash de senha
  async create(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(201).send({ message: 'User created (placeholder)' });
  }

  // Método para listar todos os usuários
  async list(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.userRepository.findAll();
    return reply.send(users);
  }
}
