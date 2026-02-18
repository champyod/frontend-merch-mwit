import { Item } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Tag } from "lucide-react";

interface Props {
	item: Item;
}

export default function ItemCard({ item }: Props) {
	const { id, title, price, url, discount, discount_type } = item;
	const href = "/shop/" + title.replaceAll(" ", "-") + "-" + id;

	const salePrice = !discount
		? 0
		: discount_type === "dollar"
		  ? price - discount
		  : price - (price * discount) / 100;

	return (
		<Link href={href} className="group relative block">
			<div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 transition-all duration-500 group-hover:border-[#58a076]/30 group-hover:shadow-[0_20px_50px_rgba(33,124,107,0.15)] group-hover:-translate-y-2">
				{/* Sale Badge */}
				{salePrice !== 0 && (
					<div className="absolute top-5 left-5 z-20 flex items-center gap-1.5 px-4 py-2 bg-[#ec848c] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
						<Tag className="w-3 h-3" />
						SALE
					</div>
				)}

				{/* Image */}
				<Image
					src={url || "/images/logo.webp"}
					alt={title}
					fill
					className="object-cover transition-transform duration-700 group-hover:scale-110"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>

				{/* Overlay Gradient */}
				<div className="absolute inset-0 bg-gradient-to-t from-[#0a2735] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

				{/* Bottom Info */}
				<div className="absolute bottom-0 inset-x-0 p-8 space-y-4">
					<h3 className="text-xl font-black text-white leading-tight transition-colors duration-300 group-hover:text-[#92c9c4]">
						{title}
					</h3>
					
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3 font-black">
							{salePrice !== 0 ? (
								<>
									<span className="text-2xl text-white">฿{salePrice.toLocaleString()}</span>
									<span className="text-sm text-white/40 line-through">฿{price.toLocaleString()}</span>
								</>
							) : (
								<span className="text-2xl text-white">฿{price.toLocaleString()}</span>
							)}
						</div>
						
						<div className="w-10 h-10 rounded-full bg-[#58a076] flex items-center justify-center text-white opacity-0 translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 shadow-lg shadow-[#58a076]/40">
							<ArrowUpRight className="w-5 h-5" />
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}