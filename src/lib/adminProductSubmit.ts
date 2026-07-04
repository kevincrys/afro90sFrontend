import type { AdminProductFormValues } from "@/lib/adminProductSchema";
import type { CreateProductInput, PhotoInput, UpdateProductInput } from "@/types/product";

export type PhotoFormItem =
  | { kind: "existing"; url: string }
  | { kind: "url"; url: string }
  | { kind: "file"; file: File; preview: string };

export type ProductSubmitPayload =
  | { mode: "json"; body: CreateProductInput | UpdateProductInput }
  | { mode: "multipart"; formData: FormData };

function buildPhotoInputs(photos: PhotoFormItem[]): {
  photoInputs: PhotoInput[];
  files: File[];
} {
  const photoInputs: PhotoInput[] = [];
  const files: File[] = [];

  for (const photo of photos) {
    if (photo.kind === "existing" || photo.kind === "url") {
      photoInputs.push({ type: "url", value: photo.url });
      continue;
    }

    const fieldName = `photo_${files.length}`;
    photoInputs.push({ type: "stream", fieldName });
    files.push(photo.file);
  }

  return { photoInputs, files };
}

function buildProductBody(
  values: AdminProductFormValues,
  photoInputs: PhotoInput[],
): CreateProductInput {
  return {
    name: values.name,
    description: values.description,
    price: values.price,
    quantity: values.quantity,
    category: values.category,
    options: values.options.length > 0 ? values.options : undefined,
    photos: photoInputs.length > 0 ? photoInputs : undefined,
  };
}

function appendProductFields(formData: FormData, values: AdminProductFormValues): void {
  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("price", String(values.price));
  formData.append("quantity", String(values.quantity));
  formData.append("category", values.category);
  if (values.options.length > 0) {
    formData.append("options", JSON.stringify(values.options));
  }
}

export function buildProductSubmitPayload(
  values: AdminProductFormValues,
  photos: PhotoFormItem[],
): ProductSubmitPayload {
  const { photoInputs, files } = buildPhotoInputs(photos);
  const body = buildProductBody(values, photoInputs);

  if (files.length === 0) {
    return { mode: "json", body };
  }

  const formData = new FormData();
  appendProductFields(formData, values);
  formData.append("photos", JSON.stringify(photoInputs));

  for (let i = 0; i < files.length; i++) {
    formData.append(`photo_${i}`, files[i]!);
  }

  return { mode: "multipart", formData };
}
