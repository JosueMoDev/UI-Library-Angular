import { z } from 'zod';
import { CreateGenreSchema } from './create-genre.dto';

export const UpdateGenreSchema = z
  .object({
    id: z.string().uuid('El ID del género debe ser un UUID válido'),
    updated_by: z
      .string()
      .uuid('El ID del actualizador debe ser un UUID válido'),
  })
  .merge(CreateGenreSchema.partial().omit({ created_by: true }));

export type UpdateGenreDto = z.infer<typeof UpdateGenreSchema>;
