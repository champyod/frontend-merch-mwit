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
import { IBM_Plex_Sans_Thai, Noto_Sans_Thai, Inter, Sarabun, Mitr, Itim } from 'next/font/google';
import '../globals.css';

const ibmPlexThai = IBM_Plex_Sans_Thai({
    variable: "--font-ibm-plex-sans-thai",
    subsets: ["thai", "latin"],
    weight: ["400", "500", "600", "700"],
});

const notoThai = Noto_Sans_Thai({
    variable: "--font-noto-sans-thai",
    subsets: ["thai", "latin"],
    weight: ["400", "500", "600", "700"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const sarabun = Sarabun({
    variable: "--font-krub",
    subsets: ["thai", "latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const mitr = Mitr({
    variable: "--font-mitr",
    subsets: ["thai", "latin"],
    weight: ["400", "500", "600"],
});

const itim = Itim({
    variable: "--font-itim",
    subsets: ["thai", "latin"],
    weight: ["400"],
});

const SUPPORTED_LOCALES = [Locales.ENGLISH, Locales.THAI];

export { generateStaticParams } from 'next-intlayer';

export default async function LocaleLayout({ 
    children, 
    params 
}: { 
    children: React.ReactNode; 
    params: Promise<{ locale: string }>;
}) {
    const resolvedParams = await params;
    const locale = resolvedParams?.locale;

    if (!locale || !SUPPORTED_LOCALES.includes(locale as any)) {
        notFound();
    }

    return (
        <IntlayerServerProvider locale={locale}>
            <html lang={locale} dir={getHTMLTextDir(locale as any)} suppressHydrationWarning={true}>
                <head>
                    <Script src="/__env.js" strategy="beforeInteractive" />
                    <Analytics />
                </head>
                <body 
                    className={`${ibmPlexThai.variable} ${notoThai.variable} ${inter.variable} ${sarabun.variable} ${mitr.variable} ${itim.variable} font-default antialiased`}
                >
                    <IntlayerClientProvider locale={locale as any}>
                        <Providers>
                            <HeaderBar />
                            <main>{children}</main>
                            <Footer siteName={BRAND_NAME} />
                        </Providers>
                    </IntlayerClientProvider>
                </body>
            </html>
        </IntlayerServerProvider>
    );
}
