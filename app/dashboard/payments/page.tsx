"use client";

import { useState, useEffect } from "react";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { CreditCard, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Toaster, toast } from "sonner";

interface PaymentAccount {
  id: number;
  name: string;
  promptpay_id: string;
}

export default function AdminPaymentsPage() {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsCreating] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [ppId, setPpId] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/payment-accounts`, {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/payment-accounts`, {
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
    if (!confirm("Are you sure? Products linked to this will lose their payment ID.")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/payment-accounts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      fetchAccounts();
      toast.success("Deleted");
    } catch (e) { toast.error("Delete failed"); }
  };

  return (
    <div className="p-6 space-y-8">
      <Toaster richColors />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Payment Management</h1>
        <p className="text-slate-400">Configure multiple PromptPay accounts for different products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <LiquidCard className="p-6 h-fit border-emerald-500/20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-500" /> Add New Account
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Account Name (Internal)</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Science Club Shirt Fund"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">PromptPay ID</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={ppId} onChange={e => setPpId(e.target.value)}
                placeholder="08xxxxxxxx or Tax ID"
              />
            </div>
            <LiquidButton className="w-full" onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Account"}
            </LiquidButton>
          </div>
        </LiquidCard>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>
          ) : accounts.length === 0 ? (
            <div className="text-center p-20 bg-white/5 rounded-2xl border border-white/10">
              <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">No payment accounts defined yet.</p>
            </div>
          ) : (
            accounts.map(acc => (
              <LiquidCard key={acc.id} className="p-5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{acc.name}</div>
                    <div className="text-sm text-emerald-500 font-mono">{acc.promptpay_id}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(acc.id)}
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </LiquidCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
