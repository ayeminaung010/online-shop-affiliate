'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { ExternalLink, ImageIcon } from 'lucide-react';
import { t } from '@/lib/i18n';

const ProductCard = memo(function ProductCard({ p }) {
  const isShopee = p.platform === 'Shopee';

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border-border hover:border-primary">
      <Link href={`/products/${p.id}`} className="cursor-pointer">
        <div className="relative w-full aspect-square bg-muted">
          {p.imageUrl ? (
            <Image
              src={p.imageUrl}
              alt={p.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UxZTRlOCIvPjwvc3ZnPg=="
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
          {/* Platform badge on image corner */}
          <Badge variant="outline" className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 uppercase tracking-wide font-semibold backdrop-blur-sm shadow-sm ${isShopee ? 'bg-[#ee4d2d]/90 text-white border-[#ee4d2d]/40 dark:bg-[#ee4d2d]/80' : 'bg-[#0f146d]/90 text-white border-[#0f146d]/40 dark:bg-[#5c62df]/80'}`}>
            {p.platform}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-2 sm:p-3 flex flex-col flex-1 gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5">
          {(p.status === 'need_recheck' || p.status === 'low_confidence') && (
            <StatusBadge status={p.status} />
          )}
          <span className="text-muted-foreground text-[10px] sm:text-xs font-semibold uppercase tracking-wide truncate">{p.category}</span>
        </div>

        <Link href={`/products/${p.id}`} className="hover:text-primary transition-colors">
          <h2 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem] m-0">{p.title}</h2>
        </Link>


        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-lg sm:text-xl font-bold text-primary">฿{Number(p.price || 0).toLocaleString()}</span>
          {p.oldPrice && p.oldPrice > p.price && (
            <>
            <span className="text-xs sm:text-sm text-muted-foreground line-through">฿{Number(p.oldPrice).toLocaleString()}</span>
            <Badge variant="secondary" className="text-[10px] sm:text-xs bg-red-100 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 font-bold px-1.5 py-0 border-transparent">
              -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
            </Badge>
            </>
          )}
        </div>

        <Button asChild className="w-full mt-1 font-semibold shadow-sm hover:shadow-md transition-all bg-primary min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm">
          <a href={`/go/${p.id}?source=tiktok-bio`} target="_blank" rel="noopener noreferrer">
            {t('product.viewDeal')}
            <ExternalLink className="ml-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
