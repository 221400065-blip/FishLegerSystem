"use client";

import { MonitorSmartphone, Search, ChevronDown, Plus, Minus, Edit, Trash2, ArrowLeft, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const customers = [
  { id: "C-001", name: "Ahmed Traders" },
  { id: "C-002", name: "Ali Electronics" },
  { id: "C-003", name: "Zara Imports" },
];

const products = [
  { id: "P-101", name: "Samsung 65W Charger", category: "Chargers", price: 45.00, discount: "15% OFF", image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=65W" },
  { id: "P-102", name: "iPhone Cable 2M", category: "Cables", price: 25.00, discount: null, image: "https://placehold.co/80x80/f97316/FFFFFF?text=2M" },
  { id: "P-103", name: "USB-C Hub Multi", category: "Accessories", price: 65.00, discount: "20% OFF", image: "https://placehold.co/80x80/0B2545/FFFFFF?text=Hub" },
  { id: "P-104", name: "Fast Charger 20W", category: "Chargers", price: 18.00, discount: null, image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=20W" },
];

export default function POSBillingPage() {
  const router = useRouter();
  const [completeSaleModal, setCompleteSaleModal] = useState(false);
  const [payAllModal, setPayAllModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const [activeCustomerId, setActiveCustomerId] = useState("C-001");
  const [carts, setCarts] = useState<Record<string, any[]>>({
    "C-001": [
      { id: "P-101", name: "Samsung 65W Charger", price: 45.00, qty: 2, total: 90.00 },
      { id: "P-102", name: "iPhone Cable 2M", price: 25.00, qty: 1, total: 25.00 },
      { id: "P-104", name: "Fast Charger 20W", price: 18.00, qty: 2, total: 36.00 },
    ],
    "C-002": [
      { id: "P-103", name: "USB-C Hub Multi", price: 65.00, qty: 1, total: 65.00 },
    ],
    "C-003": []
  });

  const activeCustomer = customers.find(c => c.id === activeCustomerId) || customers[0];
  const activeCart = carts[activeCustomerId] || [];

  const subtotal = activeCart.reduce((sum, item) => sum + item.total, 0);
  const commission = subtotal * 0.08;
  const customerTotal = subtotal + commission;

  const totalActiveSessions = Object.values(carts).filter(cart => cart.length > 0).length;
  const combinedSubtotal = Object.values(carts).reduce((sum, cart) => sum + cart.reduce((s, i) => s + i.total, 0), 0);
  const totalTax = combinedSubtotal * 0.08;
  const grandTotal = combinedSubtotal + totalTax;
  const totalItems = Object.values(carts).reduce((sum, cart) => sum + cart.reduce((s, i) => s + i.qty, 0), 0);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col h-screen overflow-hidden">
      {/* Top Header */}
      <header className="h-16 bg-[var(--color-ocean-blue)] text-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-300 hover:text-white transition-colors p-1" title="Go Back">
            <ArrowLeft size={20} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <MonitorSmartphone className="text-[var(--color-aqua)]" size={18} />
            </div>
            <h1 className="font-bold text-lg tracking-wide">POS / Multi-Customer Sales</h1>
          </Link>
        </div>
        
        <div className="flex-1 max-w-md mx-8 relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           <input 
             type="text" 
             placeholder="Search invoice or product ID..." 
             className="w-full pl-9 pr-4 py-1.5 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-[var(--color-aqua)]"
           />
        </div>

        <div className="flex items-center gap-6">
          <p className="text-sm text-slate-300">09 Sep 2026</p>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border-l border-white/20 pl-6 cursor-pointer focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-[var(--color-aqua)] flex items-center justify-center font-bold text-sm text-[var(--color-ocean-blue)]">
                SM
              </div>
              <p className="text-sm font-medium flex items-center gap-1">
                Admin <ChevronDown size={14} className="text-slate-300" />
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => router.push('/login')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Column 1: Customer & Product Catalog */}
        <div className="w-1/3 flex flex-col gap-4">
          
          {/* Customer Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900 text-sm">Select Customer</h2>
              <Button size="sm" variant="ghost" className="text-[var(--color-aqua)] h-7 px-2 text-xs font-semibold">
                <Plus size={14} className="mr-1" /> Add Customer
              </Button>
            </div>
            <div className="relative mb-3">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <Input placeholder="Search customer..." className="h-8 pl-8 text-xs bg-slate-50" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {customers.map((c, i) => (
                <div 
                  key={c.id} 
                  onClick={() => setActiveCustomerId(c.id)}
                  className={`shrink-0 px-3 py-2 border rounded-lg cursor-pointer transition-colors whitespace-nowrap
                  ${c.id === activeCustomerId ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <p className={`text-xs font-bold ${c.id === activeCustomerId ? 'text-[var(--color-ocean-blue)]' : 'text-slate-700'}`}>{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.id}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Catalog */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex-1 flex flex-col min-h-0">
            <div className="relative mb-3 shrink-0">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <Input placeholder="Search product..." className="h-9 pl-8 text-sm bg-slate-50" />
            </div>
            
            <div className="flex gap-1 mb-4 overflow-x-auto hide-scrollbar shrink-0 border-b border-slate-100 pb-2">
              {["All", "Chargers", "Accessories", "Cables"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors
                    ${activeTab === tab ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {products.filter(p => activeTab === "All" || p.category === activeTab).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg hover:border-[var(--color-aqua)]/50 transition-colors group">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-md object-cover bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[var(--color-ocean-blue)]">${p.price.toFixed(2)}</span>
                      {p.discount && <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-[9px] px-1 py-0 h-4">{p.discount}</Badge>}
                    </div>
                  </div>
                  <Button size="icon" className="h-8 w-8 rounded-full bg-slate-100 text-[var(--color-ocean-blue)] hover:bg-[var(--color-aqua)] hover:text-white transition-colors shrink-0">
                    <Plus size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Active Billing Cart */}
        <div className="w-[38%] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-t-xl">
            <div>
              <p className="text-xs text-slate-500 font-medium">Billing to</p>
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                {activeCustomer.name} <span className="text-xs font-normal text-slate-500 bg-white border px-1.5 py-0.5 rounded">({activeCustomer.id})</span>
              </h2>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--color-aqua)]"><Edit size={16} /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500"><Trash2 size={16} /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="font-medium text-left pb-2 w-1/2">PRODUCT</th>
                  <th className="font-medium text-center pb-2">QTY</th>
                  <th className="font-medium text-right pb-2">PRICE</th>
                  <th className="font-medium text-right pb-2">TOTAL</th>
                  <th className="font-medium text-right pb-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeCart.map(item => (
                  <tr key={item.id} className="group">
                    <td className="py-3">
                      <p className="font-medium text-slate-900 truncate pr-2" title={item.name}>{item.name}</p>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1 border border-slate-200 rounded-md w-fit mx-auto px-1">
                        <button className="p-1 hover:text-[var(--color-aqua)] text-slate-500"><Minus size={12} /></button>
                        <span className="w-4 text-xs font-semibold">{item.qty}</span>
                        <button className="p-1 hover:text-[var(--color-aqua)] text-slate-500"><Plus size={12} /></button>
                      </div>
                    </td>
                    <td className="py-3 text-right text-slate-500">${item.price.toFixed(2)}</td>
                    <td className="py-3 text-right font-bold text-slate-900">${item.total.toFixed(2)}</td>
                    <td className="py-3 text-right">
                       <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50 rounded-b-xl">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Commission (8%)</span>
                <span className="font-medium text-slate-900">${commission.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 border-dashed flex justify-between items-center mt-2">
                <span className="font-bold text-slate-900">Customer Total</span>
                <span className="font-bold text-2xl text-[var(--color-aqua)]">${customerTotal.toFixed(2)}</span>
              </div>
            </div>
            <Button onClick={() => setCompleteSaleModal(true)} className="w-full h-12 bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-bold text-base shadow-sm">
              Complete Sale
            </Button>
          </div>
        </div>

        {/* Column 3: Multi-Customer Order Summary & Grand Total */}
        <div className="w-[28%] flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
             <div className="p-4 border-b border-slate-100">
               <h2 className="font-bold text-slate-900">Active Sessions</h2>
             </div>
             <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                {customers.filter(c => carts[c.id]?.length > 0).map(c => {
                  const cart = carts[c.id];
                  const cSub = cart.reduce((sum, item) => sum + item.total, 0);
                  const cTotal = cSub + (cSub * 0.08);
                  const isActive = c.id === activeCustomerId;
                  
                  return (
                    <div 
                      key={c.id} 
                      onClick={() => setActiveCustomerId(c.id)}
                      className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors border
                        ${isActive ? 'border-[var(--color-aqua)]/50 bg-[var(--color-aqua)]/5' : 'border-slate-100 hover:border-slate-200'}
                      `}
                    >
                      <div>
                        <p className={`text-sm font-bold ${isActive ? 'text-[var(--color-ocean-blue)]' : 'text-slate-700'}`}>{c.name}</p>
                        <p className="text-xs text-slate-500">{cart.length} items</p>
                      </div>
                      <p className={`font-bold ${isActive ? 'text-[var(--color-aqua)]' : 'text-slate-900'}`}>${cTotal.toFixed(2)}</p>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="bg-[var(--color-ocean-blue)] rounded-xl shadow-md p-6 text-white shrink-0 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-[var(--color-aqua)]/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-slate-300 text-sm font-medium mb-4 uppercase tracking-wider relative z-10">Grand Summary</h3>
            
            <div className="space-y-2 text-sm relative z-10">
              <div className="flex justify-between">
                <span className="text-slate-300">Total Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Combined Subtotal</span>
                <span className="font-semibold">${combinedSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Tax (8%)</span>
                <span className="font-semibold">${totalTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 relative z-10">
              <p className="text-slate-300 text-xs mb-1">Grand Total</p>
              <h2 className="text-4xl font-bold text-[var(--color-aqua)] tracking-tight">${grandTotal.toFixed(2)}</h2>
            </div>

            <Button onClick={() => setPayAllModal(true)} className="w-full mt-6 h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-sm relative z-10">
              Pay All Invoices
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={completeSaleModal} onOpenChange={setCompleteSaleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Complete Sale?</DialogTitle>
            <DialogDescription>
              Completing sale for <strong className="text-slate-900">Ahmed Traders</strong> for <strong className="text-[var(--color-aqua)]">$163.08</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500">This action will update the inventory and record the transaction.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteSaleModal(false)}>Cancel</Button>
            <Button onClick={() => setCompleteSaleModal(false)} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Confirm Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={payAllModal} onOpenChange={setPayAllModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Pay All Invoices?</DialogTitle>
            <DialogDescription>
              You are about to settle <strong className="text-slate-900">2 customer orders</strong> for a Grand Total of <strong className="text-orange-600">$266.76</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500">Ensure all payments have been received before proceeding.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayAllModal(false)}>Cancel</Button>
            <Button onClick={() => setPayAllModal(false)} className="bg-orange-500 hover:bg-orange-600 text-white">Pay All Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
