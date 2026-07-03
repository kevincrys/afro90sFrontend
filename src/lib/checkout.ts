import { z } from "zod";
import { sanitizePostalCode } from "@/lib/postalCode";

export const checkoutFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  address: z.string().trim().min(5, "Informe o endereço de entrega"),
  postalCode: z
    .string()
    .transform(sanitizePostalCode)
    .pipe(z.string().length(8, "Informe um CEP válido com 8 dígitos")),
  tel: z.string().trim().min(1, "Informe o telefone"),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
