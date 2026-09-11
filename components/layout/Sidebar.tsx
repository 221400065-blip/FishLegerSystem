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
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const navItems = [
    { id: "dashboard", href: "/dashboard", icon: LayoutDashboard },
    { id: "posTerminal", href: "/pos", icon: MonitorSmartphone },
    { id: "customers", href: "/customers", icon: Users },
    { id: "inventory", href: "/inventory", icon: Package },
    { id: "suppliers", href: "/suppliers", icon: Truck },
    { id: "expenses", href: "/expenses", icon: BarChart3 },
    { id: "purchaseBills", href: "/purchase-bills", icon: Package },
    { id: "reports", href: "/reports", icon: BarChart3 },
    { id: "settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[var(--color-ocean-blue)] text-white h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 font-bold text-xl tracking-wide flex items-center gap-3">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
           <MonitorSmartphone size={18} className="text-[var(--color-aqua)]" />
        </div>
        Ledger System
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-[var(--color-aqua)] text-white font-medium shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {t(item.id as any)}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-aqua)] flex items-center justify-center font-bold text-sm text-[var(--color-ocean-blue)] shrink-0">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-slate-400">samar@gmail.com</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium" 
            title="Sign Out"
          >
            <LogOut size={16} className="rotate-180" /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
