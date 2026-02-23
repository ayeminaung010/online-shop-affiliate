'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = getSupabaseBrowser();
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(t('auth.error') + ': ' + authError.message);
                return;
            }

            router.push('/admin');
        } catch (err) {
            setError(t('msg.networkError') + ': ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-background">
            <Card className="w-full max-w-md p-8 shadow-lg">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-foreground">{t('admin.title')}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{t('auth.admin_only')}</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-muted-foreground">{t('auth.email')}</label>
                        <Input
                            type="email"
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-muted-foreground">{t('auth.password')}</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="px-4 py-3 rounded-md text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 font-semibold bg-gradient-to-br from-primary to-accent hover:opacity-95 shadow-md text-base"
                    >
                        {loading ? t('auth.logging_in') : t('auth.login')}
                    </Button>
                </form>
            </Card>
        </main>
    );
}
