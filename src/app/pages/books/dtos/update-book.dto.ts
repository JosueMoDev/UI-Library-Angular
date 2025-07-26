import { z } from 'zod';
import { CreateBookSchema } from './create-book.dto';

export const UpdateBookSchema = z
  .object({
    id: z.string().uuid({ message: 'Invalid UUID format for id' }),
    updated_by: z
      .string()
      .uuid('El ID del actualizador debe ser un UUID válido'),
  })
  .merge(CreateBookSchema.partial().omit({ created_by: true }));

export type UpdateBookDto = z.infer<typeof UpdateBookSchema>;
