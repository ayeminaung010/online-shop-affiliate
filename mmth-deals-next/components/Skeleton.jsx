import { Card, CardContent } from '@/components/ui/card';

export function ProductSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden border-border">
      <div className="w-full aspect-square md:aspect-[4/3] skeleton-shimmer" />
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="h-5 w-16 skeleton-shimmer rounded-full" />
          <div className="h-4 w-12 skeleton-shimmer rounded" />
        </div>
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-3/4 skeleton-shimmer rounded" />
        <div className="flex items-baseline gap-2 mt-auto">
          <div className="h-6 w-16 skeleton-shimmer rounded" />
          <div className="h-4 w-10 skeleton-shimmer rounded" />
        </div>
        <div className="h-10 w-full skeleton-shimmer rounded-md mt-2" />
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
