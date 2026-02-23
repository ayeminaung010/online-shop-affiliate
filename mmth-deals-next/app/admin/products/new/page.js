'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n/my';
import CategoryCombobox from '@/components/admin/CategoryCombobox';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function NewProductPage() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [form, setForm] = useState({
        title: '', platform: 'Shopee', category: 'General',
        price: 0, oldPrice: 0, imageUrl: '', affiliateUrl: '',
        description: '', priority: 0, status: 'active',
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const supabase = getSupabaseBrowser();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { router.push('/admin/login'); return; }
            setToken(session.access_token);
            setUserEmail(session.user.email || '');
        });
        // Fetch distinct categories
        supabase
            .from('products')
            .select('category')
            .not('category', 'is', null)
            .then(({ data }) => {
                if (data) {
                    const unique = [...new Set(data.map((r) => r.category).filter(Boolean))];
                    setCategories(unique.sort());
                }
            });
    }, [router]);

    const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    async function save(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, createdBy: userEmail }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', msg: t('msg.saveSuccess') });
                setTimeout(() => router.push('/admin/products'), 1000);
            } else {
                setStatus({ type: 'error', msg: `${t('msg.saveError')}: ${data.error}` });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: `${t('msg.networkError')}: ${err.message}` });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="w-full max-w-3xl mx-auto px-4 py-4 md:py-8">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon" className="min-w-[44px] min-h-[44px]">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-extrabold text-foreground">{t('admin.nav.addProduct')}</h1>
            </div>

            <Card className="p-6 md:p-8 shadow-sm">
                <form onSubmit={save}>
                    <div className="pb-6 mb-6 border-b border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">{t('form.productInfo')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.title')}</label>
                                <Input placeholder={t('form.titlePlaceholder')} value={form.title} onChange={(e) => onChange('title', e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.description')}</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                    placeholder={t('form.descriptionPlaceholder')}
                                    value={form.description}
                                    onChange={(e) => onChange('description', e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.platform')}</label>
                                <Select value={form.platform} onValueChange={(v) => onChange('platform', v)}>
                                    <SelectTrigger><SelectValue placeholder={t('form.platformPlaceholder')} /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Shopee">Shopee</SelectItem>
                                        <SelectItem value="Lazada">Lazada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.category')}</label>
                                <CategoryCombobox
                                    value={form.category}
                                    onValueChange={(v) => onChange('category', v)}
                                    categories={categories}
                                    placeholder={t('form.categoryPlaceholder')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pb-6 mb-6 border-b border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">{t('form.pricing')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.price')}</label>
                                <Input type="number" min="0" value={form.price} onChange={(e) => onChange('price', Number(e.target.value))} required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.oldPrice')}</label>
                                <Input type="number" min="0" value={form.oldPrice} onChange={(e) => onChange('oldPrice', Number(e.target.value))} />
                            </div>
                        </div>
                    </div>

                    <div className="pb-6 mb-6 border-b border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">{t('form.links')}</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.imageUrl')}</label>
                                <Input type="url" placeholder="https://images.example.com/item.jpg" value={form.imageUrl} onChange={(e) => onChange('imageUrl', e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.affiliateUrl')}</label>
                                <Input type="url" placeholder="https://shope.ee/..." value={form.affiliateUrl} onChange={(e) => onChange('affiliateUrl', e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="pb-6 mb-6">
                        <h2 className="text-lg font-bold text-foreground mb-4">{t('form.status')}</h2>
                        <Select value={form.status} onValueChange={(v) => onChange('status', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">{t('status.active')}</SelectItem>
                                <SelectItem value="need_recheck">{t('status.need_recheck')}</SelectItem>
                                <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                                <SelectItem value="low_confidence">{t('status.low_confidence')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-6 border-t border-border gap-4">
                        <div className="w-full sm:flex-1">
                            {status.msg && (
                                <div className={`px-4 py-3 rounded-md font-medium text-sm min-h-[44px] flex items-center ${status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                                    {status.msg}
                                </div>
                            )}
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-w-[150px] min-h-[44px] font-semibold bg-gradient-to-br from-primary to-accent shadow-md">
                            {isSubmitting ? t('action.saving') : t('form.submit')}
                        </Button>
                    </div>
                </form>
            </Card>
        </main>
    );
}
