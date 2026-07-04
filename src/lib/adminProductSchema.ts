import { z } from "zod";
import type { PhotoFormItem } from "@/lib/adminProductSubmit";

export const PRODUCT_NAME_MIN_LENGTH = 2;
export const PRODUCT_NAME_MAX_LENGTH = 120;
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 2000;
export const PRODUCT_QUANTITY_MAX = 99_999;
export const PRODUCT_OPTION_MAX_COUNT = 5;
export const PRODUCT_OPTION_MAX_LENGTH = 40;
export const PRODUCT_IMAGE_MAX_COUNT = 10;
export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_MAX_TOTAL_BYTES = 10 * 1024 * 1024;
export const PRODUCT_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const productOptionsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Opção não pode ser vazia")
      .max(PRODUCT_OPTION_MAX_LENGTH, `Opção com no máximo ${PRODUCT_OPTION_MAX_LENGTH} caracteres`),
  )
  .max(PRODUCT_OPTION_MAX_COUNT, `Máximo de ${PRODUCT_OPTION_MAX_COUNT} opções`)
  .superRefine((items, ctx) => {
    const seen = new Set<string>();
    for (const item of items) {
      const key = item.toLowerCase();
      if (seen.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Opções duplicadas (ignora maiúsculas/minúsculas).",
        });
        return;
      }
      seen.add(key);
    }
  })
  .default([]);

export const adminProductFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(PRODUCT_NAME_MIN_LENGTH, "Informe pelo menos 2 caracteres")
    .max(PRODUCT_NAME_MAX_LENGTH, `Nome com no máximo ${PRODUCT_NAME_MAX_LENGTH} caracteres`),
  description: z
    .string()
    .trim()
    .max(
      PRODUCT_DESCRIPTION_MAX_LENGTH,
      `Descrição com no máximo ${PRODUCT_DESCRIPTION_MAX_LENGTH} caracteres`,
    )
    .default(""),
  price: z
    .number({ invalid_type_error: "Campo obrigatório" })
    .positive("Informe um preço maior que zero")
    .multipleOf(0.01, "Preço deve ser múltiplo de R$ 0,01"),
  quantity: z
    .number({ invalid_type_error: "Campo obrigatório" })
    .int("Estoque deve ser um número inteiro")
    .min(0, "Estoque não pode ser negativo")
    .max(PRODUCT_QUANTITY_MAX, `Estoque máximo: ${PRODUCT_QUANTITY_MAX}`),
  category: z.enum(["oculos", "acessorios", "maquiagem"], {
    errorMap: () => ({ message: "Selecione uma categoria válida" }),
  }),
  options: productOptionsSchema,
});

export type AdminProductFormValues = z.infer<typeof adminProductFormSchema>;

export type AdminProductFieldErrors = Partial<Record<keyof AdminProductFormValues, string>>;

export function validateProductOptionDraft(option: string, currentOptions: string[]): string | null {
  const trimmed = option.trim();
  if (!trimmed) return "Informe a opção.";
  if (trimmed.length > PRODUCT_OPTION_MAX_LENGTH) {
    return `Opção com no máximo ${PRODUCT_OPTION_MAX_LENGTH} caracteres.`;
  }
  if (currentOptions.length >= PRODUCT_OPTION_MAX_COUNT) {
    return `Máximo de ${PRODUCT_OPTION_MAX_COUNT} opções.`;
  }
  if (currentOptions.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
    return "Opção já adicionada.";
  }
  return null;
}

export function isValidProductPhotoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function totalFileBytes(photos: PhotoFormItem[]): number {
  return photos
    .filter((photo): photo is Extract<PhotoFormItem, { kind: "file" }> => photo.kind === "file")
    .reduce((sum, photo) => sum + photo.file.size, 0);
}

export function validateProductPhotoUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return "Informe a URL da imagem.";
  if (!isValidProductPhotoUrl(trimmed)) return "URL inválida. Use http:// ou https://.";
  return null;
}

export function validateProductPhotoFile(
  file: File,
  currentPhotos: PhotoFormItem[],
): string | null {
  if (!PRODUCT_IMAGE_MIME_TYPES.includes(file.type as (typeof PRODUCT_IMAGE_MIME_TYPES)[number])) {
    return "Formato inválido. Use JPEG, PNG ou WebP.";
  }

  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return "Arquivo muito grande. Máximo 5 MB por imagem.";
  }

  if (currentPhotos.length >= PRODUCT_IMAGE_MAX_COUNT) {
    return `Máximo de ${PRODUCT_IMAGE_MAX_COUNT} imagens por produto.`;
  }

  const nextTotal = totalFileBytes(currentPhotos) + file.size;
  if (nextTotal > PRODUCT_IMAGE_MAX_TOTAL_BYTES) {
    return "Total de uploads excede 10 MB.";
  }

  return null;
}

export function validateProductPhotos(photos: PhotoFormItem[]): string | null {
  if (photos.length > PRODUCT_IMAGE_MAX_COUNT) {
    return `Máximo de ${PRODUCT_IMAGE_MAX_COUNT} imagens por produto.`;
  }

  let fileBytes = 0;

  for (const photo of photos) {
    if (photo.kind === "existing" || photo.kind === "url") {
      const urlError = validateProductPhotoUrl(photo.url);
      if (urlError) return urlError;
      continue;
    }

    if (!PRODUCT_IMAGE_MIME_TYPES.includes(photo.file.type as (typeof PRODUCT_IMAGE_MIME_TYPES)[number])) {
      return "Formato inválido. Use JPEG, PNG ou WebP.";
    }

    if (photo.file.size > PRODUCT_IMAGE_MAX_BYTES) {
      return "Arquivo muito grande. Máximo 5 MB por imagem.";
    }

    fileBytes += photo.file.size;
  }

  if (fileBytes > PRODUCT_IMAGE_MAX_TOTAL_BYTES) {
    return "Total de uploads excede 10 MB.";
  }

  return null;
}

export function parseAdminProductForm(values: {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: AdminProductFormValues["category"];
  options: string[];
}):
  | { success: true; data: AdminProductFormValues }
  | { success: false; fieldErrors: AdminProductFieldErrors } {
  const parsed = adminProductFormSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: AdminProductFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key as keyof AdminProductFormValues]) {
        fieldErrors[key as keyof AdminProductFormValues] = issue.message;
      }
    }
    return { success: false, fieldErrors };
  }

  return { success: true, data: parsed.data };
}

export function validateAdminProductSubmission(
  values: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: AdminProductFormValues["category"];
    options: string[];
  },
  photos: PhotoFormItem[],
):
  | { success: true; data: AdminProductFormValues }
  | {
      success: false;
      fieldErrors?: AdminProductFieldErrors;
      photosError?: string;
    } {
  const formResult = parseAdminProductForm(values);
  if (!formResult.success) {
    return { success: false, fieldErrors: formResult.fieldErrors };
  }

  const photosError = validateProductPhotos(photos);
  if (photosError) {
    return { success: false, photosError };
  }

  return { success: true, data: formResult.data };
}
