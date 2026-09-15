"use client";
import { useLanguage, BillingFeedItem } from "@/lib/LanguageContext";

import { MonitorSmartphone, Search, ChevronDown, Plus, Minus, Edit, Trash2, ArrowLeft, User, Settings, LogOut, RefreshCcw, Lock } from "lucide-react";
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
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const products = [
  { id: "P-101", name: "Samsung 65W Charger", category: "Chargers", price: 45.00, discount: "15% OFF", image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=65W" },
  { id: "P-102", name: "iPhone Cable 2M", category: "Cables", price: 25.00, discount: null, image: "https://placehold.co/80x80/f97316/FFFFFF?text=2M" },
  { id: "P-103", name: "USB-C Hub Multi", category: "Accessories", price: 65.00, discount: "20% OFF", image: "https://placehold.co/80x80/0B2545/FFFFFF?text=Hub" },
  { id: "P-104", name: "Fast Charger 20W", category: "Chargers", price: 18.00, discount: null, image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=20W" },
];

export default function POSPage() {
  const { 
    t, language, setLanguage, isSidebarOpen, customers, inventory, addInvoice, addCustomer, updateProductStock, setCustomerBillFormat, customerBillFormat,
    billingFeed, setBillingFeed, selectedCustomerIds, setSelectedCustomerIds, activeCustomerId, setActiveCustomerId, addNotification
  } = useLanguage();
  const router = useRouter();
  const [completeSaleModal, setCompleteSaleModal] = useState(false);
  const [payAllModal, setPayAllModal] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  
  // Admin Guard State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [activeTab, setActiveTab] = useState("All");
  const [mobileTab, setMobileTab] = useState("products");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [activeSessionSearchTerm, setActiveSessionSearchTerm] = useState("");
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const commissionRate = 8; // Fixed strictly at 8%
  
  const activeCustomer = customers.find(c => c.id === activeCustomerId) || { id: "", name: "No Customer Selected" };

  // Helper for admin guard
  const requireAdmin = (action: () => void, checkRestored: boolean = false) => {
    // If the checkRestored flag is true, we verify if ANY item in billingFeed is restored.
    const hasRestored = checkRestored ? billingFeed.some(item => item.isRestored) : false;
    
    if (hasRestored) {
      setPendingAction(() => action);
      setAdminModalOpen(true);
    } else {
      action();
    }
  };

  const unlockAndExecuteAdminAction = () => {
    if (adminPin === "1234") {
      // Unlock session by removing isRestored flag from all items so subsequent actions don't need PIN
      setBillingFeed(prev => prev.map(item => ({ ...item, isRestored: false })));
      if (pendingAction) pendingAction();
      setAdminModalOpen(false);
      setAdminPin("");
      setPendingAction(null);
    } else {
      alert("Invalid Admin PIN");
    }
  };

  const handleAddToCart = (product: any) => {
    if (!activeCustomerId || activeCustomerId === "") return;
    const actCust = customers.find(c => c.id === activeCustomerId);
    if (!actCust) return;

    const modifiesRestoredSession = billingFeed.some(i => i.customerId === activeCustomerId && i.isRestored);

    requireAdmin(() => {
      if (modifiesRestoredSession) {
        addNotification({
          title: "Restored Session Edited",
          description: `Admin added new item ${product.name} to ${actCust.name}'s restored session.`,
          type: "system"
        });
      }
      setBillingFeed(prev => [
        ...prev,
        {
          id: `ITEM-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          customerId: activeCustomerId,
          customerName: actCust.name,
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          total: product.price,
          timestamp: Date.now(),
          isRestored: modifiesRestoredSession
        }
      ]);
    }, modifiesRestoredSession);
  };

  const handleQtyChange = (itemId: string, val: string) => {
    const item = billingFeed.find(i => i.id === itemId);
    if (!item) return;

    requireAdmin(() => {
      if (item.isRestored) {
        addNotification({
          title: "Restored Session Edited",
          description: `Admin edited quantity of ${item.name} for ${item.customerName}. New Qty: ${val}`,
          type: "system"
        });
      }
      setBillingFeed(prev => prev.map(i => {
        if (i.id !== itemId) return i;
        if (val === '') return { ...i, qty: '', total: 0 };
        const num = Number(val);
        return { ...i, qty: num, total: num * Number(i.price) };
      }));
    }, item.isRestored);
  };

  const handleQtyBlur = (itemId: string) => {
    setBillingFeed(prev => prev.map(i => {
      if (i.id !== itemId) return i;
      if (i.qty === '' || Number(i.qty) < 1) return { ...i, qty: 1, total: 1 * Number(i.price) };
      return i;
    }));
  };

  const handlePriceChange = (itemId: string, val: string) => {
    const item = billingFeed.find(i => i.id === itemId);
    if (!item) return;

    requireAdmin(() => {
      setBillingFeed(prev => prev.map(i => {
        if (i.id !== itemId) return i;
        if (val === '') return { ...i, price: '', total: 0 };
        const num = Number(val);
        return { ...i, price: num, total: Number(i.qty || 0) * num };
      }));
    }, item.isRestored);
  };

  const handlePriceBlur = (itemId: string) => {
    setBillingFeed(prev => prev.map(i => {
      if (i.id !== itemId) return i;
      if (i.price === '' || Number(i.price) < 0) return { ...i, price: 0, total: 0 };
      return i;
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    const item = billingFeed.find(i => i.id === itemId);
    if (!item) return;
    
    requireAdmin(() => {
      if (item.isRestored) {
        addNotification({
          title: "Restored Session Edited",
          description: `Admin deleted item ${item.name} from ${item.customerName}'s restored session.`,
          type: "system"
        });
      }
      setBillingFeed(prev => prev.filter(i => i.id !== itemId));
    }, item.isRestored);
  };

  const handleRestoreSession = () => {
    // Fetch today's invoices from all customers
    const today = new Date().toISOString().split('T')[0];
    const restoredItems: BillingFeedItem[] = [];
    
    customers.forEach(customer => {
      const todayInvoices = customer.invoices?.filter(inv => inv.date.startsWith(today) && !inv.sessionClosed) || [];
      todayInvoices.forEach(inv => {
        inv.items.forEach((item: any) => {
          restoredItems.push({
            id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            customerId: customer.id,
            customerName: customer.name,
            productId: item.productId || item.id, // accommodate older data formats
            name: item.name,
            price: item.price,
            qty: item.qty,
            total: item.total,
            timestamp: Date.now(),
            isRestored: true
          });
        });
        
        // Ensure customer is selected
        if (!selectedCustomerIds.includes(customer.id)) {
          setSelectedCustomerIds(prev => [...prev, customer.id]);
        }
      });
    });

    if (restoredItems.length > 0) {
      setBillingFeed(prev => [...prev, ...restoredItems]);
      alert(`Restored ${restoredItems.length} items from today's invoices.`);
    } else {
      alert("No invoices found for today to restore.");
    }
  };

  const activeCustomerItems = billingFeed.filter(item => item.customerId === activeCustomerId);
  const subtotal = activeCustomerItems.reduce((sum, item) => sum + item.total, 0);
  const commission = subtotal * (commissionRate / 100);
  const customerTotal = subtotal + commission;

  const combinedSubtotal = billingFeed.reduce((sum, item) => sum + item.total, 0);
  const totalCommission = combinedSubtotal * (commissionRate / 100);
  const grandTotal = combinedSubtotal + totalCommission;
  const totalItems = billingFeed.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  // Group items by customer for the right panel
  const groupedSessions = customers.map(c => {
    const items = billingFeed.filter(i => i.customerId === c.id);
    return {
      customer: c,
      items,
      subtotal: items.reduce((s, i) => s + i.total, 0),
      commission: items.reduce((s, i) => s + i.total, 0) * (commissionRate / 100),
      total: items.reduce((s, i) => s + i.total, 0) * (1 + commissionRate / 100)
    };
  }).filter(session => session.items.length > 0);


  const handlePrint = () => {
    if (customerBillFormat === "thermal") {
      document.body.classList.add("print-thermal");
      document.body.classList.remove("print-simple");
    } else {
      document.body.classList.add("print-simple");
      document.body.classList.remove("print-thermal");
    }
    window.print();
  };

  const [newCustomerData, setNewCustomerData] = useState({ name: "", phone: "" });

  const handleAddCustomerSubmit = () => {
    if (!newCustomerData.name) return;
    const newId = `C-00${customers.length + 1}`;
    addCustomer({ id: newId, name: newCustomerData.name, phone: newCustomerData.phone, billed: 0, paid: 0, status: "Active" });
    setSelectedCustomerIds(prev => [...prev, newId]);
    setActiveCustomerId(newId);
    setAddCustomerModal(false);
    setNewCustomerData({ name: "", phone: "" });
  };

  const confirmDeleteSession = () => {
    if (!deleteSessionId) return;
    
    // Check if session has restored items
    const hasRestored = billingFeed.some(i => i.customerId === deleteSessionId && i.isRestored);
    
    requireAdmin(() => {
      setBillingFeed(prev => prev.filter(i => i.customerId !== deleteSessionId));
      setSelectedCustomerIds(prev => prev.filter(id => id !== deleteSessionId));
      if (activeCustomerId === deleteSessionId) {
        setActiveCustomerId(customers[0]?.id || "");
      }
      setDeleteSessionId(null);
    }, hasRestored);
  };

  const handleCompleteSale = () => {
    requireAdmin(() => {
      if (activeCustomerItems.length > 0) {
        const invoice = {
          id: `INV-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*100)}`,
          date: new Date().toISOString(),
          totalAmount: customerTotal,
          paidAmount: 0,
          status: "Pending" as const,
          items: activeCustomerItems
        };
        addInvoice(activeCustomerId, invoice);
        
        setBillingFeed(prev => prev.filter(i => i.customerId !== activeCustomerId));
      }
      setCompleteSaleModal(false);
    }, activeCustomerItems.some(i => i.isRestored));
  };

  const handleSaveAllInvoices = () => {
    requireAdmin(() => {
      const customersWithItems = Array.from(new Set(billingFeed.map(i => i.customerId)));
      
      customersWithItems.forEach(custId => {
        const cartItems = billingFeed.filter(i => i.customerId === custId);
        if (cartItems.length > 0) {
          const cSub = cartItems.reduce((sum, item) => sum + item.total, 0);
          const cTotal = cSub + (cSub * (commissionRate / 100));
          
          const invoice = {
            id: `INV-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*100)}`,
            date: new Date().toISOString(),
            totalAmount: cTotal,
            paidAmount: 0,
            status: "Pending" as const,
            items: cartItems
          };
          addInvoice(custId, invoice);
        }
      });
  
      setBillingFeed([]);
      setSelectedCustomerIds([]);
      setPayAllModal(false);
    }, billingFeed.some(i => i.isRestored));
  };

  return (
    <>
    <div className="min-h-[100dvh] bg-[var(--color-canvas)] flex flex-col h-[100dvh] overflow-x-hidden no-print w-full max-w-full px-3 md:px-6 py-2 md:py-4">
      {/* Top Header */}
      <header className="min-h-[4rem] h-auto py-2 bg-[var(--color-ocean-blue)] text-white flex items-center justify-between px-3 md:px-6 shrink-0 gap-2 md:gap-3 rounded-xl mb-4">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => router.back()} className="text-slate-300 hover:text-white transition-colors p-1 shrink-0" title="Go Back">
            <ArrowLeft size={20} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity min-w-0">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
              <MonitorSmartphone className="text-[var(--color-aqua)]" size={16} />
            </div>
            <h1 className="font-bold text-sm md:text-lg tracking-wide truncate">Sales</h1>
          </Link>
        </div>
        
        <div className="flex-1 max-w-md mx-8 relative hidden md:block">
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <Button onClick={handleRestoreSession} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white hidden md:flex h-9">
            <RefreshCcw size={14} className="mr-2" />
            Restore Session
          </Button>
          <p suppressHydrationWarning className="text-xs md:text-sm text-slate-300">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 md:border-l md:border-white/20 md:pl-6 cursor-pointer focus:outline-none">
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

      {/* Mobile Tab Switchers */}
      <div className="md:hidden flex border-b border-slate-200 bg-white mb-4 rounded-xl shrink-0 overflow-hidden shadow-sm">
        <button onClick={() => setMobileTab("products")} className={`flex-1 py-3 text-sm font-medium transition-colors ${mobileTab === 'products' ? 'bg-[var(--color-aqua)]/10 text-[var(--color-aqua)] border-b-2 border-[var(--color-aqua)]' : 'text-slate-500 bg-white'}`}>Products</button>
        <button onClick={() => setMobileTab("cart")} className={`flex-1 py-3 text-sm font-medium transition-colors ${mobileTab === 'cart' ? 'bg-[var(--color-aqua)]/10 text-[var(--color-aqua)] border-b-2 border-[var(--color-aqua)]' : 'text-slate-500 bg-white'}`}>Feed ({billingFeed.length})</button>
        <button onClick={() => setMobileTab("summary")} className={`flex-1 py-3 text-sm font-medium transition-colors ${mobileTab === 'summary' ? 'bg-[var(--color-aqua)]/10 text-[var(--color-aqua)] border-b-2 border-[var(--color-aqua)]' : 'text-slate-500 bg-white'}`}>Summary</button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 md:pb-0 w-full max-w-full overflow-hidden h-full">
        
        {/* Column 1: Customer & Product Catalog */}
        <div className={`md:col-span-4 flex-col gap-4 shrink-0 max-w-full overflow-hidden h-full ${mobileTab === 'products' ? 'flex' : 'hidden md:flex'}`}>
          
          {/* Customer Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900 text-sm">{t("selectCustomer")}</h2>
              <Button onClick={() => setAddCustomerModal(true)} size="sm" variant="ghost" className="text-[var(--color-aqua)] h-7 px-2 text-xs font-semibold">
                <Plus size={14} className="mr-1" /> {t("add")} Customer
              </Button>
            </div>
            <div className="relative mb-3 w-full group">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  placeholder="Search customer by name or ID..." 
                  className="w-full h-11 pl-10 pr-10 bg-slate-50 border-slate-200 focus:border-[var(--color-aqua)]" 
                  value={customerSearchTerm}
                  onChange={(e) => {
                    setCustomerSearchTerm(e.target.value);
                    setHighlightedIndex(-1);
                    if (!customerDropdownOpen) setCustomerDropdownOpen(true);
                  }}
                  onFocus={() => {
                    setCustomerDropdownOpen(true);
                    setHighlightedIndex(-1);
                  }}
                  onBlur={() => setTimeout(() => setCustomerDropdownOpen(false), 200)}
                  onKeyDown={(e) => {
                    const matched = customers.filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || c.id.toLowerCase().includes(customerSearchTerm.toLowerCase()));
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      if (!customerDropdownOpen) setCustomerDropdownOpen(true);
                      setHighlightedIndex(prev => (prev < matched.length - 1 ? prev + 1 : prev));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (matched.length === 1) {
                        const selected = matched[0];
                        if (!selectedCustomerIds.includes(selected.id)) {
                          setSelectedCustomerIds(prev => [...prev, selected.id]);
                        }
                        setActiveCustomerId(selected.id);
                        setCustomerSearchTerm("");
                        setCustomerDropdownOpen(false);
                        setHighlightedIndex(-1);
                      } else if (highlightedIndex >= 0 && matched[highlightedIndex]) {
                        const selected = matched[highlightedIndex];
                        if (!selectedCustomerIds.includes(selected.id)) {
                          setSelectedCustomerIds(prev => [...prev, selected.id]);
                        }
                        setActiveCustomerId(selected.id);
                        setCustomerSearchTerm("");
                        setCustomerDropdownOpen(false);
                        setHighlightedIndex(-1);
                      }
                    }
                  }}
                />
                <button 
                  onClick={() => setCustomerDropdownOpen(!customerDropdownOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              
              {customerDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {customers.filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || c.id.toLowerCase().includes(customerSearchTerm.toLowerCase())).map((c, index) => (
                    <div 
                      key={c.id} 
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${index === highlightedIndex ? 'bg-[var(--color-aqua)]/10 border-l-2 border-[var(--color-aqua)]' : 'hover:bg-[var(--color-aqua)]/5 border-l-2 border-transparent'}`} 
                      onClick={() => {
                        if (!selectedCustomerIds.includes(c.id)) setSelectedCustomerIds(prev => [...prev, c.id]);
                        setActiveCustomerId(c.id);
                        setCustomerSearchTerm("");
                        setCustomerDropdownOpen(false);
                        setHighlightedIndex(-1);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{c.name}</span>
                        <span className="text-[10px] text-slate-500">{c.id}</span>
                      </div>
                    </div>
                  ))}
                  {customers.filter(c => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || c.id.toLowerCase().includes(customerSearchTerm.toLowerCase())).length === 0 && (
                    <div className="p-3 text-center text-sm text-slate-500">No customers found.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Product Catalog */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:min-h-0 flex-1 flex flex-col w-full max-w-full overflow-hidden">
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
                <div 
                  key={p.id} 
                  onClick={() => handleAddToCart(p)} 
                  tabIndex={0}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleAddToCart(p); }}
                  className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg hover:border-[var(--color-aqua)]/50 cursor-pointer transition-colors group focus:outline-none focus:border-[var(--color-aqua)] focus:ring-1 focus:ring-[var(--color-aqua)]"
                >
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-md object-cover bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[var(--color-ocean-blue)]">RS {p.price.toFixed(2)}</span>
                      {p.discount && <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-[9px] px-1 py-0 h-4">{p.discount}</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Sequential Billing Feed */}
        <div className={`md:col-span-5 h-full bg-white rounded-xl shadow-sm border border-slate-200 flex-col shrink-0 p-4 md:p-6 max-w-full overflow-hidden ${mobileTab === 'cart' ? 'flex' : 'hidden md:flex'}`}>
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-t-xl -mx-4 md:-mx-6 -mt-4 md:-mt-6 px-4 md:px-6 pt-4 md:pt-6">
            <div>
              <p className="text-xs text-slate-500 font-medium">Sequential Billing Feed <span className="font-bold text-slate-800">({billingFeed.length} items)</span></p>
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                Currently Active: {activeCustomer.name} <span className="text-xs font-normal text-slate-500 bg-white border px-1.5 py-0.5 rounded">({activeCustomer.id})</span>
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar w-full max-h-[350px]">
            <div className="w-full max-w-full pb-2">
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-sm min-w-[450px]">
                  <thead className="text-xs text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="font-medium text-left pb-2 w-[35%]">PRODUCT</th>
                      <th className="font-medium text-center pb-2 w-[15%]">QTY</th>
                      <th className="font-medium text-right pb-2 w-[20%]">PRICE</th>
                      <th className="font-medium text-right pb-2 px-2 w-[15%] whitespace-nowrap">
                        COMM (8%)
                      </th>
                      <th className="font-medium text-right pb-2 w-[15%]">TOTAL</th>
                      <th className="font-medium text-right pb-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {billingFeed.map((item, index) => {
                      const prevItem = index > 0 ? billingFeed[index - 1] : null;
                      const showHeader = !prevItem || prevItem.customerId !== item.customerId;
                      
                      const lineComm = item.total * 0.08;
                      const grandPrice = item.total + lineComm;

                      return (
                        <React.Fragment key={item.id}>
                          {showHeader && (
                            <tr>
                              <td colSpan={6} className="pt-4 pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-px bg-slate-200 flex-1"></div>
                                  <span className="text-xs font-bold text-[var(--color-ocean-blue)] bg-[var(--color-aqua)]/10 px-2 py-1 rounded">
                                    {item.customerName} ({item.customerId})
                                  </span>
                                  <div className="h-px bg-slate-200 flex-1"></div>
                                </div>
                              </td>
                            </tr>
                          )}
                          <tr className={`group ${item.isRestored ? 'bg-orange-50' : ''}`}>
                            <td className="py-3 flex flex-col justify-center">
                              <p className="font-medium text-slate-900 truncate pr-2 flex items-center gap-1" title={item.name}>
                                {item.isRestored && <Lock size={12} className="text-orange-500" />} {item.name}
                              </p>
                            </td>
                            <td className="py-3">
                              <input 
                                type="number" 
                                min="1" 
                                value={item.qty} 
                                onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                onBlur={() => handleQtyBlur(item.id)}
                                className="w-16 h-8 border border-slate-200 rounded-md text-center text-xs focus:outline-none focus:border-[var(--color-aqua)] mx-auto block [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </td>
                            <td className="py-3">
                              <div className="flex items-center justify-end">
                                <span className="text-slate-500 text-xs mr-1">RS </span>
                                <input 
                                  type="number" 
                                  min="0"
                                  step="0.01" 
                                  value={item.price} 
                                  onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                  onBlur={() => handlePriceBlur(item.id)}
                                  className="w-16 h-8 border border-slate-200 rounded-md text-right text-xs px-1 focus:outline-none focus:border-[var(--color-aqua)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </div>
                            </td>
                            <td className="py-3 text-right text-slate-500 text-xs">RS {lineComm.toFixed(2)}</td>
                            <td className="py-3 text-right font-bold text-[var(--color-ocean-blue)]">RS {grandPrice.toFixed(2)}</td>
                            <td className="py-3 text-right">
                               <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                    {billingFeed.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">Feed is empty. Add products to begin.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3">
                {billingFeed.map((item, index) => {
                  const prevItem = index > 0 ? billingFeed[index - 1] : null;
                  const showHeader = !prevItem || prevItem.customerId !== item.customerId;
                  
                  const lineComm = item.total * 0.08;
                  const grandPrice = item.total + lineComm;

                  return (
                    <React.Fragment key={item.id}>
                      {showHeader && (
                        <div className="flex items-center gap-2 mt-4 mb-2">
                          <div className="h-px bg-slate-200 flex-1"></div>
                          <span className="text-[10px] font-bold text-[var(--color-ocean-blue)] bg-[var(--color-aqua)]/10 px-2 py-1 rounded">
                            {item.customerName}
                          </span>
                          <div className="h-px bg-slate-200 flex-1"></div>
                        </div>
                      )}
                      <div className={`border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col gap-3 relative ${item.isRestored ? 'bg-orange-50' : 'bg-white'}`}>
                        <div className="flex justify-between items-start gap-2 pr-6">
                          <p className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1">
                            {item.isRestored && <Lock size={12} className="text-orange-500" />} {item.name}
                          </p>
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
                              value={item.qty} 
                              onChange={(e) => handleQtyChange(item.id, e.target.value)}
                              onBlur={() => handleQtyBlur(item.id)}
                              className="w-full h-8 border border-slate-200 rounded-md text-center text-xs focus:outline-none focus:border-[var(--color-aqua)] bg-slate-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                                value={item.price} 
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                onBlur={() => handlePriceBlur(item.id)}
                                className="w-full h-8 pl-5 pr-1 border border-slate-200 rounded-md text-right text-xs focus:outline-none focus:border-[var(--color-aqua)] bg-slate-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Active Sessions Grouping */}
        <div className={`md:col-span-3 flex-col gap-3 shrink-0 max-w-full h-full min-h-0 relative overflow-y-auto hide-scrollbar ${mobileTab === 'summary' ? 'flex' : 'hidden md:flex'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 min-h-0 flex flex-col">
             <div className="p-4 border-b border-slate-100 shrink-0">
               <h2 className="font-bold text-slate-900">{t("activeSessions")}</h2>
               <div className="relative mt-3 w-full">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                 <Input 
                   placeholder="Search active sessions..." 
                   className="w-full h-8 pl-8 text-xs bg-slate-50" 
                   value={activeSessionSearchTerm}
                   onChange={(e) => setActiveSessionSearchTerm(e.target.value)}
                 />
               </div>
             </div>
             <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                {groupedSessions.filter(s => activeSessionSearchTerm === "" || s.customer.name.toLowerCase().includes(activeSessionSearchTerm.toLowerCase())).map(session => {
                  const isActive = session.customer.id === activeCustomerId;
                  
                  return (
                    <div 
                      key={session.customer.id} 
                      onClick={() => setActiveCustomerId(session.customer.id)}
                      className={`px-4 py-3 md:px-5 rounded-lg flex justify-between items-center w-full gap-4 cursor-pointer transition-colors border
                        ${isActive ? 'border-[var(--color-aqua)]/50 bg-[var(--color-aqua)]/5' : 'border-slate-100 hover:border-slate-200'}
                      `}
                    >
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold truncate ${isActive ? 'text-[var(--color-ocean-blue)]' : 'text-slate-700'}`}>{session.customer.name}</p>
                        <p className="text-xs text-slate-500">{session.items.length} items</p>
                      </div>
                      <div className="flex flex-col items-end text-xs shrink-0 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteSessionId(session.customer.id);
                            }} 
                            className="text-slate-300 hover:text-red-500 transition-colors bg-white/50 rounded-md p-1"
                            title="Delete Session"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <span className="text-slate-500">Subtotal: RS {session.subtotal.toFixed(2)}</span>
                        <span className="text-slate-500">Comm (8%): RS {session.commission.toFixed(2)}</span>
                        <span className={`font-bold text-sm mt-1 ${isActive ? 'text-[var(--color-aqua)]' : 'text-slate-900'}`}>Total: RS {session.total.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
                {groupedSessions.length === 0 && (
                  <p className="text-center text-slate-400 text-xs mt-4">No active sessions.</p>
                )}
             </div>
          </div>

          <div className="mt-auto pt-4 shrink-0 w-full max-w-full">
            <div className="bg-[var(--color-ocean-blue)] rounded-xl p-5 text-white shadow-lg flex flex-col gap-4">
              <h3 className="text-xs text-slate-300 tracking-wider font-medium uppercase">GRAND SUMMARY</h3>
              <div className="space-y-3 pb-4 border-b border-white/10 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Total Items</span>
                  <span className="font-bold text-white">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Combined Subtotal</span>
                  <span className="font-bold text-white">RS {combinedSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Commission ({commissionRate}%)</span>
                  <span className="font-bold text-white">RS {totalCommission.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">Grand Total</span>
                <span className="text-2xl md:text-3xl font-bold text-[var(--color-aqua)]">RS {grandTotal.toFixed(2)}</span>
              </div>
              <Button onClick={() => setPayAllModal(true)} disabled={billingFeed.length === 0} className="w-full mt-2 h-12 md:h-14 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-base shadow-sm rounded-xl transition-all">
                Save Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}

      {/* Admin Guard Modal */}
      <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-orange-600 flex items-center gap-2">
              <Lock size={20} /> Admin Authorization Required
            </DialogTitle>
            <DialogDescription className="text-slate-700 mt-2">
              You are attempting to modify a restored session. Please enter the Admin PIN to proceed. (Use: 1234)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="password"
              placeholder="Enter Admin PIN" 
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="text-center tracking-widest text-lg"
              maxLength={4}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setAdminModalOpen(false); setPendingAction(null); }}>Cancel</Button>
            <Button onClick={unlockAndExecuteAdminAction} className="bg-orange-600 hover:bg-orange-700 text-white">Unlock & Execute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteSessionId} onOpenChange={(open) => !open && setDeleteSessionId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Delete Session?</DialogTitle>
            <DialogDescription className="text-slate-700 mt-2">
              Are you sure you want to delete this session? The active bill for this customer will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteSessionId(null)}>Cancel</Button>
            <Button onClick={confirmDeleteSession} className="bg-red-600 hover:bg-red-700 text-white">OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <Dialog open={payAllModal} onOpenChange={setPayAllModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Save All Sales?</DialogTitle>
            <DialogDescription>
              You are about to settle orders for <strong className="text-slate-900">{groupedSessions.length} customer(s)</strong> for a Grand Total of <strong className="text-orange-600">RS {grandTotal.toFixed(2)}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500">This will save transactions to ledgers and clear the current feed.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayAllModal(false)}>Cancel</Button>
            <Button onClick={handleSaveAllInvoices} className="bg-orange-500 hover:bg-orange-600 text-white">Save All Sales</Button>
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
            {activeCustomerItems.map((item, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="py-2">{item.name}</td>
                <td className="py-2 text-center">{item.qty}</td>
                <td className="py-2 text-right">RS {Number(item.price).toFixed(2)}</td>
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
