import type { Metadata } from 'next';
import { Inter, Tajawal } from 'next/font/google';
import LanguageToggle from '../../components/LanguageToggle';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '500', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: 'AIStore AI Commerce',
  description: 'Neutral commerce discovery for Saudi Arabia',
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? tajawal.className : inter.className;

  return (
    <html lang={locale} dir={dir}>
      <body className={`${fontClass} bg-gray-50 text-gray-900`}>
        <header className="flex items-center justify-between p-4 md:px-8 border-b border-gray-200 bg-white">
          <div className="font-bold text-xl">AIStore</div>
          <LanguageToggle />
        </header>
        <main className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}