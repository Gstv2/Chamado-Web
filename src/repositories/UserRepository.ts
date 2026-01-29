import { PrismaClient, User, Prisma } from '@prisma/client';
import { IUserRepository } from '../interfaces/IUserRepository';

// Implementação concreta do Repositório de Usuários usando Prisma
// Esta classe interage diretamente com o banco de dados.
export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  // Injeção de dependência do Prisma Client
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Criação de usuário: Recebe os dados tipados pelo Prisma e salva
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  // Busca por e-mail: Utiliza o método findUnique do Prisma (otimizado para campos únicos)
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // Listagem completa: Retorna todos os registros da tabela users
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
