import { PrismaClient, Chamado, Prisma } from '@prisma/client';
import { IChamadoRepository } from '../interfaces/IChamadoRepository';

// Implementação concreta do Repositório de Chamados usando Prisma
export class ChamadoRepository implements IChamadoRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Cria um chamado no banco de dados
  async create(data: Prisma.ChamadoCreateInput): Promise<Chamado> {
    return this.prisma.chamado.create({ data });
  }

  // Retorna todos os chamados, INCLUINDO os dados do usuário relacionado (Eager Loading)
  async findAll(): Promise<Chamado[]> {
    return this.prisma.chamado.findMany({
      include: { usuario: true }, // Traz o objeto 'usuario' completo junto com o chamado
    });
  }

  // Filtra chamados pelo ID do usuário
  async findByUserId(userId: string): Promise<Chamado[]> {
    return this.prisma.chamado.findMany({
      where: { usuarioId: userId },
    });
  }
}
