import { useRef, useState } from "react";
import { Check, Link as LinkIcon, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminLabel, ADMIN_FONT } from "@/components/admin/AdminLabel";
import {
  type AdminProductFormValues,
  type AdminProductFieldErrors,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_IMAGE_MAX_COUNT,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_OPTION_MAX_LENGTH,
  PRODUCT_QUANTITY_MAX,
  validateAdminProductSubmission,
  validateProductOptionDraft,
  validateProductPhotoFile,
  validateProductPhotoUrl,
} from "@/lib/adminProductSchema";
import type { PhotoFormItem } from "@/lib/adminProductSubmit";
import { getCategoryLabel } from "@/lib/categoryLabels";
import type { Product } from "@/types/product";
import type { ProductCategory } from "@/types/category";

const CATEGORIES: ProductCategory[] = ["oculos", "acessorios", "maquiagem"];

function productToPhotos(product: Product | null): PhotoFormItem[] {
  if (!product) return [];
  return product.photos.map((url) => ({ kind: "existing", url }));
}

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmit: (values: AdminProductFormValues, photos: PhotoFormItem[]) => Promise<void>;
  isSubmitting: boolean;
}

export default function ProductFormModal({
  product,
  onClose,
  onSubmit,
  isSubmitting,
}: ProductFormModalProps) {
  const isNew = !product;
  const [form, setForm] = useState<AdminProductFormValues>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    quantity: product?.quantity ?? 0,
    category: product?.category ?? "oculos",
    options: product?.options ?? [],
  });
  const [photos, setPhotos] = useState<PhotoFormItem[]>(() => productToPhotos(product));
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [urlInput, setUrlInput] = useState("");
  const [optionDraft, setOptionDraft] = useState("");
  const [optionDraftError, setOptionDraftError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AdminProductFieldErrors>({});
  const [photosError, setPhotosError] = useState("");
  const [urlInputError, setUrlInputError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function setField<K extends keyof AdminProductFormValues>(key: K, value: AdminProductFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  function addOption() {
    const error = validateProductOptionDraft(optionDraft, form.options);
    if (error) {
      setOptionDraftError(error);
      toast.error(error);
      return;
    }

    const trimmed = optionDraft.trim();
    setForm((current) => ({ ...current, options: [...current.options, trimmed] }));
    setOptionDraft("");
    setOptionDraftError("");
    setFieldErrors((current) => ({ ...current, options: undefined }));
  }

  function removeOption(index: number) {
    setForm((current) => ({
      ...current,
      options: current.options.filter((_, idx) => idx !== index),
    }));
    setFieldErrors((current) => ({ ...current, options: undefined }));
  }

  function addImageUrl() {
    const url = urlInput.trim();
    const urlError = validateProductPhotoUrl(url);
    if (urlError) {
      setUrlInputError(urlError);
      toast.error(urlError);
      return;
    }

    if (photos.length >= PRODUCT_IMAGE_MAX_COUNT) {
      const message = `Máximo de ${PRODUCT_IMAGE_MAX_COUNT} imagens por produto.`;
      setPhotosError(message);
      toast.error(message);
      return;
    }

    setPhotos((current) => [...current, { kind: "url", url }]);
    setUrlInput("");
    setUrlInputError("");
    setPhotosError("");
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, idx) => idx !== index));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const accepted: PhotoFormItem[] = [];

    for (const file of files) {
      const fileError = validateProductPhotoFile(file, [...photos, ...accepted]);
      if (fileError) {
        setPhotosError(fileError);
        toast.error(fileError);
        continue;
      }

      accepted.push({
        kind: "file",
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (accepted.length > 0) {
      setPhotos((current) => [...current, ...accepted]);
      setPhotosError("");
    }

    event.target.value = "";
  }

  function validate(): AdminProductFormValues | null {
    const result = validateAdminProductSubmission(
      {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category: form.category,
        options: form.options,
      },
      photos,
    );

    if (!result.success) {
      setFieldErrors(result.fieldErrors ?? {});
      setPhotosError(result.photosError ?? "");
      return null;
    }

    setFieldErrors({});
    setPhotosError("");
    return result.data;
  }

  async function handleSave() {
    const values = validate();
    if (!values) return;
    await onSubmit(values, photos);
  }

  const inputCls = (hasError?: boolean) =>
    `w-full px-3 py-2.5 bg-muted border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors text-sm ${hasError ? "border-red-500" : "border-border"}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(event) => event.target === event.currentTarget && !isSubmitting && onClose()}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col"
        style={{ background: "#0D0009", border: "1px solid rgba(255,210,31,0.22)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
      >
        <div
          className="flex items-center justify-between px-7 py-5 border-b border-border sticky top-0 z-10"
          style={{ background: "#0D0009" }}
        >
          <div
            id="product-form-title"
            style={{
              fontFamily: ADMIN_FONT.display,
              fontSize: "1.2rem",
              color: "#FFD21F",
              letterSpacing: "0.05em",
            }}
          >
            {isNew ? "NOVO PRODUTO" : "EDITAR PRODUTO"}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-7 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <AdminLabel>NOME *</AdminLabel>
              <input
                className={inputCls(Boolean(fieldErrors.name))}
                value={form.name}
                placeholder="Nome do produto"
                maxLength={PRODUCT_NAME_MAX_LENGTH}
                onChange={(event) => setField("name", event.target.value)}
                style={{ fontFamily: ADMIN_FONT.body }}
              />
              {fieldErrors.name && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: ADMIN_FONT.mono }}>
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <AdminLabel>DESCRIÇÃO (opcional)</AdminLabel>
              <textarea
                className={inputCls(Boolean(fieldErrors.description))}
                value={form.description}
                rows={3}
                maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH}
                placeholder="Descrição do produto..."
                onChange={(event) => setField("description", event.target.value)}
                style={{ fontFamily: ADMIN_FONT.body, resize: "vertical" }}
              />
              {fieldErrors.description && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: ADMIN_FONT.mono }}>
                  {fieldErrors.description}
                </p>
              )}
            </div>

            <div>
              <AdminLabel>CATEGORIA</AdminLabel>
              <select
                className={inputCls()}
                value={form.category}
                onChange={(event) => setField("category", event.target.value as ProductCategory)}
                style={{ fontFamily: ADMIN_FONT.body, background: "#1F0016" }}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <AdminLabel>ESTOQUE</AdminLabel>
              <input
                type="number"
                className={inputCls(Boolean(fieldErrors.quantity))}
                value={form.quantity}
                min={0}
                max={PRODUCT_QUANTITY_MAX}
                step={1}
                onChange={(event) => {
                  const parsed = parseInt(event.target.value, 10);
                  setField("quantity", Number.isNaN(parsed) ? 0 : parsed);
                }}
                style={{ fontFamily: ADMIN_FONT.body }}
              />
              {fieldErrors.quantity && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: ADMIN_FONT.mono }}>
                  {fieldErrors.quantity}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <AdminLabel>PREÇO (BRL) *</AdminLabel>
              <input
                type="number"
                className={inputCls(Boolean(fieldErrors.price))}
                value={form.price || ""}
                placeholder="0,00"
                step="0.01"
                min="0.01"
                onChange={(event) => {
                  const parsed = parseFloat(event.target.value);
                  setField("price", Number.isNaN(parsed) ? 0 : parsed);
                }}
                style={{ fontFamily: ADMIN_FONT.body }}
              />
              {fieldErrors.price && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: ADMIN_FONT.mono }}>
                  {fieldErrors.price}
                </p>
              )}
            </div>
          </div>

          <div>
            <AdminLabel>OPÇÕES (opcional)</AdminLabel>
            {form.options.map((option, index) => (
              <div
                key={`${option}-${index}`}
                className="flex items-center gap-3 mb-2 p-3 bg-card border border-border"
              >
                <div
                  className="flex-1 min-w-0"
                  style={{
                    fontFamily: ADMIN_FONT.mono,
                    fontSize: "0.65rem",
                    color: "#FFD21F",
                    letterSpacing: "0.08em",
                  }}
                >
                  {option}
                </div>
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                  aria-label={`Remover opção ${option}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                className={`${inputCls(Boolean(optionDraftError || fieldErrors.options))} flex-1`}
                value={optionDraft}
                maxLength={PRODUCT_OPTION_MAX_LENGTH}
                placeholder='Ex.: "Preto", "P", "M"'
                onChange={(event) => {
                  setOptionDraft(event.target.value);
                  setOptionDraftError("");
                }}
                onKeyDown={(event) =>
                  event.key === "Enter" && (event.preventDefault(), addOption())
                }
                style={{ fontFamily: ADMIN_FONT.body }}
              />
              <button
                type="button"
                onClick={addOption}
                className="px-3 bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity flex-shrink-0 flex items-center justify-center"
                style={{ minWidth: 40 }}
                aria-label="Adicionar opção"
              >
                <Plus size={16} />
              </button>
            </div>
            {(optionDraftError || fieldErrors.options) && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: ADMIN_FONT.mono }}>
                {optionDraftError ?? fieldErrors.options}
              </p>
            )}
          </div>

          <div>
            <AdminLabel>IMAGENS DO PRODUTO</AdminLabel>
            <div className="flex gap-0 mb-3">
              {(["url", "upload"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setImageTab(tab)}
                  className="flex-1 py-2.5 flex items-center justify-center gap-2 text-xs uppercase border transition-colors"
                  style={{
                    fontFamily: ADMIN_FONT.mono,
                    fontSize: "0.6rem",
                    letterSpacing: "0.14em",
                    background: imageTab === tab ? "rgba(255,210,31,0.1)" : "transparent",
                    borderColor: imageTab === tab ? "#FFD21F" : "rgba(255,210,31,0.2)",
                    color: imageTab === tab ? "#FFD21F" : "#9A7085",
                  }}
                >
                  {tab === "url" ? (
                    <>
                      <LinkIcon size={12} /> URL
                    </>
                  ) : (
                    <>
                      <Upload size={12} /> UPLOAD
                    </>
                  )}
                </button>
              ))}
            </div>

            {imageTab === "url" ? (
              <div>
                <div className="flex gap-2">
                  <input
                    className={`${inputCls(Boolean(urlInputError))} flex-1`}
                    value={urlInput}
                    placeholder="https://..."
                    onChange={(event) => {
                      setUrlInput(event.target.value);
                      setUrlInputError("");
                    }}
                    onKeyDown={(event) =>
                      event.key === "Enter" && (event.preventDefault(), addImageUrl())
                    }
                    style={{ fontFamily: ADMIN_FONT.body }}
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-4 bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex-shrink-0"
                    style={{
                      fontFamily: ADMIN_FONT.display,
                      fontSize: "0.8rem",
                      letterSpacing: "0.06em",
                    }}
                  >
                    ADD
                  </button>
                </div>
                {urlInputError && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: ADMIN_FONT.mono }}>
                    {urlInputError}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-6 border-2 border-dashed flex flex-col items-center gap-2 hover:border-primary transition-colors"
                  style={{ borderColor: "rgba(255,210,31,0.25)" }}
                >
                  <Upload size={20} color="#9A7085" />
                  <span
                    style={{
                      fontFamily: ADMIN_FONT.mono,
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      color: "#9A7085",
                    }}
                  >
                    CLIQUE PARA SELECIONAR FOTOS
                  </span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {photosError && (
              <p
                className="text-red-400 text-xs mt-2"
                style={{ fontFamily: ADMIN_FONT.mono }}
                role="alert"
              >
                {photosError}
              </p>
            )}

            {photos.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {photos.map((photo, index) => {
                  const src =
                    photo.kind === "file"
                      ? photo.preview
                      : photo.url;

                  return (
                    <div
                      key={`${src}-${index}`}
                      className="relative group w-20 h-20 overflow-hidden bg-muted border border-border"
                    >
                      <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remover imagem ${index + 1}`}
                      >
                        <X size={16} color="#F87171" />
                      </button>
                      {index === 0 && (
                        <div
                          className="absolute bottom-0 left-0 right-0 text-center py-0.5"
                          style={{
                            background: "#FFD21F",
                            fontFamily: ADMIN_FONT.mono,
                            fontSize: "0.45rem",
                            color: "#0D0009",
                            letterSpacing: "0.1em",
                          }}
                        >
                          CAPA
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1 py-4 bg-primary text-primary-foreground uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                fontFamily: ADMIN_FONT.display,
                fontSize: "0.95rem",
                letterSpacing: "0.1em",
              }}
            >
              <Check size={16} />
              {isSubmitting
                ? "SALVANDO..."
                : isNew
                  ? "CRIAR PRODUTO"
                  : "SALVAR ALTERAÇÕES"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 border border-border text-muted-foreground uppercase tracking-widest hover:border-primary/40 transition-colors disabled:opacity-50"
              style={{
                fontFamily: ADMIN_FONT.mono,
                fontSize: "0.62rem",
                letterSpacing: "0.16em",
              }}
            >
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
