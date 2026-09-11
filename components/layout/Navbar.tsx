"use client";

import { Bell, Search, ChevronDown, LogOut, Settings, User, Globe, Menu } from "lucide-react";
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
  const { language, setLanguage, t, selectedDate, setSelectedDate, isSidebarOpen, setIsSidebarOpen, notifications, markNotificationAsRead } = useLanguage();

  const handleNotificationClick = (id: string, type: string) => {
    markNotificationAsRead(id);
    if (type === 'inventory') router.push('/inventory');
    else if (type === 'order') router.push('/suppliers');
    else if (type === 'customer') router.push('/customers');
    else router.push('/notifications');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-auto min-h-[5rem] py-4 md:py-0 md:h-20 bg-white border-b border-slate-200 flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-8 w-full sticky top-0 z-40 gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 truncate">{t("welcomeBack")}</h1>
        </div>
        
        {/* Mobile profile drop down could go here, but for now we let it wrap */}
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-6 w-full md:w-auto justify-between md:justify-end">
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder={t("searchPlaceholder")}
             className="pl-10 pr-4 py-2 w-full md:w-64 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)] transition-all"
           />
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 shadow-sm rounded-full hover:bg-slate-50 transition-colors focus:outline-none"
        />

        <DropdownMenu>
          <DropdownMenuTrigger className="relative text-slate-500 hover:text-slate-900 transition-colors focus:outline-none">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuGroup>
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="font-semibold text-sm">{t("notifications")}</span>
                {unreadCount > 0 && <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
                {notifications.length === 0 ? (
                   <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                ) : (
                  notifications.slice(0, 4).map(notification => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className={`cursor-pointer p-3 focus:bg-slate-50 flex items-start gap-3 ${!notification.isRead ? 'bg-[var(--color-aqua)]/5' : ''}`}
                      onClick={() => handleNotificationClick(notification.id, notification.type)}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notification.isRead ? 'bg-[var(--color-aqua)]' : 'bg-transparent'}`}></div>
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {notification.title}
                        </span>
                        <span className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notification.description}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{notification.date}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-0">
                <button 
                  onClick={() => router.push('/notifications')}
                  className="w-full text-center text-sm font-medium text-[var(--color-aqua)] py-2 hover:bg-slate-50 transition-colors rounded-b-md"
                >
                  View All Notifications
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer hover:bg-slate-50 p-1 pr-3 rounded-lg transition-colors focus:outline-none">
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
