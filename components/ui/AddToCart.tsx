"use client";

import { ColorSize, Item } from "@/types/types";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { LiquidButton } from "./LiquidButton";
import { toast, Toaster } from "sonner";
import { ShoppingCart, Check } from "lucide-react";

export default function AddToCart({
  item,
}: {
  item: Item;
}) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ColorSize | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a size/color variant");
      return;
    }

    addToCart({
      item_id: item.id || item.ID || 0,
      title: item.title,
      price: item.price,
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity: 1,
      image_url: item.images?.[0]?.url,
    });

    setIsAdded(true);
    toast.success("Added to cart!");
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Toaster richColors />
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Choose Size & Color</label>
        <div className="flex flex-wrap gap-2">
          {item.color_size_arr?.map((variant, i) => (
            <button
              key={i}
              onClick={() => setSelectedVariant(variant)}
              className={`px-4 py-2 rounded-xl border-2 transition-all ${
                selectedVariant === variant
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
              }`}
            >
              {variant.color} {variant.size ? `- ${variant.size}` : ""}
            </button>
          ))}
        </div>
      </div>

      <LiquidButton 
        className="w-full" 
        onClick={handleAddToCart}
        disabled={isAdded}
      >
        {isAdded ? (
          <><Check className="w-4 h-4 mr-2" /> Added</>
        ) : (
          <><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart</>
        )}
      </LiquidButton>
    </div>
  );
}
