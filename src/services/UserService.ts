import { IUserRepository } from '../interfaces/IUserRepository';
import { User, Prisma } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { AppError } from '../utils/AppError';

// Service de Usuários
// Responsável por conter as regras de negócio de usuários (criação, autenticação, listagem)
// Intermedia a comunicação entre Controller e Repository
export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  // Cria um novo usuário
  async create(data: Prisma.UserCreateInput): Promise<User> {
    // Regra de Negócio: Verificar se usuário já existe
    const userExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new AppError('Usuário já existe.', 409); // Conflict
    }

    // Regra de Negócio: Hash da senha
    const passwordHash = await hash(data.senha, 6);

    // Cria o usuário com a senha hasheada
    return this.userRepository.create({
      ...data,
      senha: passwordHash,
      role: data.role || 'USER', // Garante default
    });
  }

  // Autentica um usuário (Login)
  async authenticate(email: string, senha: string): Promise<User> {
    // Busca o usuário
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('E-mail ou senha inválidos.', 401); // Unauthorized
    }

    // Verifica a senha
    const passwordMatch = await compare(senha, user.senha);

    if (!passwordMatch) {
      throw new AppError('E-mail ou senha inválidos.', 401); // Unauthorized
    }

    return user;
  }

  // Lista todos os usuários
  async list(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
