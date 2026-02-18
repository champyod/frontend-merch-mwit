"use client";

import { useState, useEffect } from "react";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { CreditCard, Plus, Trash2, Loader2, AlertCircle, TrendingUp, ShoppingBag, DollarSign } from "lucide-react";
import { Toaster, toast } from "sonner";
import { API_BASE_URL } from "@/lib/env";

interface PaymentAccount {
  id: number;
  name: string;
  promptpay_id: string;
  total_orders: number;
  total_revenue: number;
}

export default function AdminPaymentsPage() {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsCreating] = useState(false);
  
  const [name, setName] = useState("");
  const [ppId, setPpId] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payment-accounts`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setAccounts(data || []);
    } catch (e) {
      toast.error("Failed to load accounts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleCreate = async () => {
    if (!name || !ppId) return toast.error("Please fill all fields");
    setIsCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payment-accounts`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ name, promptpay_id: ppId })
      });
      if (res.ok) {
        toast.success("Account added");
        setName(""); setPpId("");
        fetchAccounts();
      }
    } catch (e) {
      toast.error("Error creating account");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/admin/payment-accounts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      fetchAccounts();
      toast.success("Deleted");
    } catch (e) { toast.error("Delete failed"); }
  };

  return (
    <div className="p-6 space-y-8 pb-20">
      <Toaster richColors />
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Payment Accounts & Analytics</h1>
          <p className="text-slate-400">Manage PromptPay IDs and track revenue per account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <LiquidCard className="p-6 h-fit border-emerald-500/20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <Plus className="w-5 h-5 text-emerald-500" /> New Payment Method
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Account Name (e.g. Science Club)</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Club or Committee Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">PromptPay ID</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={ppId} onChange={e => setPpId(e.target.value)}
                placeholder="08xxxxxxxx"
              />
            </div>
            <LiquidButton className="w-full" onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </LiquidButton>
          </div>
        </LiquidCard>

        {/* Analytics List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
          ) : accounts.length === 0 ? (
            <div className="text-center p-20 bg-white/5 rounded-2xl border border-white/10">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">No payment accounts configured.</p>
            </div>
          ) : (
            accounts.map(acc => (
              <LiquidCard key={acc.id} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xl">{acc.name}</div>
                      <div className="text-sm text-emerald-500 font-mono tracking-wider">{acc.promptpay_id}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(acc.id)}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <ShoppingBag className="w-3 h-3" /> Total Orders
                    </div>
                    <div className="text-2xl font-bold text-white">{acc.total_orders.toLocaleString()}</div>
                  </div>
                  <div className="bg-emerald-500/[0.03] rounded-2xl p-4 border border-emerald-500/10">
                    <div className="flex items-center gap-2 text-emerald-500/60 text-xs font-bold uppercase tracking-wider mb-1">
                      <TrendingUp className="w-3 h-3" /> Total Revenue
                    </div>
                    <div className="text-2xl font-bold text-emerald-500">
                      <span className="text-sm mr-1 opacity-60">฿</span>
                      {acc.total_revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </LiquidCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}