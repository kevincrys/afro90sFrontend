import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ADMIN_FONT } from "@/components/admin/AdminLabel";

interface AdminFilterCarouselProps {
  children: ReactNode;
  activeIndex?: number;
  ariaLabel?: string;
}

export default function AdminFilterCarousel({
  children,
  activeIndex,
  ariaLabel = "Filtros",
}: AdminFilterCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    updateScrollState();
    emblaApi.on("reInit", updateScrollState);
    emblaApi.on("scroll", updateScrollState);

    return () => {
      emblaApi.off("reInit", updateScrollState);
      emblaApi.off("scroll", updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  useEffect(() => {
    if (!emblaApi || activeIndex === undefined) return;
    emblaApi.scrollTo(activeIndex, true);
  }, [activeIndex, emblaApi]);

  const arrowStyle = {
    fontFamily: ADMIN_FONT.mono,
    background: "rgba(13,0,9,0.92)",
    borderColor: "rgba(255,210,31,0.25)",
  } as const;

  return (
    <div className="relative mb-6" role="region" aria-label={ariaLabel}>
      {canScrollPrev && (
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10"
          style={{
            background: "linear-gradient(to right, rgba(13,0,9,0.95), transparent)",
          }}
        />
      )}
      {canScrollNext && (
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10"
          style={{
            background: "linear-gradient(to left, rgba(13,0,9,0.95), transparent)",
          }}
        />
      )}

      <button
        type="button"
        aria-label="Ver filtros anteriores"
        disabled={!canScrollPrev}
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-0"
        style={arrowStyle}
      >
        <ChevronLeft size={16} />
      </button>

      <div ref={emblaRef} className="overflow-hidden px-9">
        <div className="flex touch-pan-x gap-2">{children}</div>
      </div>

      <button
        type="button"
        aria-label="Ver próximos filtros"
        disabled={!canScrollNext}
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-0"
        style={arrowStyle}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
