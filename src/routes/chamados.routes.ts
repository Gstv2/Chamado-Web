import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { ChamadoController } from '../controllers/ChamadoController';
import { ChamadoRepository } from '../repositories/ChamadoRepository';
import { ChamadoService } from '../services/ChamadoService';

// Rotas de Chamados
// Define os endpoints relacionados a chamados e delega a lógica para o Controller
export async function chamadoRoutes(app: FastifyInstance, options: { prisma: PrismaClient }) {
  const { prisma } = options;
  // Injeção de Dependência: Prisma -> Repository -> Service -> Controller
  const chamadoRepository = new ChamadoRepository(prisma);
  const chamadoService = new ChamadoService(chamadoRepository);
  const chamadoController = new ChamadoController(chamadoService);

  // Hook de autenticação para todas as rotas deste plugin (opcional, ou por rota)
  // Mas como precisamos de acesso ao usuário em todas, podemos fazer assim:
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // GET /chamados - Lista chamados (filtrado por role dentro do service)
  app.get('/chamados', async (request, reply) => {
    return chamadoController.list(request, reply);
  });

  // POST /chamados - Cria um novo chamado
  app.post('/chamados', async (request, reply) => {
    return chamadoController.create(request, reply);
  });

  // GET /chamados/:id - Busca por ID
  app.get('/chamados/:id', async (request, reply) => {
    return chamadoController.findById(request, reply);
  });

  // PUT /chamados/:id - Atualiza (Admin)
  app.put('/chamados/:id', async (request, reply) => {
    return chamadoController.update(request, reply);
  });

  // DELETE /chamados/:id - Deleta (Admin)
  app.delete('/chamados/:id', async (request, reply) => {
    return chamadoController.delete(request, reply);
  });
}
