import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../repositories/UserRepository';

// Rotas de Usuários
// Define os endpoints relacionados a usuários e delega a lógica para o Controller
export async function userRoutes(app: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  // Injeção de Dependência: Prisma -> Repository -> Controller
  const userRepository = new UserRepository(prisma);
  const userController = new UserController(userRepository);

  // GET /users - Lista todos os usuários
  app.get('/users', async (request, reply) => {
    return userController.list(request, reply);
  });

  // POST /users - Cria um novo usuário
  app.post('/users', async (request, reply) => {
    return userController.create(request, reply);
  });
}
