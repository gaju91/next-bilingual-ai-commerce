import { getDictionary } from '../../dictionaries';
import ProductCard from '../../components/ProductCard';
import getProducts from '@/mock/productData.mock';

// Simulated Server-Side Data Fetch

export default async function HomePage({
    params
}: {
    params: Promise<{ locale: 'en' | 'ar' }>
}) {
    const resolvedParams = await params;
    const locale = resolvedParams.locale;

    const [dict, products] = await Promise.all([
        getDictionary(locale),
        getProducts(locale),
    ]);

    return (
        <div className="flex flex-col gap-12">
            {/* Hero Section */}
            <section className="text-start max-w-2xl pt-8">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                    {dict.hero.title}
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                    {dict.hero.subtitle}
                </p>
            </section>

            {/* Product Grid */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-start">
                    {locale === 'en' ? 'Trending Electronics' : 'إلكترونيات شائعة'}
                </h2>
                {/* CSS Grid for responsive layouts */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            dict={dict.product}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}