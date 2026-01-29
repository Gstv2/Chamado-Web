import { User, Prisma } from '@prisma/client';

// Interface do Repositório de Usuários
// Define o contrato que qualquer implementação de repositório de usuários deve seguir.
// Isso permite a inversão de dependência e facilita testes (mocking).
export interface IUserRepository {
  // Cria um novo usuário no banco de dados
  create(data: Prisma.UserCreateInput): Promise<User>;

  // Busca um usuário pelo seu endereço de e-mail (chave única)
  findByEmail(email: string): Promise<User | null>;

  // Retorna todos os usuários cadastrados
  findAll(): Promise<User[]>;
}
