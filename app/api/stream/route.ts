import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || 'unknown';

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        return NextResponse.json({ error: 'Server misconfiguration: Missing API Key' }, { status: 500 });
    }
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an e-commerce assistant. Summarize the product briefly in 15 words or less. Keep it engaging. If the user asks in Arabic, answer in Arabic.'
                    },
                    {
                        role: 'user',
                        content: `Give me a quick summary for this product name: ${productId}.`
                    }
                ],
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq Error:', errorText);
            throw new Error(`Groq API Error: ${response.status}`);
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Streaming error:', error);
        return NextResponse.json({ error: 'Failed to generate AI summary' }, { status: 500 });
    }
}