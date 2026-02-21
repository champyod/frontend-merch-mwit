import Link from 'next/link';

export default async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'th';
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center p-8 glass-panel rounded-3xl max-w-md mx-auto">
        <h1 className="text-6xl font-black text-[#58a076] mb-4">404</h1>
        <p className="text-white/70 text-lg mb-8">ขออภัย ไม่พบหน้าที่คุณต้องการ</p>
        <Link 
          href={`/${locale}`} 
          className="btn-primary inline-block"
        >
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </div>
  );
}
