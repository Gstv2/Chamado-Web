import { z } from 'zod';

export const createChamadoSchema = z.object({
  titulo: z.string().min(5, 'Título deve ter no mínimo 5 caracteres.'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres.'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional().default('MEDIA'),
});

export const updateChamadoSchema = z.object({
  titulo: z.string().min(5, 'Título deve ter no mínimo 5 caracteres.').optional(),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres.').optional(),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional(),
  status: z.enum(['ABERTO', 'EM_ANDAMENTO', 'FECHADO']).optional(),
});
