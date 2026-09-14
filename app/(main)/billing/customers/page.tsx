"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Plus, DollarSign, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function TodaysBillingPage() {
  const { customers, selectedDate, addExpense, carts } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  // Modals
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseCustomerId, setExpenseCustomerId] = useState<string | null>(null);
  const [expenseData, setExpenseData] = useState({ amount: "", description: "" });

  // Filter customers who have invoices matching the selectedDate
  const isDateInRange = (dateStr: string, filterRange: string) => {
    const d = new Date(dateStr).toISOString().split('T')[0];
    if (filterRange.includes(' to ')) {
      const [start, end] = filterRange.split(' to ');
      return d >= start && d <= end;
    }
    return d === filterRange;
  };

  const todayCustomers = customers.filter(c => {
    const hasTodayInvoice = c.invoices?.some(inv => isDateInRange(inv.date, selectedDate));
    const hasActiveSession = carts[c.id] && carts[c.id].length > 0;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return (hasTodayInvoice || hasActiveSession) && matchesSearch;
  });

  const totalTodaySales = todayCustomers.reduce((sum, c) => {
    const todayInvoices = c.invoices?.filter(inv => isDateInRange(inv.date, selectedDate)) || [];
    return sum + todayInvoices.reduce((s, inv) => s + inv.totalAmount, 0);
  }, 0);

  const totalTodayExpense = todayCustomers.reduce((sum, c) => {
    const todayExpenses = c.ledger?.filter(entry => entry.type === "Expense Entry" && isDateInRange(entry.date, selectedDate)) || [];
    return sum + todayExpenses.reduce((s, entry) => s + entry.expense, 0);
  }, 0);

  const handleExpenseSubmit = () => {
    const amt = parseFloat(expenseData.amount);
    if (!expenseCustomerId || !amt || isNaN(amt) || amt <= 0) return;

    addExpense(expenseCustomerId, amt, expenseData.description || "General Expense");
    setExpenseModalOpen(false);
    setExpenseData({ amount: "", description: "" });
    setExpenseCustomerId(null);
  };

  const openExpenseModal = (customerId: string) => {
    setExpenseCustomerId(customerId);
    setExpenseModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Today's Billing Activity</h1>
          <p className="text-sm text-slate-500 mt-1">Review customers who made purchases and manage their daily expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-sm px-3 py-1 font-bold">
            RS {totalTodaySales.toLocaleString()} Sales Today
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
            placeholder="Search active billing customers..." 
            className="pl-10 pr-4 bg-slate-50 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Billing List */}
      <div className="space-y-4">
        {todayCustomers.length > 0 ? (
          todayCustomers.map(customer => {
            const todayInvoices = customer.invoices?.filter(inv => isDateInRange(inv.date, selectedDate)) || [];
            const customerTodayTotal = todayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
            const isExpanded = expandedCustomer === customer.id;

            return (
              <Card key={customer.id} className="rounded-xl shadow-sm border-slate-200 overflow-hidden">
                <div 
                  className={`p-4 md:p-5 flex flex-col md:flex-row justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50 border-b border-slate-100' : ''}`}
                  onClick={() => setExpandedCustomer(isExpanded ? null : customer.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-ocean-blue)]/10 text-[var(--color-ocean-blue)] flex items-center justify-center font-bold text-lg shrink-0">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        {customer.name}
                        <Badge variant="secondary" className="bg-[var(--color-aqua)]/10 text-[var(--color-ocean-blue)] text-xs font-semibold">{todayInvoices.length} Invoices</Badge>
                      </h3>
                      <p className="text-sm text-slate-500">
                        {customer.id} • {customer.address ? `${customer.address} • ` : ''}{customer.phone || 'No phone'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium uppercase">Today's Total</p>
                      <p className="text-xl font-bold text-slate-900">RS {customerTodayTotal.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-semibold h-9"
                        onClick={(e) => { e.stopPropagation(); openExpenseModal(customer.id); }}
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
                      {todayInvoices.map((inv, idx) => (
                        <div key={inv.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
                            <span className="font-semibold text-slate-800 text-sm">Invoice #{inv.id}</span>
                            <span className="font-bold text-[var(--color-ocean-blue)]">RS {inv.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {inv.items.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-slate-600 truncate pr-2">{item.qty}x {item.name}</span>
                                <span className="font-medium text-slate-900">RS {item.total.toLocaleString()}</span>
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
              <Package size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Billing Activity</h3>
            <p className="text-slate-500">There are no sales recorded for the selected date range.</p>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <Dialog open={expenseModalOpen} onOpenChange={setExpenseModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Ledger Expense</DialogTitle>
            <DialogDescription>
              Record an expense (e.g. Delivery charges, Labor) for this customer. It will be added to their outstanding dues.
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
