import z from 'zod';
import { CreateAuthorSchema } from './create-author.dto';

export const UpdateAuthorSchema = z
  .object({
    id: z.string().uuid({ message: 'Invalid UUID format for id' }),
    updated_by: z
      .string()
      .uuid('El ID del actualizador debe ser un UUID válido'),
  })
  .merge(CreateAuthorSchema.partial().omit({ created_by: true }));

export type UpdateAuthorDto = z.infer<typeof UpdateAuthorSchema>;
