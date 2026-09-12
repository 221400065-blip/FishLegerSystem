"use client";
import { useLanguage } from "@/lib/LanguageContext";

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

const products = [
  { id: "P-101", name: "Samsung 65W Charger", category: "Chargers", price: 45.00, discount: "15% OFF", image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=65W" },
  { id: "P-102", name: "iPhone Cable 2M", category: "Cables", price: 25.00, discount: null, image: "https://placehold.co/80x80/f97316/FFFFFF?text=2M" },
  { id: "P-103", name: "USB-C Hub Multi", category: "Accessories", price: 65.00, discount: "20% OFF", image: "https://placehold.co/80x80/0B2545/FFFFFF?text=Hub" },
  { id: "P-104", name: "Fast Charger 20W", category: "Chargers", price: 18.00, discount: null, image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=20W" },
];

export default function POSPage() {
  const { t, customerBillFormat, customers, addCustomer } = useLanguage();
  const router = useRouter();
  const [completeSaleModal, setCompleteSaleModal] = useState(false);
  const [payAllModal, setPayAllModal] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const commissionRate = 8; // Fixed strictly at 8%

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

  const handleAddToCart = (product: any) => {
    setCarts(prev => {
      const cart = prev[activeCustomerId] || [];
      const existing = cart.find(i => i.id === product.id);
      if (existing) {
        return {
          ...prev,
          [activeCustomerId]: cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.price } : i)
        };
      }
      return {
        ...prev,
        [activeCustomerId]: [...cart, { id: product.id, name: product.name, price: product.price, qty: 1, total: product.price }]
      };
    });
  };

  const handleQtyChange = (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    setCarts(prev => {
      const cart = prev[activeCustomerId] || [];
      return {
        ...prev,
        [activeCustomerId]: cart.map(i => i.id === itemId ? { ...i, qty: newQty, total: newQty * i.price } : i)
      };
    });
  };

  const handlePriceChange = (itemId: string, newPrice: number) => {
    if (newPrice < 0) return;
    setCarts(prev => {
      const cart = prev[activeCustomerId] || [];
      return {
        ...prev,
        [activeCustomerId]: cart.map(i => i.id === itemId ? { ...i, price: newPrice, total: i.qty * newPrice } : i)
      };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCarts(prev => {
      const cart = prev[activeCustomerId] || [];
      return {
        ...prev,
        [activeCustomerId]: cart.filter(i => i.id !== itemId)
      };
    });
  };

  const subtotal = activeCart.reduce((sum, item) => sum + item.total, 0);
  const commission = subtotal * (commissionRate / 100);
  const customerTotal = subtotal + commission;

  const totalActiveSessions = Object.values(carts).filter(cart => cart.length > 0).length;
  const combinedSubtotal = Object.values(carts).reduce((sum, cart) => sum + cart.reduce((s, i) => s + i.total, 0), 0);
  const totalCommission = combinedSubtotal * (commissionRate / 100);
  const grandTotal = combinedSubtotal + totalCommission;
  const totalItems = Object.values(carts).reduce((sum, cart) => sum + cart.reduce((s, i) => s + i.qty, 0), 0);

  const handlePrint = () => {
    // Set print format class on body
    if (customerBillFormat === "thermal") {
      document.body.classList.add("print-thermal");
      document.body.classList.remove("print-simple");
    } else {
      document.body.classList.add("print-simple");
      document.body.classList.remove("print-thermal");
    }window.print();
  };
  const [newCustomerData, setNewCustomerData] = useState({ name: "", phone: "" });

  const handleAddCustomerSubmit = () => {
    if (!newCustomerData.name) return;
    const newId = `C-00${customers.length + 1}`;
    addCustomer({ id: newId, name: newCustomerData.name, phone: newCustomerData.phone, billed: 0, paid: 0, status: "Active" });
    setActiveCustomerId(newId);
    setAddCustomerModal(false);
    setNewCustomerData({ name: "", phone: "" });
  };

  return (
    <>
    <div className="min-h-[100dvh] bg-[var(--color-canvas)] flex flex-col h-[100dvh] overflow-x-hidden no-print w-full max-w-full px-3 md:px-6 py-2 md:py-4">
      {/* Top Header */}
      <header className="min-h-[4rem] h-auto py-2 bg-[var(--color-ocean-blue)] text-white flex flex-wrap items-center justify-between px-4 md:px-6 shrink-0 gap-3 rounded-xl mb-4">
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <button onClick={() => router.back()} className="text-slate-300 hover:text-white transition-colors p-1 shrink-0" title="Go Back">
            <ArrowLeft size={20} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity min-w-0">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
              <MonitorSmartphone className="text-[var(--color-aqua)]" size={16} />
            </div>
            <h1 className="font-bold text-sm md:text-lg tracking-wide truncate">Ledger System / Sales</h1>
          </Link>
        </div>
        
        <div className="flex-1 w-full md:w-auto md:max-w-md mx-0 md:mx-8 relative hidden md:block">
           {/* Search removed based on feedback */}
        </div>

        <div className="flex items-center gap-6">
          <p className="text-sm text-slate-300">09 Sep 2026</p>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border-l border-white/20 pl-6 cursor-pointer focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-[var(--color-aqua)] flex items-center justify-center text-white shadow-sm">
                <User size={16} />
              </div>
              <ChevronDown size={14} className="text-slate-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("profile") || "Profile"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => router.push('/login')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden gap-4 pb-10 lg:pb-0 w-full max-w-full overflow-x-hidden">
        
        {/* Column 1: Customer & Product Catalog */}
        <div className="w-full lg:w-1/3 flex-col gap-4 flex shrink-0 lg:shrink max-w-full overflow-x-hidden">
          
          {/* Customer Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900 text-sm">{t("selectCustomer")}</h2>
              <Button onClick={() => setAddCustomerModal(true)} size="sm" variant="ghost" className="text-[var(--color-aqua)] h-7 px-2 text-xs font-semibold">
                <Plus size={14} className="mr-1" /> {t("add")} Customer
              </Button>
            </div>
            <div className="relative mb-3 w-full">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <Input 
                 placeholder="Search customer..." 
                 className="w-full h-8 pl-8 text-xs bg-slate-50" 
                 value={customerSearchTerm}
                 onChange={(e) => setCustomerSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar w-full">
              {customers.filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || c.id.toLowerCase().includes(customerSearchTerm.toLowerCase())).map((c, i) => (
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-h-[500px] lg:min-h-0 lg:flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
            <div className="relative mb-3 shrink-0 w-full">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <Input 
                 placeholder={t("searchProduct")} 
                 className="w-full h-9 pl-8 text-sm bg-slate-50" 
                 value={productSearchTerm}
                 onChange={(e) => setProductSearchTerm(e.target.value)}
               />
            </div>
            
            <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar shrink-0 border-b border-slate-100 pb-2 w-full">
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
              {products.filter(p => (activeTab === "All" || p.category === activeTab) && (p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) || p.id.toLowerCase().includes(productSearchTerm.toLowerCase()))).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg hover:border-[var(--color-aqua)]/50 transition-colors group">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-md object-cover bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[var(--color-ocean-blue)]">RS {p.price.toFixed(2)}</span>
                      {p.discount && <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-[9px] px-1 py-0 h-4">{p.discount}</Badge>}
                    </div>
                  </div>
                  <Button onClick={() => handleAddToCart(p)} size="icon" className="h-8 w-8 rounded-full bg-slate-100 text-[var(--color-ocean-blue)] hover:bg-[var(--color-aqua)] hover:text-white transition-colors shrink-0">
                    <Plus size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Active Billing Cart */}
        <div className="w-full lg:w-[38%] min-h-[400px] lg:min-h-0 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col shrink-0 lg:shrink p-4 md:p-6 mt-4 lg:mt-0 max-w-full overflow-x-hidden">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-t-xl -mx-4 md:-mx-6 -mt-4 md:-mt-6 px-4 md:px-6 pt-4 md:pt-6">
            <div>
              <p className="text-xs text-slate-500 font-medium">{t("billingTo")}</p>
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                {activeCustomer.name} <span className="text-xs font-normal text-slate-500 bg-white border px-1.5 py-0.5 rounded">({activeCustomer.id})</span>
              </h2>
            </div>
            {/* Action buttons removed as requested */}
          </div>

          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar w-full">
            <div className="w-full max-w-full pb-2">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-sm min-w-[450px]">
                  <thead className="text-xs text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="font-medium text-left pb-2 w-[35%]">PRODUCT</th>
                      <th className="font-medium text-center pb-2 w-[15%]">QTY</th>
                      <th className="font-medium text-right pb-2 w-[20%]">PRICE</th>
                      <th className="font-medium text-right pb-2 px-2 w-[15%]">
                        COMMISSION (RS)<br/>
                        <span className="text-[10px] text-slate-400 font-normal">(8% Rate)</span>
                      </th>
                      <th className="font-medium text-right pb-2 w-[15%]">TOTAL</th>
                      <th className="font-medium text-right pb-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activeCart.map(item => {
                      const lineComm = item.total * 0.08;
                      const grandPrice = item.total + lineComm;
                      return (
                      <tr key={item.id} className="group">
                        <td className="py-3">
                          <p className="font-medium text-slate-900 truncate pr-2" title={item.name}>{item.name}</p>
                        </td>
                        <td className="py-3">
                          <input 
                            type="number" 
                            min="1" 
                            value={item.qty || ''} 
                            onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                            className="w-16 h-8 border border-slate-200 rounded-md text-center text-xs focus:outline-none focus:border-[var(--color-aqua)] mx-auto block"
                          />
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-end">
                            <span className="text-slate-500 text-xs mr-1">RS </span>
                            <input 
                              type="number" 
                              min="0"
                              step="0.01" 
                              value={item.price || ''} 
                              onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                              className="w-16 h-8 border border-slate-200 rounded-md text-right text-xs px-1 focus:outline-none focus:border-[var(--color-aqua)]"
                            />
                          </div>
                        </td>
                        <td className="py-3 text-right text-slate-500 text-xs">RS {lineComm.toFixed(2)}</td>
                        <td className="py-3 text-right font-bold text-[var(--color-ocean-blue)]">RS {grandPrice.toFixed(2)}</td>
                        <td className="py-3 text-right">
                           <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3">
                {activeCart.map(item => {
                  const lineComm = item.total * 0.08;
                  const grandPrice = item.total + lineComm;
                  return (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col gap-3 relative">
                      <div className="flex justify-between items-start gap-2 pr-6">
                        <p className="font-bold text-slate-900 text-sm leading-tight">{item.name}</p>
                        <button onClick={() => handleRemoveItem(item.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 items-end">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 font-medium">QTY</span>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.qty || ''} 
                            onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                            className="w-full h-8 border border-slate-200 rounded-md text-center text-xs focus:outline-none focus:border-[var(--color-aqua)] bg-slate-50"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 font-medium">PRICE</span>
                          <div className="flex items-center relative">
                            <span className="absolute left-2 text-slate-400 text-xs">RS </span>
                            <input 
                              type="number" 
                              min="0"
                              step="0.01" 
                              value={item.price || ''} 
                              onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                              className="w-full h-8 pl-5 pr-1 border border-slate-200 rounded-md text-right text-xs focus:outline-none focus:border-[var(--color-aqua)] bg-slate-50"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                          <span className="text-[10px] text-slate-500 font-medium">COMM(8%)</span>
                          <span className="text-xs font-semibold text-slate-600 h-8 flex items-center justify-end">RS {lineComm.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                          <span className="text-[10px] text-slate-500 font-medium">TOTAL</span>
                          <span className="text-sm font-bold text-[var(--color-ocean-blue)] h-8 flex items-center justify-end">RS {grandPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 shrink-0 pt-4 bg-slate-50/80 -mx-4 md:-mx-6 -mb-4 md:-mb-6 px-4 md:px-6 pb-4 md:pb-6 rounded-b-xl">
            <div className="space-y-1 pb-3">
              <div className="flex justify-between text-sm items-center py-1">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">RS {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200 mt-2">
                <span className="text-slate-900">Grand Total</span>
                <span className="text-[var(--color-aqua)]">RS {customerTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-4 w-full px-1">
              <Button onClick={handlePrint} variant="outline" className="flex-1 h-12 text-[var(--color-aqua)] border-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/10 hover:text-[var(--color-aqua)] font-bold text-sm md:text-base shadow-sm min-w-0">
                Print Bill
              </Button>
              <Button onClick={() => setCompleteSaleModal(true)} className="flex-1 h-12 bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-bold text-sm md:text-base shadow-sm min-w-0">
                {t("completeSale")}
              </Button>
            </div>
          </div>
        </div>

        {/* Column 3: Active Sessions & Summary */}
        <div className="w-full lg:w-[28%] flex flex-col gap-4 shrink-0 lg:shrink mt-4 lg:mt-0 max-w-full overflow-x-hidden">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
             <div className="p-4 border-b border-slate-100">
               <h2 className="font-bold text-slate-900">{t("activeSessions")}</h2>
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
                      className={`px-4 py-3 md:px-5 rounded-lg flex justify-between items-center w-full gap-4 cursor-pointer transition-colors border
                        ${isActive ? 'border-[var(--color-aqua)]/50 bg-[var(--color-aqua)]/5' : 'border-slate-100 hover:border-slate-200'}
                      `}
                    >
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold truncate ${isActive ? 'text-[var(--color-ocean-blue)]' : 'text-slate-700'}`}>{c.name}</p>
                        <p className="text-xs text-slate-500">{cart.length} items</p>
                      </div>
                      <div className="flex flex-col items-end text-xs shrink-0 pr-2">
                        <span className="text-slate-500">Subtotal: RS {cSub.toFixed(2)}</span>
                        <span className="text-slate-500">Comm (8%): RS {(cSub * 0.08).toFixed(2)}</span>
                        <span className={`font-bold text-sm mt-1 ${isActive ? 'text-[var(--color-aqua)]' : 'text-slate-900'}`}>Total: RS {cTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="bg-[var(--color-ocean-blue)] rounded-xl shadow-md p-5 md:p-6 text-white shrink-0 relative overflow-hidden w-full max-w-full">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-[var(--color-aqua)]/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-slate-300 text-sm font-medium mb-4 uppercase tracking-wider relative z-10 px-1">{t("grandSummary")}</h3>
            
            <div className="space-y-3 text-sm relative z-10 px-1 pr-4">
              <div className="flex justify-between items-center w-full gap-4">
                <span className="text-slate-300 truncate">Total Items</span>
                <span className="font-semibold shrink-0">{totalItems}</span>
              </div>
              <div className="flex justify-between items-center w-full gap-4">
                <span className="text-slate-300 truncate">Combined Subtotal</span>
                <span className="font-semibold shrink-0">RS {combinedSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center w-full gap-4">
                <span className="text-slate-300 truncate">Commission ({commissionRate}%)</span>
                <span className="font-semibold shrink-0">RS {totalCommission.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 relative z-10 px-1">
              <p className="text-slate-300 text-xs mb-1">{t("grandTotal")}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-aqua)] tracking-tight truncate">RS {grandTotal.toFixed(2)}</h2>
            </div>

            <div className="w-full px-1 mt-6">
              <Button onClick={() => setPayAllModal(true)} className="w-full mx-auto h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-sm relative z-10 block">
                Save Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={addCustomerModal} onOpenChange={setAddCustomerModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the details of the new customer below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input value={newCustomerData.name} onChange={e => setNewCustomerData({...newCustomerData, name: e.target.value})} placeholder="e.g. Bilal Traders" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <Input value={newCustomerData.phone} onChange={e => setNewCustomerData({...newCustomerData, phone: e.target.value})} placeholder="+92 300 0000000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCustomerModal(false)}>Cancel</Button>
            <Button onClick={handleAddCustomerSubmit} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white">Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={completeSaleModal} onOpenChange={setCompleteSaleModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Complete Sale?</DialogTitle>
            <DialogDescription>
              Completing sale for <strong className="text-slate-900">Ahmed Traders</strong> for <strong className="text-[var(--color-aqua)]">RS 163.08</strong>.
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
              You are about to settle <strong className="text-slate-900">2 customer orders</strong> for a Grand Total of <strong className="text-orange-600">RS 266.76</strong>.
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

    {/* Printable Receipt */}
    <div className="print-only bg-white text-black p-8" id="printable-receipt">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2">Invoice / Receipt</h1>
        <p suppressHydrationWarning className="text-center text-sm text-gray-500 mb-6">Date: {new Date().toLocaleDateString()}</p>
        
        <div className="mb-6">
          <h2 className="font-bold">Billed To:</h2>
          <p>{activeCustomer?.name}</p>
          <p className="text-sm text-gray-500">{activeCustomer?.phone || activeCustomer?.id}</p>
        </div>

        <table className="w-full text-sm mb-6">
          <thead className="border-b-2 border-black">
            <tr>
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody className="border-b border-gray-300">
            {activeCart.map((item, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="py-2">{item.name}</td>
                <td className="py-2 text-center">{item.qty}</td>
                <td className="py-2 text-right">RS {item.price.toFixed(2)}</td>
                <td className="py-2 text-right">RS {item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 text-right text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>RS {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Commission (8%):</span>
            <span>RS {commission.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-black mt-2">
            <span>Grand Total:</span>
            <span>RS {customerTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
    </>
  );
}
