"use client";

import { Bell, Search, ChevronDown, ArrowLeft, LogOut, Settings, User, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
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

export function Navbar() {
  const router = useRouter();
  const { language, setLanguage, t, timeFilter, setTimeFilter } = useLanguage();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 w-full sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t("welcomeBack")}</h1>
          <p className="text-sm text-slate-500">09 Sep 2026</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder={t("searchPlaceholder")}
             className="pl-10 pr-4 py-2 w-64 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)] transition-all"
           />
        </div>

        <button
          onClick={() => setLanguage(language === "en" ? "ur" : "en")}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 shadow-sm rounded-full hover:bg-slate-50 transition-colors focus:outline-none"
        >
          <Globe size={16} className="text-[var(--color-aqua)]" />
          {language === "en" ? "اردو" : "English"}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 shadow-sm rounded-full hover:bg-slate-50 transition-colors focus:outline-none">
            {timeFilter === "Today" ? t("today") : timeFilter === "This Week" ? t("thisWeek") : t("thisMonth")} <ChevronDown size={14} className="text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => setTimeFilter("Today")} className="cursor-pointer font-medium">{t("today")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilter("This Week")} className="cursor-pointer font-medium">{t("thisWeek")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeFilter("This Month")} className="cursor-pointer font-medium">{t("thisMonth")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative text-slate-500 hover:text-slate-900 transition-colors focus:outline-none">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-slate-900">{t("lowStockAlert")}</span>
                  <span className="text-xs text-slate-500">5 {t("productsLowStock")}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-slate-900">{t("newOrder")}</span>
                  <span className="text-xs text-slate-500">Ahmed Traders placed an order.</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer hover:bg-slate-50 p-1 pr-3 rounded-lg transition-colors focus:outline-none">
            <div className="w-10 h-10 rounded-full bg-[var(--color-aqua)]/20 text-[var(--color-aqua)] flex items-center justify-center font-bold">
              SM
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                Admin <ChevronDown size={14} className="text-slate-500" />
              </p>
            </div>
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
  );
}
