'use client';

import Image from 'next/image';
import { useState } from 'react';

type Product = {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    inStock: boolean;
};

type ProductDict = {
    aiSummary?: string;
    addToCart: string;
    outOfStock: string;
};

export default function ProductCard({
    product,
    dict
}: {
    product: Product;
    dict: ProductDict;
}) {
    // State to hold our streaming AI text and loading status
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const generateSummary = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setSummary('');

        try {
            const response = await fetch(`/api/stream?productId=${encodeURIComponent(product.title)}`);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                        try {
                            const data = JSON.parse(line.replace('data: ', ''));
                            const token = data.choices[0]?.delta?.content || '';
                            setSummary((prev) => prev + token);
                        } catch (_e) {
                            // Ignore incomplete chunks
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Failed to generate summary:', error);
            setSummary('⚠️ Unable to connect to AI server.Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {!product.inStock && (
                    <span className="absolute top-2 start-2 rounded bg-black px-2 py-1 text-xs font-semibold text-white">
                        {dict.outOfStock}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4 text-start">
                <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                <p className="mt-1 text-xl font-bold text-blue-600">{product.price} SAR</p>

                {/* Render the AI Summary Box if there is text to show */}
                {(summary || isLoading) && (
                    <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900 border border-blue-100 leading-relaxed">
                        {summary}
                        {/* Blinking cursor effect while loading */}
                        {isLoading && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-blue-600 animate-pulse"></span>}
                    </div>
                )}

                <div className="mt-auto pt-4 flex gap-2">
                    <button
                        disabled={!product.inStock}
                        className="flex-1 rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
                    >
                        {dict.addToCart}
                    </button>

                    {/* Wire up the onClick handler to our function */}
                    <button
                        onClick={generateSummary}
                        disabled={isLoading || summary.length > 0}
                        title={dict.aiSummary || "AI Summary"}
                        className="flex items-center justify-center rounded-lg border border-gray-200 p-2.5 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}