'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageToggle() {
    const pathname = usePathname();

    const currentLocale = pathname?.split('/')[1] === 'en' ? 'en' : 'ar';

    const targetLocale = currentLocale === 'en' ? 'ar' : 'en';

    const getTargetUrl = () => {
        if (!pathname) return `/${targetLocale}`;
        const segments = pathname.split('/');
        segments[1] = targetLocale;
        return segments.join('/');
    };

    return (
        <Link
            href={getTargetUrl()}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
        >
            {currentLocale === 'en' ? 'العربية' : 'English'}
        </Link>
    );
}