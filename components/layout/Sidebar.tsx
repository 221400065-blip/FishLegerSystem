"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MonitorSmartphone,
  Users,
  Package,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pin
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, isSidebarOpen, setIsSidebarOpen, isSidebarHovered, setIsSidebarHovered } = useLanguage();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  
  const expanded = isSidebarOpen || isSidebarHovered;

  useEffect(() => {
    setOpenMenus({
      suppliers: pathname.includes('/suppliers') || pathname.includes('/purchase-bills') || pathname.includes('/expenses')
    });
  }, [pathname]);

  const navItems = [
    { id: "dashboard", href: "/dashboard", icon: LayoutDashboard },
    { id: "posTerminal", href: "/pos", icon: MonitorSmartphone },
    { id: "customers", href: "/customers", icon: Users },
    { id: "inventory", href: "/inventory", icon: Package },
    { 
      id: "suppliers", 
      href: "/suppliers", 
      icon: Truck,
      children: [
        { id: "purchaseBills", href: "/purchase-bills", icon: Package },
        { id: "expenses", href: "/expenses", icon: BarChart3 },
      ]
    },
    { id: "reports", href: "/reports", icon: BarChart3 },
    { id: "settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 z-50 h-screen bg-[var(--color-ocean-blue)] transition-all duration-300 shadow-xl flex flex-col ${expanded ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-16'}`}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <div className={`h-20 flex items-center px-4 relative shrink-0 border-b border-white/10 ${expanded ? 'justify-between' : 'justify-center'}`}>
        {/* Expanded Logo & Brand Text */}
        <div className={`flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all duration-300 ${!expanded ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
             <MonitorSmartphone size={18} className="text-[var(--color-aqua)]" />
          </div>
          <span className="font-bold text-sm tracking-wide text-white">
            POS & Ledger System
          </span>
        </div>

        {/* Collapsed Logo (Only shows when narrow) */}
        {!expanded && (
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
             <MonitorSmartphone size={18} className="text-[var(--color-aqua)]" />
          </div>
        )}
        
        {/* Pin/Lock & Close Buttons */}
        {expanded && (
          <div className="flex items-center gap-1 shrink-0 ml-auto md:ml-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all text-[var(--color-aqua)] flex items-center justify-center"
              title={isSidebarOpen ? "Unpin Sidebar" : "Pin Sidebar"}
            >
              {isSidebarOpen ? <Pin size={18} className="rotate-45" fill="currentColor" /> : <Pin size={18} />}
            </button>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
               <ChevronLeft size={20} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
        <nav className="flex-1 px-3 space-y-1.5 mt-6">
          <p className={`text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2 transition-all duration-300 ${!expanded ? 'opacity-0 h-0 overflow-hidden !mb-0' : 'opacity-100'}`}>
            Main Menu
          </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openMenus[item.id];

          return (
            <div key={item.id} className="flex flex-col">
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-full transition-colors group relative ${
                  isActive && !hasChildren
                    ? "bg-[var(--color-aqua)] text-white font-medium shadow-md"
                    : isActive && hasChildren 
                    ? "bg-white/10 text-white font-medium" 
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
                title={!expanded ? t(item.id as any) : ""}
                onClick={() => {
                  if (hasChildren) {
                    if (!expanded) {
                      setIsSidebarOpen(true);
                      setOpenMenus(prev => ({ ...prev, [item.id]: true }));
                    } else {
                      setOpenMenus(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                    }
                  }
                }}
              >
                <div className="flex items-center gap-3 relative">
                  <div className={`flex items-center justify-center shrink-0 ${!expanded ? 'mx-auto' : ''}`}>
                    <item.icon size={18} />
                  </div>
                  <span className={`whitespace-nowrap transition-all duration-300 ${!expanded ? 'opacity-0 w-0 overflow-hidden absolute left-10' : 'opacity-100'}`}>{t(item.id as any)}</span>
                </div>
                {hasChildren && expanded && (
                  <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
              </Link>
              
              {hasChildren && (
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <div className="flex flex-col pl-10 space-y-1">
                    {item.children?.map(child => {
                      const isChildActive = pathname === child.href || pathname?.startsWith(child.href + '/');
                      return (
                        <Link
                          key={child.id}
                          href={child.href}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                            isChildActive
                              ? "text-white font-medium bg-[var(--color-aqua)] shadow-sm"
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <child.icon size={16} />
                          {t(child.id as any)}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 mt-auto shrink-0">
        <div className={`bg-white/5 border border-white/10 rounded-xl flex items-center ${expanded ? 'justify-between p-3' : 'justify-center p-2'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-[var(--color-aqua)] flex items-center justify-center font-bold text-sm text-[var(--color-ocean-blue)] shadow-inner">
                SM
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--color-ocean-blue)] rounded-full"></span>
            </div>
            
            <div className={`whitespace-nowrap transition-all duration-300 ${!expanded ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              <p className="text-sm font-semibold text-white">Store Manager</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
          
          <button 
            onClick={() => router.push('/login')}
            className={`p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors shrink-0 ${!expanded && 'hidden md:hidden'}`}
            title="Sign Out"
          >
            <LogOut size={18} className="rotate-180" />
          </button>
        </div>
      </div>
      </div>
    </aside>
  );
}
