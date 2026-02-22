import { Card, CardContent } from '@/components/ui/card';

export function ProductSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border-border">
      <div className="relative w-full aspect-square skeleton-shimmer">
        <div className="absolute top-2 left-2 h-4 w-12 skeleton-shimmer rounded-full" />
      </div>
      <CardContent className="p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2">
        <div className="h-3 w-12 skeleton-shimmer rounded" />
        <div className="space-y-1">
          <div className="h-3.5 w-full skeleton-shimmer rounded" />
          <div className="h-3.5 w-3/4 skeleton-shimmer rounded" />
        </div>
        <div className="flex items-baseline gap-1.5 mt-auto">
          <div className="h-5 w-14 skeleton-shimmer rounded" />
          <div className="h-3 w-8 skeleton-shimmer rounded" />
        </div>
        <div className="h-10 sm:h-11 w-full skeleton-shimmer rounded-md mt-1" />
      </CardContent>
    </Card>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 skeleton-shimmer rounded" />
      <div className="aspect-video skeleton-shimmer rounded-2xl" />
      <div className="h-8 w-3/4 skeleton-shimmer rounded" />
      <div className="h-6 w-1/2 skeleton-shimmer rounded" />
      <div className="h-12 w-48 skeleton-shimmer rounded-md" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <ProductDetailSkeleton />
    </div>
  );
}
