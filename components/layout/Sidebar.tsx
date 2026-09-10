"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "POS Terminal", href: "/pos", icon: MonitorSmartphone },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Suppliers", href: "/suppliers", icon: Truck },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[var(--color-ocean-blue)] text-white h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 font-bold text-xl tracking-wide flex items-center gap-3">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
           <MonitorSmartphone size={18} className="text-[var(--color-aqua)]" />
        </div>
        POS System
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-[var(--color-aqua)] text-white font-medium shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-slate-400">samar@gmail.com</p>
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
