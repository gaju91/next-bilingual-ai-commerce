# Next.js Bilingual AI Commerce

A small English–Arabic storefront built to explore modern Next.js patterns: locale-based routing, right-to-left layouts, Server and Client Components, and streamed AI responses.

The application renders a localized product catalog at `/en` and `/ar`. Each product includes an AI action that streams a short summary from Groq through a Next.js Route Handler.

## What this project demonstrates

- Dynamic locale routes with the App Router
- Static generation of the English and Arabic pages
- Server-side dictionary and mock product loading
- LTR and RTL document direction through `lang` and `dir`
- Locale-specific fonts with `next/font`
- Direction-aware Tailwind CSS utilities
- Client-side locale switching with `usePathname`
- Streaming Groq responses through a Route Handler
- Incremental rendering of streamed text with the Web Streams API

## How it works

### Locale routing

The `[locale]` segment makes the selected language part of the URL:

```text
app/
└── [locale]/
    ├── layout.tsx
    └── page.tsx
```

`generateStaticParams` pre-renders both supported locales:

```ts
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
```

Requests without a locale prefix are rewritten to the default Arabic route by `proxy.ts`.

### Translation and RTL support

English and Arabic dictionaries live in `dictionaries/` and are loaded by the localized Server Component. The locale layout sets the document language, reading direction, and font:

```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

The interface uses direction-aware utilities such as `text-start` and `start-2`, allowing the same components to work in both directions.

### AI response streaming

The product card requests:

```text
GET /api/stream?productId=<product-title>
```

The Route Handler calls Groq using the `llama-3.1-8b-instant` model with streaming enabled. Its response body is forwarded to the browser as `text/event-stream`.

The `ProductCard` Client Component reads the response with `ReadableStreamDefaultReader` and `TextDecoder`, then appends each received text delta to React state.

## Project structure

```text
app/
├── [locale]/
│   ├── layout.tsx       # Locale metadata, direction, fonts, and shared UI
│   └── page.tsx         # Server-rendered localized storefront
└── api/stream/
    └── route.ts         # Groq streaming proxy
components/
├── LanguageToggle.tsx   # Client-side locale switcher
└── ProductCard.tsx      # Product UI and stream consumer
dictionaries/
├── ar.json
├── en.json
└── index.ts             # Server-only dictionary loader
mock/
└── productData.mock.ts  # Localized mock catalog
proxy.ts                 # Default-locale rewrite
```

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Groq API

## Run locally

### Prerequisites

- A current Node.js LTS release
- A Groq API key

### Setup

```bash
git clone git@github.com:gaju91/next-bilingual-ai-commerce.git
cd next-bilingual-ai-commerce
npm install
```

Create `.env.local`:

```env
GROQ_API_KEY=your_api_key
```

Start the development server:

```bash
npm run dev
```

Open:

- `http://localhost:3000/en`
- `http://localhost:3000/ar`

The catalog and language switching work without an API key. The AI summary action requires one.

## Validation

```bash
npm run lint
npm run build
```

## Current scope

This is a learning project rather than a complete commerce application. Product data is mocked, the cart button is presentational, and the AI endpoint does not yet include authentication, rate limiting, or persistent storage.
