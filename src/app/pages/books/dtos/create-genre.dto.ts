import { z } from 'zod';

export const CreateGenreSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre del género debe tener al menos 3 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción del género debe tener al menos 10 caracteres'),
  created_by: z.string().uuid('El ID del creador debe ser un UUID válido'),
});

export type CreateGenreDto = z.infer<typeof CreateGenreSchema>;
