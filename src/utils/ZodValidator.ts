import { ZodError, ZodSchema } from 'zod';
import winstonLogger from '@plugis/WistonLoggerPlugin';
interface ZodValidationError {
  field: string;
  message: string;
}

export function validateWithZod<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      const validationErrors: ZodValidationError[] = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      validationErrors.forEach((error, index) => {
        winstonLogger.error(`Error de validación en el campo: ${error.field}`);
        winstonLogger.error(`Mensaje: ${error.message}`);
      });

      throw new Error(validationErrors.map((e) => e.message).join(', '));
    }
    throw err;
  }
}
