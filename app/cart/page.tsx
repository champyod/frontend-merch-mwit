"use client";

import { useCart } from "@/context/CartContext";
import PreorderForm from "@/components/preorder/PreorderForm";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/types/types";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-secondary pt-32 p-10 flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-20 h-20 text-slate-700 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Your cart is empty</h1>
        <p className="text-slate-400 mb-8">Add some awesome merch to get started!</p>
        <Link href="/" className="px-8 py-3 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-600 transition-all">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-32 pb-20 px-4 md:px-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/" className="p-2 text-slate-400 hover:text-white transition-all bg-white/5 rounded-full">
           <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-4xl font-bold text-white">Shopping Cart</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: CartItem, index: number) => (
            <LiquidCard key={`${item.item_id}-${item.size}-${item.color}-${index}`} className="p-4 flex gap-4 items-center">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-lg object-cover bg-white/5" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center">
                   <ShoppingBag className="w-8 h-8 text-slate-700" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">
                  {item.color} {item.size ? `| Size: ${item.size}` : ""}
                </p>
                <div className="flex items-center gap-4 mt-1">
                   <p className="text-emerald-500 font-bold">฿{item.price.toLocaleString()}</p>
                   <p className="text-slate-500 text-sm">Qty: {item.quantity}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(index)}
                className="p-2 text-slate-500 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-full"
                title="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </LiquidCard>
          ))}
          
          <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
             <div className="flex justify-between items-center text-xl font-bold text-white">
                <span>Subtotal</span>
                <span className="text-emerald-500">฿{subtotal.toLocaleString()}</span>
             </div>
             <p className="text-slate-400 text-sm mt-1">Shipping and total will be calculated in the checkout form.</p>
          </div>
        </div>

        <div className="lg:col-span-1">
           <LiquidCard className="p-6 sticky top-32">
              <PreorderForm />
           </LiquidCard>
        </div>
      </div>
    </div>
  );
}