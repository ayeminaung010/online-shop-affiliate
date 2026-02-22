'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { ExternalLink, ImageIcon } from 'lucide-react';
import { t } from '@/lib/i18n/my';

const ProductCard = memo(function ProductCard({ p }) {
  const isShopee = p.platform === 'Shopee';
  
  return (
    <Card className="flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border-border hover:border-primary">
      <Link href={`/products/${p.id}`} className="cursor-pointer">
        <div className="relative w-full aspect-square md:aspect-[4/3] bg-muted">
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
        </div>
      </Link>

      <CardContent className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-center mb-1">
          <Badge variant="outline" className={`uppercase tracking-wide font-semibold ${isShopee ? 'bg-[#ee4d2d]/10 text-[#ee4d2d] border-[#ee4d2d]/20 dark:bg-[#ee4d2d]/20 dark:text-[#ff8b73]' : 'bg-[#0f146d]/10 text-[#0f146d] border-[#0f146d]/20 dark:bg-[#5c62df]/20 dark:text-[#8a90ff]'}`}>
            {p.platform}
          </Badge>
          <div className="flex items-center gap-1.5">
            {(p.status === 'need_recheck' || p.status === 'low_confidence') && (
              <StatusBadge status={p.status} />
            )}
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">{p.category}</span>
          </div>
        </div>

        <Link href={`/products/${p.id}`} className="hover:text-primary transition-colors">
          <h2 className="font-semibold text-base leading-snug line-clamp-2 m-0">{p.title}</h2>
        </Link>

        {p.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed m-0">{p.description}</p>
        )}

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-xl font-bold text-primary">฿{Number(p.price || 0).toLocaleString()}</span>
          {p.oldPrice && p.oldPrice > p.price && (
            <span className="text-sm text-muted-foreground line-through">฿{Number(p.oldPrice).toLocaleString()}</span>
          )}
        </div>

        <Button asChild className="w-full mt-2 font-semibold shadow-sm hover:shadow-md transition-all bg-primary min-h-[44px]">
          <a href={`/go/${p.id}?source=tiktok-bio`} target="_blank" rel="noopener noreferrer">
            {t('product.buyOn', { platform: p.platform })}
            <ExternalLink className="ml-2 w-4 h-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
