import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { ArrowLeft, ExternalLink, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { t } from '@/lib/i18n';
import { readProduct } from '@/lib/store';
import { notFound } from 'next/navigation';
import ProductTracker from '@/components/ProductTracker';

// ISR: revalidate every 120 seconds
export const revalidate = 120;

// Dynamic SEO metadata per product
export async function generateMetadata({ params }) {
    const { id } = await params;
    try {
        const product = await readProduct(id);
        return {
            title: `${product.title} — VantageMM`,
            description: product.description || `${product.title} ကို ${product.platform} တွင် ฿${Number(product.price).toLocaleString()} ဖြင့် ဝယ်ယူပါ`,
            openGraph: {
                title: product.title,
                description: product.description || `฿${Number(product.price).toLocaleString()} — ${product.platform}`,
                images: product.imageUrl ? [{ url: product.imageUrl }] : [],
                type: 'website',
            },
        };
    } catch {
        return { title: 'Product Not Found — VantageMM' };
    }
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params;

    let product;
    try {
        product = await readProduct(id);
    } catch {
        notFound();
    }

    if (!product) {
        notFound();
    }

    const isShopee = product.platform === 'Shopee';
    const discount = product.oldPrice && product.oldPrice > product.price
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return (
        <main className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8">
            <ProductTracker productId={product.id} platform={product.platform} />

            {/* Back */}
            <Link href="/">
                <Button variant="ghost" className="mb-4 min-h-[44px] -ml-2">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('products.prev')}
                </Button>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Image */}
                <div className="relative">
                    <div className="relative w-full aspect-square rounded-2xl bg-muted overflow-hidden shadow-md">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UxZDRlOCIvPjwvc3ZnPg=="
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <ImageIcon className="w-16 h-16" />
                            </div>
                        )}
                    </div>

                    {discount > 0 && (
                        <div className="absolute top-3 right-3 w-14 h-14 rounded-full bg-red-500 text-white flex flex-col items-center justify-center font-extrabold shadow-lg rotate-[-8deg]">
                            <span className="text-xs leading-none">-{discount}%</span>
                        </div>
                    )}

                    {(product.status === 'need_recheck' || product.status === 'low_confidence') && (
                        <div className="absolute top-3 left-3">
                            <StatusBadge status={product.status} className="shadow-sm" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4">
                    {/* Platform Badge */}
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`uppercase tracking-wide font-semibold text-sm ${isShopee ? 'bg-[#ee4d2d]/10 text-[#ee4d2d] border-[#ee4d2d]/20' : 'bg-[#0f146d]/10 text-[#0f146d] border-[#0f146d]/20'}`}>
                            {product.platform}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                            {product.category}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                        {product.title}
                    </h1>

                    {/* Description */}
                    {product.description && (
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl md:text-4xl font-extrabold text-primary">
                            ฿{Number(product.price || 0).toLocaleString()}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                            <span className="text-lg text-muted-foreground line-through">
                                ฿{Number(product.oldPrice).toLocaleString()}
                            </span>
                        )}
                        {discount > 0 && (
                            <Badge className="bg-red-500 text-white font-bold text-sm">
                                -{discount}% OFF
                            </Badge>
                        )}
                    </div>

                    {/* Trust indicator */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span>{t('hero.trust')}</span>
                    </div>

                    {/* CTA */}
                    <Button asChild className="w-full md:w-auto min-h-[52px] text-lg font-bold shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-primary to-accent mt-2">
                        <a href={`/go/${product.id}?source=detail-page`} target="_blank" rel="noopener noreferrer">
                            {t('product.buyOn', { platform: product.platform })}
                            <ExternalLink className="ml-2 w-5 h-5" />
                        </a>
                    </Button>

                    {/* Disclaimers */}
                    <Card className="p-4 border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-800 shadow-sm mt-2">
                        <div className="text-sm space-y-1">
                            <p className="text-amber-800 dark:text-amber-400 font-medium">{t('disclaimer.price')}</p>
                            <p className="text-amber-700 dark:text-amber-500">{t('disclaimer.delivery')}</p>
                            <p className="text-amber-700 dark:text-amber-500">{t('disclaimer.reshipping')}</p>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
