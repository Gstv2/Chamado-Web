import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/UserService';

// Controlador de Usuários
// Responsável pela lógica de entrada/saída HTTP e delegação para o Service
export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Método para criar um usuário
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { nome, email, senha, role } = request.body as any;

    if (!nome || !email || !senha) {
      return reply.status(400).send({ message: 'Nome, email e senha são obrigatórios.' });
    }

    try {
      const user = await this.userService.create({
        nome,
        email,
        senha,
        role
      });

      // Retorna o usuário sem a senha (DTO simples)
      return reply.status(201).send({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
      });
    } catch (error: any) {
      // Trata erros conhecidos de regra de negócio
      if (error.message === 'Usuário já existe.') {
        return reply.status(409).send({ message: error.message });
      }
      request.log.error(error);
      return reply.status(500).send({ message: 'Erro ao criar usuário.' });
    }
  }

  // Método de Autenticação (Login)
  async authenticate(request: FastifyRequest, reply: FastifyReply) {
    const { email, senha } = request.body as any;

    try {
      // Delega a validação de credenciais para o Service
      const user = await this.userService.authenticate(email, senha);

      // Gera o token JWT (Responsabilidade do Controller pois envolve resposta HTTP/Protocolo)
      const token = await reply.jwtSign(
        {
          role: user.role,
          email: user.email
        },
        {
          sub: user.id,
          expiresIn: '1d', // Token expira em 1 dia
        }
      );

      return reply.status(200).send({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error: any) {
      if (error.message === 'E-mail ou senha inválidos.') {
        return reply.status(400).send({ message: error.message });
      }
      request.log.error(error);
      return reply.status(500).send({ message: 'Erro na autenticação.' });
    }
  }

  // Método para listar todos os usuários
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await this.userService.list();
      
      // Remover senhas da listagem (DTO de resposta)
      const usersWithoutPassword = users.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        created_at: user.createdAt
      }));

      return reply.send(usersWithoutPassword);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: 'Erro ao listar usuários.' });
    }
  }
}
