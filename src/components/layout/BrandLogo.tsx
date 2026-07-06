export const BRAND_LOGO_SRC = "/IMG_1307.PNG";

/** Alturas visuais alinhadas ao texto antigo (1.55rem header, etc.), com escala extra pelo padding do PNG. */
const SIZE_CLASS = {
  header: "h-[4.25rem] w-auto",
  footer: "h-[4.75rem] w-auto",
  admin: "h-[3.5rem] w-auto",
  "admin-login": "h-[5.5rem] w-auto",
} as const;

export type BrandLogoSize = keyof typeof SIZE_CLASS;

export interface BrandLogoProps {
  size?: BrandLogoSize;
  className?: string;
}

export function BrandLogo({ size = "header", className }: BrandLogoProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt="Afro90s"
      className={className ?? SIZE_CLASS[size]}
      draggable={false}
    />
  );
}
