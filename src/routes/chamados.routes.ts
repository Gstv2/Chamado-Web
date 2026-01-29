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
  app.get('/chamados', async (request, reply) => {
    return chamadoController.list(request, reply);
  });

  // GET /chamados/:id - Busca um chamado específico pelo ID
  app.get('/chamados/:id', async (request, reply) => {
    return chamadoController.show(request, reply);
  });

  // POST /chamados - Cria um novo chamado
  app.post('/chamados', async (request, reply) => {
    return chamadoController.create(request, reply);
  });

  // PUT /chamados/:id - Atualiza um chamado (status, prioridade, etc)
  app.put('/chamados/:id', async (request, reply) => {
    return chamadoController.update(request, reply);
  });

  // DELETE /chamados/:id - Remove um chamado (Apenas Admin)
  app.delete('/chamados/:id', { preHandler: ensureAdmin }, async (request, reply) => {
    return chamadoController.delete(request, reply);
  });
}
