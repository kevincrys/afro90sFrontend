import brandLogoUrl from "@/assets/logo.png";

const SIZE_CLASS = {
  header: "h-[3rem] w-auto",
  footer: "h-[3.25rem] w-auto",
  admin: "h-[2.5rem] w-auto",
  "admin-login": "h-[4rem] w-auto",
} as const;

export type BrandLogoSize = keyof typeof SIZE_CLASS;

export interface BrandLogoProps {
  size?: BrandLogoSize;
  className?: string;
}

export function BrandLogo({ size = "header", className }: BrandLogoProps) {
  return (
    <img
      src={brandLogoUrl}
      alt="Afro90s"
      className={className ?? SIZE_CLASS[size]}
      draggable={false}
    />
  );
}
