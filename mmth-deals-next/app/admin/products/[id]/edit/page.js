'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n/my';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;
    const [token, setToken] = useState('');
    const [form, setForm] = useState(null);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const supabase = getSupabaseBrowser();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { router.push('/admin/login'); return; }
            setToken(session.access_token);
            loadProduct(session.access_token);
        });
    }, [router, productId]);

    async function loadProduct(tok) {
        try {
            const res = await fetch(`/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${tok}` },
            });
            if (res.ok) {
                const data = await res.json();
                setForm(data);
            }
        } catch { /* ignore */ }
    }

    const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    async function save(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
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

    if (!form) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </main>
        );
    }

    return (
        <main className="w-full max-w-3xl mx-auto px-4 py-4 md:py-8">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon" className="min-w-[44px] min-h-[44px]">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-extrabold text-foreground">{t('action.edit')}: {form.title}</h1>
            </div>

            <Card className="p-6 md:p-8 shadow-sm">
                <form onSubmit={save}>
                    <div className="pb-6 mb-6 border-b border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">{t('form.productInfo')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.title')}</label>
                                <Input value={form.title} onChange={(e) => onChange('title', e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.platform')}</label>
                                <Select value={form.platform} onValueChange={(v) => onChange('platform', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Shopee">Shopee</SelectItem>
                                        <SelectItem value="Lazada">Lazada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.category')}</label>
                                <Input value={form.category} onChange={(e) => onChange('category', e.target.value)} />
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
                                <Input type="url" value={form.imageUrl} onChange={(e) => onChange('imageUrl', e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">{t('form.affiliateUrl')}</label>
                                <Input type="url" value={form.affiliateUrl} onChange={(e) => onChange('affiliateUrl', e.target.value)} required />
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

                        {form.createdBy && (
                            <div className="mt-4 flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-muted-foreground">ဖန်တီးသူ (Created By)</label>
                                <div className="px-3 py-2 rounded-md bg-muted text-sm text-muted-foreground">{form.createdBy}</div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-6 border-t border-border gap-4">
                        <div className="w-full sm:flex-1">
                            {status.msg && (
                                <div className={`px-4 py-3 rounded-md font-medium text-sm min-h-[44px] flex items-center ${status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                                    {status.msg}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Link href="/admin/products">
                                <Button variant="outline" type="button" className="min-h-[44px]">{t('action.cancel')}</Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-initial min-w-[150px] min-h-[44px] font-semibold bg-gradient-to-br from-primary to-accent shadow-md">
                                {isSubmitting ? t('action.saving') : t('action.save')}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </main>
    );
}
