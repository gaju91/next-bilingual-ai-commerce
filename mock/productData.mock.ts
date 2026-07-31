export default async function getProducts(locale: 'en' | 'ar') {
    const mockDatabase = [
        {
            id: '1',
            title: {
                en: 'Sony Alpha a7 IV Mirrorless Camera',
                ar: 'كاميرا سوني ألفا a7 IV بدون مرآة'
            },
            price: 9499,
            imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
            inStock: true,
        },
        {
            id: '2',
            title: {
                en: 'Apple MacBook Pro M3 Max 16"',
                ar: 'أبل ماك بوك برو M3 ماكس 16 بوصة'
            },
            price: 15999,
            imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
            inStock: false,
        },
        {
            id: '3',
            title: {
                en: 'Sony WH-1000XM5 Noise Cancelling Headphones',
                ar: 'سماعات سوني WH-1000XM5 عازلة للضوضاء'
            },
            price: 1499,
            imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
            inStock: true,
        }
    ];

    return mockDatabase.map((product) => ({
        id: product.id,
        title: product.title[locale],
        price: product.price,
        imageUrl: product.imageUrl,
        inStock: product.inStock,
    }));
}