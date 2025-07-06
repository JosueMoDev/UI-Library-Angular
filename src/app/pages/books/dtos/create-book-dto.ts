import { z } from 'zod';

export const CreateBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  description: z.string().min(1, 'Description is required'),
  genres: z
    .array(z.string().uuid('Each genre must be a valid UUID'))
    .min(1, 'At least one genre is required'),
  authors: z
    .array(z.string().uuid('Each author must be a valid UUID'))
    .min(1, 'At least one author is required'),
  physical_enable: z.boolean(),
  created_by: z.string().uuid('Invalid user ID'),
});

export type CreateBookDto = z.infer<typeof CreateBookSchema>;
