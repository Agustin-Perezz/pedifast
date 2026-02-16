import { z } from 'zod';

export const orderSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  notas: z.string().optional()
});

export type OrderFormData = z.infer<typeof orderSchema>;
