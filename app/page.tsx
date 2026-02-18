import ItemCard from "@/components/ui/ItemCard";
import { Item, Site } from "@/types/types";
import { BRAND_NAME } from "./config";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { LiquidCard } from "@/components/ui/LiquidCard";

export default async function Home() {
	const items = await getItems();
	const site = await getSite();
	const backgroundImageUrl = site?.image_url || "/images/hero.webp";

	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
				<div 
					className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
					style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
				>
					<div className="absolute inset-0 bg-[#0a2735]/60 backdrop-blur-[2px]"></div>
				</div>

				<div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-8">
					<div className="space-y-4">
						<h2 className="text-[#58a076] font-bold tracking-[0.2em] uppercase text-sm md:text-base">
							Welcome to
						</h2>
						<h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl">
							{BRAND_NAME}
						</h1>
					</div>

					<p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
						Explore our exclusive collection of school merchandise designed for the MWIT community.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
						<a href="#products">
							<LiquidButton variant="primary" size="lg" className="gap-2">
								<ShoppingBag className="w-5 h-5" />
								SHOP NOW
							</LiquidButton>
						</a>
						<a href="/pre-orders">
							<LiquidButton variant="secondary" size="lg">
								View Pre-orders
							</LiquidButton>
						</a>
					</div>
				</div>

				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
					<span className="text-white text-[10px] uppercase tracking-widest font-bold">Scroll</span>
					<ChevronDown className="w-4 h-4 text-white" />
				</div>
			</section>

			{/* Products Section */}
			<section id="products" className="container mx-auto px-4 py-32">
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<div className="w-8 h-[2px] bg-[#58a076]"></div>
							<span className="text-[#58a076] font-black uppercase tracking-widest text-xs">Collection</span>
						</div>
						<h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
							NEW ARRIVALS
						</h2>
					</div>
					<p className="text-white/40 max-w-xs text-sm font-medium">
						Quality materials and unique designs crafted for excellence.
					</p>
				</div>

				{items && items.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{items.map((item, index) => (
							<ItemCard key={index} item={item} />
						))}
					</div>
				) : (
					<LiquidCard variant="glass" className="py-20 text-center">
						<p className="text-white/60 font-bold text-xl">No products found.</p>
					</LiquidCard>
				)}
			</section>
		</main>
	);
}

type GetItemsResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: null | Item[];
};
async function getItems() {
	try {
		const res = await fetch(`${process.env.API_URL}/api/brand/all`, {
			next: {
				revalidate: 0,
			},
		});
		if (!res.ok) throw new Error("Failed to fetch data");

		const data: GetItemsResponse = await res.json();
		if (data.hasError) throw new Error(data.errorMessage);
		return data.payload;
	} catch (error) {
		return null;
	}
}

type GetSiteResponse = {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: Site;
};
async function getSite() {
	try {
		const res = await fetch(`${process.env.API_URL}/api/site`, {
			next: {
				revalidate: 0,
			},
		});
		if (!res.ok) throw new Error("Failed to fetch data");
		const data: GetSiteResponse = await res.json();
		if (data.hasError) throw new Error(data.errorMessage);
		return data.payload;
	} catch (error) {
		return null;
	}
}
