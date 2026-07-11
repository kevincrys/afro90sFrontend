import { z } from "zod";
import { sanitizePhone } from "@/lib/phone";
import { sanitizePostalCode } from "@/lib/postalCode";

const CUSTOMER_NAME_PATTERN = /^[\p{L}\s'-]+$/u;

/** Alinhado ao backend: `CustomerSchema.tel` → `/^\d{10,11}$/` (só dígitos, DDD + número). */
export const checkoutFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo")
    .regex(CUSTOMER_NAME_PATTERN, "Nome não pode conter números"),
  address: z.string().trim().min(5, "Informe o endereço de entrega"),
  postalCode: z
    .string()
    .transform(sanitizePostalCode)
    .pipe(z.string().length(8, "Informe um CEP válido com 8 dígitos")),
  tel: z
    .string()
    .transform(sanitizePhone)
    .pipe(
      z
        .string()
        .regex(/^\d{10,11}$/, "Informe um telefone válido com DDD (10 ou 11 dígitos)"),
    ),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
