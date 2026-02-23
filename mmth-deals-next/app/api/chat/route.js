import { readProducts } from '@/lib/store';

// Helper to extract a max price from text (e.g., "under 300", "< 300", "below 300")
function extractMaxPrice(text) {
    const match = text.match(/(?:under|below|<|max)\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : null;
}

// Helper to clean up query by removing the price intent
function cleanQuery(text) {
    return text.replace(/(?:under|below|<|max)\s*\d+/i, '').trim();
}

export async function POST(request) {
    try {
        const { message } = await request.json();
        if (!message || typeof message !== 'string') {
            return Response.json({ text: "Please tell me what you're looking for! For example: 'sunscreen under 300'" }, { status: 400 });
        }

        const maxPrice = extractMaxPrice(message);
        const q = cleanQuery(message);

        // Call store.js function. Limit to 5 results for chat brevity.
        const result = await readProducts({ q, maxPrice: maxPrice || '', page: 1, pageSize: 5 });
        const products = result.products || [];

        // Format response
        let responseText = '';

        if (products.length === 0) {
            responseText = `I couldn't find any products matching "${message}". Try searching for something else!`;
        } else {
            const summary = maxPrice
                ? `Here are the top deals for "${q || 'products'}" under ฿${maxPrice}:`
                : `Here are the top deals I found for "${q}":`;

            const list = products.map(p => {
                const platformIcon = p.platform === 'Shopee' ? '🟠' : '🔵';
                const priceStr = `฿${p.price.toLocaleString()}`;
                // Create an active markdown-style link using standard HTML since we'll render it safely or via a markdown component. 
                // For simplicity, we'll return an array of objects to let the client render rich UI, 
                // or a formatted string if we want pure text. Let's return both so the client can choose.
                return `- ${platformIcon} [${p.title}](/products/${p.id}) — **${priceStr}**`;
            }).join('\n');

            responseText = `${summary}\n\n${list}`;
        }

        return Response.json({
            text: responseText,
            products: products
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return Response.json({ text: "Sorry, I'm having trouble searching right now." }, { status: 500 });
    }
}
