import { BRAND_SOCIALS } from "@/app/config";
import Link from "next/link";
import Logo from "../Logo";

export default function Footer({ brandName }: { brandName: string }) {
	return (
		<footer className="bg-[#0a2735] border-t border-white/5 pt-20 pb-10 px-6">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
					<div className="col-span-1 md:col-span-2 space-y-6">
						<Logo />
						<p className="text-white/50 max-w-sm font-medium leading-relaxed text-sm">
							The official merchandise platform for Mahidol Wittayanusorn School. 
							Crafted with excellence for our community.
						</p>
						<div className="flex items-center gap-4">
							<a
								href={BRAND_SOCIALS.facebook}
								target="_blank"
								rel="noreferrer"
								className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#58a076] hover:text-white transition-all"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
									<path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"/>
								</svg>
							</a>
							<a
								href={BRAND_SOCIALS.instagram}
								target="_blank"
								rel="noreferrer"
								className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#58a076] hover:text-white transition-all"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
								</svg>
							</a>
						</div>
					</div>

					<div className="space-y-6">
						<h3 className="text-white font-black uppercase tracking-widest text-xs">Navigation</h3>
						<ul className="space-y-4">
							<li><Link href="/" className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">Home</Link></li>
							<li><Link href="/pre-orders" className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">Pre-orders</Link></li>
							<li><Link href="/cart" className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">Shopping Cart</Link></li>
						</ul>
					</div>

					<div className="space-y-6">
						<h3 className="text-white font-black uppercase tracking-widest text-xs">Support</h3>
						<ul className="space-y-4">
							<li><Link href="/privacy-policy" className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">Privacy Policy</Link></li>
							<li><Link href="/refund-policy" className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">Refund Policy</Link></li>
							<li><Link href="/shipping-policy" className="text-white/50 hover:text-[#58a076] transition-colors text-sm font-bold">Shipping Policy</Link></li>
						</ul>
					</div>
				</div>

				<div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-white/30 text-xs font-bold uppercase tracking-tighter">
						© {new Date().getFullYear()} {brandName}. ALL RIGHTS RESERVED.
					</p>
					<p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
						Designed for MWIT Community
					</p>
				</div>
			</div>
		</footer>
	);
}