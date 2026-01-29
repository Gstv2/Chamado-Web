import { FastifyRequest, FastifyReply } from 'fastify';

// Middleware para verificar se o usuário é ADMIN
// Deve ser usado APÓS o middleware ensureAuthenticated
export async function ensureAdmin(request: FastifyRequest, reply: FastifyReply) {
  // request.user é populado pelo jwtVerify (do ensureAuthenticated)
  const user = request.user as { role: string };

  if (user.role !== 'ADMIN') {
    return reply.status(403).send({ message: 'Acesso negado. Requer privilégios de Administrador.' });
  }
}
