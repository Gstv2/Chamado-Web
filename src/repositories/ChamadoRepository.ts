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
      include: { usuario: true },
    });
  }

  // Busca um chamado pelo ID
  async findById(id: string): Promise<Chamado | null> {
    return this.prisma.chamado.findUnique({
      where: { id },
      include: { usuario: true },
    });
  }

  // Atualiza um chamado existente
  async update(id: string, data: Prisma.ChamadoUpdateInput): Promise<Chamado> {
    return this.prisma.chamado.update({
      where: { id },
      data,
      include: { usuario: true },
    });
  }

  // Remove um chamado pelo ID
  async delete(id: string): Promise<void> {
    await this.prisma.chamado.delete({
      where: { id },
    });
  }
}
