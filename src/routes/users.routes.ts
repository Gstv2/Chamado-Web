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
  app.post('/users/login', {
    schema: {
      description: 'Autentica um usuário e retorna um token JWT',
      tags: ['Usuários'],
      body: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email', default: 'admin@example.com' },
          senha: { type: 'string', minLength: 6, default: 'admin123' }
        }
      },
      response: {
        200: {
          description: 'Login realizado com sucesso',
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return userController.authenticate(request, reply);
  });

  // POST /users - Cria um novo usuário (Pública para cadastro)
  app.post('/users', {
    schema: {
      description: 'Cria um novo usuário',
      tags: ['Usuários'],
      body: {
        type: 'object',
        required: ['nome', 'email', 'senha'],
        properties: {
          nome: { type: 'string', minLength: 3 },
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['USER', 'ADMIN'], default: 'USER' }
        }
      },
      response: {
        201: {
          description: 'Usuário criado com sucesso',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return userController.create(request, reply);
  });

  // GET /users - Lista todos os usuários (Privada, apenas ADMIN)
  app.get('/users', {
    preHandler: [ensureAuthenticated, ensureAdmin],
    schema: {
      description: 'Lista todos os usuários (Apenas ADMIN)',
      tags: ['Usuários'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Lista de usuários retornada com sucesso',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              nome: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return userController.list(request, reply);
  });
}
