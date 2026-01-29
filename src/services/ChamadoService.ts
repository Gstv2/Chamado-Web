import { IChamadoRepository } from '../interfaces/IChamadoRepository';
import { Chamado, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

// Service de Chamados
// Responsável por conter as regras de negócio e intermediar entre o Controller e o Repository
export class ChamadoService {
  private chamadoRepository: IChamadoRepository;

  constructor(chamadoRepository: IChamadoRepository) {
    this.chamadoRepository = chamadoRepository;
  }

  // Cria um novo chamado
  async create(data: Prisma.ChamadoCreateInput): Promise<Chamado> {
    // Aqui poderiam entrar validações de negócio mais complexas
    return this.chamadoRepository.create(data);
  }

  // Lista chamados com base no papel (Role) do usuário
  // Admin vê todos; User vê apenas os seus
  async listByRole(userId: string, role: string): Promise<Chamado[]> {
    if (role === 'ADMIN') {
      return this.chamadoRepository.findAll();
    } else {
      return this.chamadoRepository.findByUserId(userId);
    }
  }

  // Busca um chamado pelo ID
  async findById(id: string): Promise<Chamado | null> {
    return this.chamadoRepository.findById(id);
  }

  // Atualiza um chamado
  async update(id: string, data: Prisma.ChamadoUpdateInput): Promise<Chamado> {
    const chamado = await this.chamadoRepository.findById(id);
    if (!chamado) {
      throw new AppError('Chamado não encontrado.', 404);
    }
    return this.chamadoRepository.update(id, data);
  }

  // Remove um chamado (apenas Admin, verificado no controller/middleware, mas aqui garantimos existência)
  async delete(id: string): Promise<void> {
    const chamado = await this.chamadoRepository.findById(id);
    if (!chamado) {
      throw new AppError('Chamado não encontrado.', 404);
    }
    await this.chamadoRepository.delete(id);
  }
}
