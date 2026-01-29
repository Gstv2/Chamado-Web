import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { ChamadoController } from '../controllers/ChamadoController';
import { ChamadoRepository } from '../repositories/ChamadoRepository';
import { ChamadoService } from '../services/ChamadoService';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureAdmin } from '../middlewares/ensureAdmin';

// Rotas de Chamados
// Define os endpoints relacionados a chamados e delega a lógica para o Controller
export async function chamadoRoutes(app: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  // Injeção de Dependência: Prisma -> Repository -> Service -> Controller
  const chamadoRepository = new ChamadoRepository(prisma);
  const chamadoService = new ChamadoService(chamadoRepository);
  const chamadoController = new ChamadoController(chamadoService);

  // Hook global para todas as rotas deste plugin: Requer autenticação
  app.addHook('preHandler', ensureAuthenticated);

  // GET /chamados - Lista chamados (User: seus, Admin: todos)
  app.get('/chamados', {
    schema: {
      description: 'Lista chamados (User vê os seus, Admin vê todos)',
      tags: ['Chamados'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Lista de chamados retornada com sucesso',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              titulo: { type: 'string' },
              descricao: { type: 'string' },
              status: { type: 'string' },
              prioridade: { type: 'string' },
              usuarioId: { type: 'string', format: 'uuid' },
              usuario: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  email: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return chamadoController.list(request, reply);
  });

  // GET /chamados/:id - Busca um chamado específico pelo ID
  app.get('/chamados/:id', {
    schema: {
      description: 'Busca um chamado pelo ID',
      tags: ['Chamados'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          description: 'Chamado encontrado',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            status: { type: 'string' },
            prioridade: { type: 'string' },
            usuarioId: { type: 'string', format: 'uuid' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return chamadoController.show(request, reply);
  });

  // POST /chamados - Cria um novo chamado
  app.post('/chamados', {
    schema: {
      description: 'Cria um novo chamado',
      tags: ['Chamados'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['titulo', 'descricao'],
        properties: {
          titulo: { type: 'string', minLength: 5 },
          descricao: { type: 'string', minLength: 10 },
          prioridade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA'], default: 'MEDIA' }
        }
      },
      response: {
        201: {
          description: 'Chamado criado com sucesso',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            titulo: { type: 'string' },
            status: { type: 'string' },
            prioridade: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return chamadoController.create(request, reply);
  });

  // PATCH /chamados/:id - Atualiza um chamado (status, prioridade, etc)
  app.patch('/chamados/:id', {
    schema: {
      description: 'Atualiza um chamado',
      tags: ['Chamados'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        properties: {
          titulo: { type: 'string', minLength: 5 },
          descricao: { type: 'string', minLength: 10 },
          prioridade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA'] },
          status: { type: 'string', enum: ['ABERTO', 'EM_ANDAMENTO', 'FECHADO'] }
        }
      },
      response: {
        200: {
          description: 'Chamado atualizado com sucesso',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            titulo: { type: 'string' },
            status: { type: 'string' },
            prioridade: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return chamadoController.update(request, reply);
  });

  // DELETE /chamados/:id - Remove um chamado (Apenas Admin)
  app.delete('/chamados/:id', {
    preHandler: ensureAdmin,
    schema: {
      description: 'Remove um chamado (Apenas Admin)',
      tags: ['Chamados'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        204: {
          description: 'Chamado removido com sucesso',
          type: 'null'
        }
      }
    }
  }, async (request, reply) => {
    return chamadoController.delete(request, reply);
  });
}
