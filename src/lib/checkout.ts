import { z } from "zod";

export const checkoutFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  address: z.string().trim().min(5, "Informe o endereço de entrega"),
  postalCode: z.string().trim().min(1, "Informe o CEP"),
  tel: z.string().trim().min(1, "Informe o telefone"),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
