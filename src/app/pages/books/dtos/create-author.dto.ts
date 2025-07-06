import { z } from 'zod';

export const CreateAuthorSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  lastname: z.string().min(1, { message: 'Lastname is required' }),
  age: z
    .number()
    .min(0, { message: 'Age must be at least 0' })
    .max(100, { message: 'Age must be 100 or less' }),
  biography: z.string().min(1, { message: 'Biography is required' }),
  //   nationality: z.string().min(1, { message: 'Nationality is required' }),
  created_by: z.string().min(1, { message: 'Created by is required' }),
  profilePictureUrl: z
    .string()
    .min(1, { message: 'Nationality is required' })
    .optional(),
});

export type CreateAuthorDto = z.infer<typeof CreateAuthorSchema>;
