import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Limpar banco (ordem importa por causa das chaves estrangeiras)
  await prisma.chamado.deleteMany()
  await prisma.user.deleteMany()

  // Criar Usuários
  const admin = await prisma.user.create({
    data: {
      nome: 'Admin User',
      email: 'admin@example.com',
      senha: 'hashed_password_123', // Em produção, use bcrypt
      role: 'ADMIN',
    },
  })

  const user = await prisma.user.create({
    data: {
      nome: 'Normal User',
      email: 'user@example.com',
      senha: 'hashed_password_456',
      role: 'USER',
    },
  })

  console.log(`Created users: ${admin.nome}, ${user.nome}`)

  // Criar Chamados
  const chamado1 = await prisma.chamado.create({
    data: {
      titulo: 'Erro no Login',
      descricao: 'Não consigo acessar minha conta',
      prioridade: 'ALTA',
      usuarioId: user.id,
    },
  })

  const chamado2 = await prisma.chamado.create({
    data: {
      titulo: 'Solicitação de Acesso',
      descricao: 'Preciso de acesso ao módulo financeiro',
      prioridade: 'MEDIA',
      usuarioId: admin.id,
    },
  })

  console.log(`Created chamados: ${chamado1.titulo}, ${chamado2.titulo}`)
  console.log('✅ Seed finished successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
