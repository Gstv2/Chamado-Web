import { FastifyRequest, FastifyReply } from 'fastify';

// Middleware para verificar se o usuário está autenticado
// Verifica a presença e validade do token JWT no header Authorization
export async function ensureAuthenticated(request: FastifyRequest, reply: FastifyReply) {
  try {
    // A função jwtVerify é injetada pelo @fastify/jwt
    // Ela verifica o token e decodifica o payload para request.user
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: 'Token inválido ou não fornecido.' });
  }
}
