import { Chamado, Prisma } from '@prisma/client';

// Interface do Repositório de Chamados
// Define os métodos necessários para a persistência de chamados.
export interface IChamadoRepository {
  // Cria um novo chamado no banco de dados
  create(data: Prisma.ChamadoCreateInput): Promise<Chamado>;

  // Retorna todos os chamados existentes
  findAll(): Promise<Chamado[]>;

  // Busca todos os chamados associados a um usuário específico
  findByUserId(userId: string): Promise<Chamado[]>;

  // Busca um chamado pelo ID
  findById(id: string): Promise<Chamado | null>;

  // Atualiza um chamado existente
  update(id: string, data: Prisma.ChamadoUpdateInput): Promise<Chamado>;

  // Remove um chamado pelo ID
  delete(id: string): Promise<void>;
}
