import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwt from '@fastify/jwt'
import { PrismaClient } from '@prisma/client'
import { userRoutes } from './routes/users.routes'
import { chamadoRoutes } from './routes/chamados.routes'
import { AppError } from './utils/AppError'
import { ZodError } from 'zod'

// 1. Inicializa o Cliente Prisma (Singleton) no ponto de entrada
// O PrismaClient gerencia a conexão com o banco de dados (SQLite neste caso)
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

const app = Fastify({ logger: true })

// 2. Registra o hook para desconectar o Prisma ao fechar o servidor
// Garante que a conexão com o banco seja fechada corretamente quando a aplicação parar
app.addHook('onClose', async () => {
  app.log.info('Fechando conexão com o banco de dados...')
  await prisma.$disconnect()
})

// Hook para logar todas as requisições
app.addHook('onRequest', async (request, reply) => {
  console.log(`[REQUEST] ${request.method} ${request.url}`);
});

// 2.1 Configuração do CORS
// Permite que o frontend (ex: localhost:5173) faça requisições para este backend
app.register(cors, {
  origin: true, // Em produção, substitua por uma lista de domínios permitidos
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// 3. Configuração do JWT (JSON Web Token)
// Registra o plugin JWT com uma chave secreta (deve ser movida para .env em produção)
app.register(jwt, {
  secret: 'supersecret' // TODO: Mover para variável de ambiente .env
})

// 4. Configuração e registro do Swagger
// Gera a documentação OpenAPI automaticamente
app.register(swagger, {
  openapi: {
    info: {
      title: 'API de Chamados',
      description: 'Documentação da API de Chamados com Fastify, TypeScript e Prisma/SQLite.',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
})

// 5. Configuração e registro do Swagger UI
// Disponibiliza a interface visual do Swagger em /documentation
app.register(swaggerUi, {
  routePrefix: '/documentation'
})

// 6. Registro das rotas, injetando o cliente Prisma
// Separação das rotas por domínio (Usuários, Chamados)
app.register(userRoutes, { prisma })
app.register(chamadoRoutes, { prisma })

// Rota raiz de boas-vindas
app.get('/', async (request, reply) => {
  return { message: 'Bem-vindo à API do Chamado-Web!' };
});

// 7. Manipulador Global de Erros
// Intercepta todos os erros lançados na aplicação para retornar respostas padronizadas
app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  // Erros de Validação do Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação.',
      issues: error.format()
    })
  }

  // Erros de Regra de Negócio (AppError)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message
    })
  }

  // Erros do Fastify/JWT (ex: Token inválido)
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
    return reply.status(401).send({
      message: 'Token inválido ou não fornecido.'
    })
  }

  // Erros Internos (não esperados)
  app.log.error(error) // Loga o erro completo no console
  return reply.status(500).send({
    message: 'Internal Server Error'
  })
})


// Exporta o app para testes
export { app, prisma }

// Inicialização do servidor na porta 3333
// Apenas inicia se este arquivo for o módulo principal (não importado por testes)
if (require.main === module) {
  app.listen({ port: 3333 })
    .then(address => {
      console.log(`🚀 Servidor rodando em: ${address}`)
      console.log(`📝 Documentação Swagger em: ${address}/documentation`)
    })
    .catch(err => {
      app.log.error(err)
      process.exit(1)
    })
}
