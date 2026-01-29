import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { ChamadoController } from '../controllers/ChamadoController';
import { ChamadoRepository } from '../repositories/ChamadoRepository';

// Rotas de Chamados
// Define os endpoints relacionados a chamados e delega a lógica para o Controller
export async function chamadoRoutes(app: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  // Injeção de Dependência: Prisma -> Repository -> Controller
  const chamadoRepository = new ChamadoRepository(prisma);
  const chamadoController = new ChamadoController(chamadoRepository);

  // GET /chamados - Lista todos os chamados
  app.get('/chamados', async (request, reply) => {
    return chamadoController.list(request, reply);
  });

  // POST /chamados - Cria um novo chamado
  app.post('/chamados', async (request, reply) => {
    return chamadoController.create(request, reply);
  });
}
