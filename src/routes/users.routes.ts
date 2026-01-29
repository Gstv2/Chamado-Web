import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureAdmin } from '../middlewares/ensureAdmin';

// Rotas de Usuários
// Define os endpoints relacionados a usuários e delega a lógica para o Controller
export async function userRoutes(app: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  // Injeção de Dependência: Prisma -> Repository -> Service -> Controller
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  // POST /users/login - Autenticação (Pública)
  app.post('/users/login', async (request, reply) => {
    return userController.authenticate(request, reply);
  });

  // POST /users - Cria um novo usuário (Pública para cadastro)
  app.post('/users', async (request, reply) => {
    return userController.create(request, reply);
  });

  // GET /users - Lista todos os usuários (Privada, apenas ADMIN)
  app.get('/users', { preHandler: [ensureAuthenticated, ensureAdmin] }, async (request, reply) => {
    return userController.list(request, reply);
  });
}
