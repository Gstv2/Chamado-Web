import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/UserService';
import { createUserSchema, loginUserSchema } from '../schemas/user.schemas';

// Controlador de Usuários
// Responsável pela lógica de entrada/saída HTTP e delegação para o Service
export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Método para criar um usuário
  async create(request: FastifyRequest, reply: FastifyReply) {
    // Validação de dados com Zod
    // Se falhar, lança erro que será pego pelo Global Error Handler
    const { nome, email, senha, role } = createUserSchema.parse(request.body);

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
  }

  // Método de Autenticação (Login)
  async authenticate(request: FastifyRequest, reply: FastifyReply) {
    // Validação de dados com Zod
    const { email, senha } = loginUserSchema.parse(request.body);

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
  }

  // Método para listar todos os usuários
  async list(request: FastifyRequest, reply: FastifyReply) {
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
  }
}
