import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import jwt from '@fastify/jwt'
import { PrismaClient } from '@prisma/client'
import { userRoutes } from './routes/users.routes'
import { chamadoRoutes } from './routes/chamados.routes'

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

// Inicialização do servidor na porta 3333
app.listen({ port: 3333 })
  .then(address => {
    console.log(`🚀 Servidor rodando em: ${address}`)
    console.log(`📝 Documentação Swagger em: ${address}/documentation`)
  })
  .catch(err => {
    app.log.error(err)
    process.exit(1)
  })
