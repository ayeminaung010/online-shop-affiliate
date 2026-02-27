import { getSupabase } from '@/lib/supabase';
import CopyButton from './CopyButton';
import Image from 'next/image';

export default async function OpenInBrowserPage({ searchParams }) {
    const id = searchParams?.id;
    let platform = 'Lazada/Shopee';

    if (id) {
        const supabase = getSupabase();
        const { data: product } = await supabase
            .from('products')
            .select('platform')
            .eq('id', id)
            .in('status', ['active', 'need_recheck'])
            .single();

        if (product?.platform) {
            platform = product.platform;
        }
    }

    return (
        <div className="min-h-[100dvh] bg-[#0f1014] text-white flex flex-col items-center pt-16 px-6 relative overflow-hidden font-sans">
            {/* Bouncing Arrow Pointing Top-Right */}
            <div className="absolute top-6 right-6 text-6xl animate-bounce text-pink-500 z-10 drop-shadow-lg" style={{ animationDuration: '1s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-45">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </div>

            {/* Logo */}
            <div className="mb-6 z-20">
                <Image src="/brand/vantagemm-logo.jpg" alt="VantageMM" width={80} height={80} className="rounded-2xl shadow-xl border border-gray-800" priority />
            </div>

            {/* Main Content Card */}
            <div className="bg-[#1c1d24] border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl relative z-20 text-center">

                {/* Visual Icon showing the 3 dots */}
                <div className="mx-auto w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-700 shadow-inner">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Action Required
                </h1>

                <p className="text-gray-300 text-[17px] leading-relaxed mb-8">
                    <strong className="text-white font-bold">TikTok Browser ဖြင့် ဝင်ရောက်နေပါသည်။</strong><br />
                    {platform} App ဖြင့် တိုက်ရိုက်ကြည့်ရှုရန် အပေါ်က အစက် ၃ စက် (...) ကိုနှိပ်ပြီး Open in Browser ကို ရွေးချယ်ပေးပါ
                </p>

                {/* Visual Step by Step */}
                <div className="bg-gray-800/50 p-4 rounded-xl text-left border border-gray-700/50 mb-8">
                    <ul className="space-y-4 text-sm text-gray-300">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-xs mt-0.5">1</span>
                            <span>ညာဘက်အပေါ်ထောင့်က <strong className="text-white font-bold">အစက် ၃ စက် (...)</strong> ကို နှိပ်ပါ</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                            <span><strong className="text-white font-bold">"Open in Browser"</strong> ကို ရွေးပါ</span>
                        </li>
                    </ul>
                </div>

                <CopyButton />
            </div>

            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
}

export const metadata = {
    title: 'Open in Browser - VantageMM',
    robots: {
        index: false,
        follow: false,
    }
};
