/**
 * Myanmar (my) Translation Map
 *
 * HOW TO ADD A NEW LANGUAGE:
 *  1. Copy this file → lib/i18n/th.ts (or en.ts)
 *  2. Replace all values with the new language strings
 *  3. Update the `t()` import in your components
 *
 * HOW TO ADD A NEW KEY:
 *  - Add the key below with its Myanmar text
 *  - Use `t('your.new.key')` in components
 */

const my = {
    // ── App ──
    'app.title': 'MM-TH Deals',
    'app.copyright': '© {year} MM-TH Deals. မူပိုင်ခွင့်များအားလုံး ရယူထားသည်။',

    // ── Hero ──
    'hero.trust': 'စစ်ဆေးပြီးသော Affiliate လင့်ခ်များ',
    'hero.title': 'MM-TH Deals',
    'hero.subtitle': 'ထိုင်းနိုင်ငံရောက် မြန်မာများအတွက် သီးသန့်ရွေးချယ်ထားသော ထိုင်းထိပ်တန်း e-commerce ပလက်ဖောင်းများမှ အကောင်းဆုံး deals များ။',

    // ── Filters ──
    'filter.all': 'အားလုံး',
    'filter.shopee': 'Shopee Deals',
    'filter.lazada': 'Lazada Deals',
    'filter.under100': '฿100 အောက်',
    'filter.under300': '฿300 အောက်',

    // ── Top Deals Banner ──
    'banner.title': 'ဒီနေ့ရဲ့ အထူးစျေးနှုန်းများ',
    'banner.subtitle': 'အကောင်းဆုံးတန်ဖိုးရရှိစေရန် နှစ်သက်ဖွယ်ရွေးချယ်ထားသော ပရိုမိုးရှင်းများ။',

    // ── Product Card ──
    'product.buyOn': '{platform} တွင်ဝယ်မည်',
    'product.noImage': 'ပုံမရှိပါ',

    // ── Product Status ──
    'status.active': 'ရောင်းချနေ',
    'status.need_recheck': 'ပြန်စစ်ရန်လို',
    'status.inactive': 'မရရှိနိုင်တော့',
    'status.low_confidence': 'အချက်အလက်မသေချာ',

    // ── Footer / Disclaimer ──
    'footer.title': 'ပူးပေါင်းဆောင်ရွက်မှုနှင့် ထုတ်ပြန်ချက်',
    'footer.affiliate': 'ဤပလက်ဖောင်းသည် affiliate deals များကို စုစည်းပေးထားပါသည်။ ဤလင့်ခ်များမှတစ်ဆင့် သင့်အတွက် အပိုကုန်ကျစရိတ်မရှိဘဲ ဝယ်ယူနိုင်ပါသည်။',
    'disclaimer.price': '⚠️ စျေးနှုန်းနှင့် လက်ကျန်ပစ္စည်းများ အချိန်မရွေး ပြောင်းလဲနိုင်ပါသည်။',
    'disclaimer.delivery': '🚚 ထိုင်းနိုင်ငံအတွင်းသာ ပို့ဆောင်ပေးပါသည်။',
    'disclaimer.reshipping': '❌ မြန်မာနိုင်ငံသို့ ပြန်ပို့ဆောင်ခြင်း (Reshipping) ဝန်ဆောင်မှု မပါဝင်ပါ။',

    // ── Admin: Auth ──
    'auth.title': 'Admin Login',
    'auth.email': 'အီးမေးလ်',
    'auth.password': 'စကားဝှက်',
    'auth.login': 'ဝင်ရောက်မည်',
    'auth.logging_in': 'ဝင်ရောက်နေသည်...',
    'auth.error': 'ဝင်ရောက်ခြင်း မအောင်မြင်ပါ',
    'auth.logout': 'ထွက်မည်',
    'auth.admin_only': 'တာဝန်ရှိသူများသာ',

    // ── Admin: Dashboard ──
    'admin.title': 'Deals ထိန်းချုပ်မှုစနစ်',
    'admin.stats.totalDeals': 'စုစုပေါင်း Deals',
    'admin.stats.activeDeals': 'ရောင်းချနေသော Deals',
    'admin.stats.needRecheck': 'ပြန်စစ်ရန်လိုသော',
    'admin.stats.todayEstimate': 'ယနေ့ ခန့်မှန်းရောင်းချရမှု',
    'admin.nav.products': 'ထုတ်ကုန်စီမံခန့်ခွဲမှု',
    'admin.nav.addProduct': 'Deal အသစ်တင်မည်',
    'admin.nav.dashboard': 'Dashboard',

    // ── Admin: Product List ──
    'products.title': 'ထုတ်ကုန်များ',
    'products.search': 'ထုတ်ကုန်အမည်ဖြင့် ရှာဖွေမည်...',
    'products.noResults': 'ထုတ်ကုန် ရှာမတွေ့ပါ',
    'products.selectAll': 'အားလုံးရွေးမည်',
    'products.selected': 'ရွေးထားသည် {count} ခု',
    'products.lastChecked': 'နောက်ဆုံးစစ်ဆေးချိန်',
    'products.lastUpdated': 'နောက်ဆုံးပြင်ဆင်ချိန်',
    'products.staleWarning': '⚠️ ၂၄ နာရီကျော် စစ်ဆေးခြင်းမရှိသေးပါ',
    'products.page': 'စာမျက်နှာ {current} / {total}',
    'products.prev': 'ရှေ့သို့',
    'products.next': 'နောက်သို့',

    // ── Admin: Bulk Actions ──
    'bulk.markActive': 'ရောင်းချနေဟု သတ်မှတ်မည်',
    'bulk.markRecheck': 'ပြန်စစ်ရန် သတ်မှတ်မည်',
    'bulk.markInactive': 'မရှိတော့ဟု သတ်မှတ်မည်',
    'bulk.delete': 'ဖျက်မည်',

    // ── Admin: Single Actions ──
    'action.edit': 'ပြင်ဆင်မည်',
    'action.delete': 'ဖျက်မည်',
    'action.markInactive': 'မရှိတော့',
    'action.save': 'သိမ်းဆည်းမည်',
    'action.saving': 'သိမ်းဆည်းနေပါသည်...',
    'action.cancel': 'မလုပ်တော့ပါ',
    'action.confirm_delete': 'ဤထုတ်ကုန်ကို ဖျက်ရန် သေချာပါသလား?',

    // ── Admin: Form ──
    'form.productInfo': 'ထုတ်ကုန် အချက်အလက်',
    'form.title': 'ခေါင်းစဉ် / Deal အမည်',
    'form.titlePlaceholder': 'ထုတ်ကုန် အမည်ကို ထည့်ပါ',
    'form.platform': 'E-commerce ပလက်ဖောင်း',
    'form.platformPlaceholder': 'ပလက်ဖောင်းရွေးပါ',
    'form.category': 'အမျိုးအစား (Category)',
    'form.categoryPlaceholder': 'ဥပမာ- Electronics, Fashion',
    'form.pricing': 'စျေးနှုန်းနှင့် တန်ဖိုး',
    'form.price': 'လက်ရှိ ရောင်းဈေး (฿)',
    'form.oldPrice': 'မူလစျေးနှုန်း (฿)',
    'form.links': 'ပုံနှင့် ပြင်ပလင့်ခ်များ',
    'form.imageUrl': 'ထုတ်ကုန်ပုံ (Image URL)',
    'form.affiliateUrl': 'Affiliate လင့်ခ် (Tracking URL)',
    'form.status': 'အခြေအနေ',
    'form.submit': 'Deal တင်မည်',

    // ── Messages ──
    'msg.saveSuccess': 'အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ ✅',
    'msg.saveError': 'သိမ်းဆည်းရာတွင် အမှားအယွင်းရှိပါသည်',
    'msg.deleteSuccess': 'အောင်မြင်စွာ ဖျက်ပြီးပါပြီ',
    'msg.networkError': 'ကွန်ရက်အမှား',
};

/**
 * Get translated string by key.
 * Supports {variable} interpolation: t('product.buyOn', { platform: 'Shopee' })
 * @param {string} key
 * @param {Record<string, string|number>} [vars]
 * @returns {string}
 */
export function t(key, vars) {
    let str = my[key] || key;
    if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
            str = str.replace(`{${k}}`, String(v));
        });
    }
    return str;
}

export default my;
