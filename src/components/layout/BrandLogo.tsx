export const BRAND_LOGO_SRC = "/IMG_1307.PNG";

export interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "h-9 w-auto" }: BrandLogoProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt="Afro90s"
      className={className}
      draggable={false}
    />
  );
}
