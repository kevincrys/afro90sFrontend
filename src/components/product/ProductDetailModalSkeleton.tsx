import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailModalSkeleton() {
  return (
    <div
      className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col md:flex-row"
      style={{ background: "#0D0009", border: "1px solid rgba(255,210,31,0.22)" }}
    >
      <div className="md:w-1/2 flex flex-col flex-shrink-0">
        <Skeleton className="aspect-[4/5] w-full rounded-none" />
        <div className="flex gap-2 p-3 border-t border-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-14 h-14 rounded-none flex-shrink-0" />
          ))}
        </div>
      </div>
      <div className="md:w-1/2 flex flex-col p-7 gap-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-12 w-full mt-auto" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
