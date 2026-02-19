import { notFound } from 'next/navigation';
import { IntlayerClientProvider } from 'next-intlayer';
import { IntlayerServerProvider } from 'next-intlayer/server';
import { Locales, getHTMLTextDir } from 'intlayer';
import HeaderBar from '@/components/ui/HeaderBar';
import Footer from '@/components/ui/Footer';
import Analytics from '@/components/Analytics';
import { BRAND_NAME } from "@/config";
import Script from 'next/script';
import Providers from '@/components/Providers';

const SUPPORTED_LOCALES = [Locales.ENGLISH, Locales.THAI];

export { generateStaticParams } from 'next-intlayer';

export default async function LocaleLayout({ 
    children, 
    params 
}: { 
    children: React.ReactNode; 
    params: { locale: string };
}) {
    const { locale } = params;

    if (!SUPPORTED_LOCALES.includes(locale as any)) {
        notFound();
    }

    return (
        <IntlayerServerProvider locale={locale}>
            <html lang={locale} dir={getHTMLTextDir(locale as any)} suppressHydrationWarning>
                <head>
                    <Script src="/__env.js" strategy="beforeInteractive" />
                    <Analytics />
                </head>
                <body suppressHydrationWarning>
                    <IntlayerClientProvider locale={locale as any}>
                        <Providers>
                            <HeaderBar />
                            {children}
                            <Footer brandName={BRAND_NAME} />
                        </Providers>
                    </IntlayerClientProvider>
                </body>
            </html>
        </IntlayerServerProvider>
    );
}
