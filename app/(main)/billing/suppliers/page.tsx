"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Plus, DollarSign, Package, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function SupplierBillingPage() {
  const { suppliers, selectedDate, addSupplierExpense } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);

  // Modals
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseSupplierId, setExpenseSupplierId] = useState<string | null>(null);
  const [expenseData, setExpenseData] = useState({ amount: "", description: "" });

  // Filter suppliers who have purchases matching the selectedDate
  const isDateInRange = (dateStr: string, filterRange: string) => {
    const d = new Date(dateStr).toISOString().split('T')[0];
    if (filterRange.includes(' to ')) {
      const [start, end] = filterRange.split(' to ');
      return d >= start && d <= end;
    }
    return d === filterRange;
  };

  const todaySuppliers = suppliers.filter(s => {
    const hasTodayPurchase = s.purchases?.some(p => isDateInRange(p.date, selectedDate));
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return hasTodayPurchase && matchesSearch;
  });

  const totalTodayPurchases = todaySuppliers.reduce((sum, s) => {
    const todayPurchases = s.purchases?.filter(p => isDateInRange(p.date, selectedDate)) || [];
    return sum + todayPurchases.reduce((acc, p) => acc + p.totalAmount, 0);
  }, 0);

  const totalTodayExpense = todaySuppliers.reduce((sum, s) => {
    const todayExpenses = s.ledger?.filter(entry => entry.type === "Expense Entry" && isDateInRange(entry.date, selectedDate)) || [];
    return sum + todayExpenses.reduce((acc, entry) => acc + entry.expense, 0);
  }, 0);

  const handleExpenseSubmit = () => {
    const amt = parseFloat(expenseData.amount);
    if (!expenseSupplierId || !amt || isNaN(amt) || amt <= 0) return;

    addSupplierExpense(expenseSupplierId, amt, expenseData.description || "General Expense");
    setExpenseModalOpen(false);
    setExpenseData({ amount: "", description: "" });
    setExpenseSupplierId(null);
  };

  const openExpenseModal = (supplierId: string) => {
    setExpenseSupplierId(supplierId);
    setExpenseModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Today's Supplier Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">Review suppliers you purchased from and manage their daily freight/expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-sm px-3 py-1 font-bold">
            RS {totalTodayPurchases.toLocaleString()} Purchases Today
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-sm px-3 py-1 font-bold">
            RS {totalTodayExpense.toLocaleString()} Expense Today
          </Badge>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            type="text" 
            placeholder="Search active billing suppliers..." 
            className="pl-10 pr-4 bg-slate-50 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Billing List */}
      <div className="space-y-4">
        {todaySuppliers.length > 0 ? (
          todaySuppliers.map(supplier => {
            const todayPurchases = supplier.purchases?.filter(p => isDateInRange(p.date, selectedDate)) || [];
            const supplierTodayTotal = todayPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
            const isExpanded = expandedSupplier === supplier.id;

            return (
              <Card key={supplier.id} className="rounded-xl shadow-sm border-slate-200 overflow-hidden">
                <div 
                  className={`p-4 md:p-5 flex flex-col md:flex-row justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50 border-b border-slate-100' : ''}`}
                  onClick={() => setExpandedSupplier(isExpanded ? null : supplier.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-ocean-blue)]/10 text-[var(--color-ocean-blue)] flex items-center justify-center font-bold text-lg shrink-0">
                      {supplier.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        {supplier.name}
                        <Badge variant="secondary" className="bg-[var(--color-aqua)]/10 text-[var(--color-ocean-blue)] text-xs font-semibold">{todayPurchases.length} POs</Badge>
                      </h3>
                      <p className="text-sm text-slate-500">
                        {supplier.id} • {supplier.address ? `${supplier.address} • ` : ''}{supplier.phone || 'No phone'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium uppercase">Today's Total</p>
                      <p className="text-xl font-bold text-slate-900">RS {supplierTodayTotal.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-semibold h-9"
                        onClick={(e) => { e.stopPropagation(); openExpenseModal(supplier.id); }}
                      >
                        <Plus size={16} className="mr-1" /> Add Expense
                      </Button>
                      <button className="text-slate-400 p-1">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-white p-5 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                    <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm">
                      <Package size={16} className="text-slate-400" /> Purchase Breakdown
                    </h4>
                    
                    <div className="space-y-4">
                      {todayPurchases.map((p, idx) => (
                        <div key={p.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
                            <span className="font-semibold text-slate-800 text-sm">PO #{p.id}</span>
                            <span className="font-bold text-[var(--color-ocean-blue)]">RS {p.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {p.products.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-slate-600 truncate pr-2">{item.qty}x {item.name}</span>
                                <span className="font-medium text-slate-900">RS {(item.qty * item.costPrice).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Transactions Today</h3>
            <p className="text-slate-500">There are no supplier purchases recorded for the selected date range.</p>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <Dialog open={expenseModalOpen} onOpenChange={setExpenseModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Ledger Expense</DialogTitle>
            <DialogDescription>
              Record an expense (e.g. Freight charges, Labor) for this supplier. It will be added to their outstanding dues.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Expense Amount (RS)</label>
              <Input 
                type="number" 
                value={expenseData.amount} 
                onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})} 
                placeholder="0.00" 
                className="text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Bill / Item Details</label>
              <Input 
                type="text" 
                value={expenseData.description} 
                onChange={(e) => setExpenseData({...expenseData, description: e.target.value})} 
                placeholder="e.g. Items taken during active session" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpenseModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleExpenseSubmit}
              disabled={!expenseData.amount || parseFloat(expenseData.amount) <= 0}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              Apply Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
