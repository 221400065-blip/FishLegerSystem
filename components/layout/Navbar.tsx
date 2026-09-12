"use client";

import { Bell, Search, ChevronDown, LogOut, Settings, User, Menu, Calendar } from "lucide-react";
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

import { useState, useEffect } from "react";

export function Navbar() {
  const router = useRouter();
  const { 
    t, 
    setSelectedDate, 
    setIsSidebarOpen, 
    notifications, 
    markNotificationAsRead 
  } = useLanguage();

  // Initial Range state
  const [startDate, setStartDate] = useState("2026-08-31");
  const [endDate, setEndDate] = useState("2026-09-11");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Page load hotey hi context mein poori range pass kar do
  useEffect(() => {
    if (setSelectedDate) {
      setSelectedDate(`${startDate} to ${endDate}`);
    }
  }, []);

  const handleNotificationClick = (id: string, type: string) => {
    markNotificationAsRead(id);
    if (type === 'inventory') router.push('/inventory');
    else if (type === 'order') router.push('/suppliers');
    else if (type === 'customer') router.push('/customers');
    else router.push('/notifications');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Apply Filter: Range pass karne ke liye fix
  const handleApplyFilter = () => {
    if (setSelectedDate) {
      if (startDate === endDate) {
        setSelectedDate(startDate);
      } else {
        setSelectedDate(`${startDate} to ${endDate}`);
      }
    }
    setIsDatePickerOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    if (setSelectedDate) setSelectedDate(today);
    setIsDatePickerOpen(false);
  };

  const handleSetThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const currentDay = today.toISOString().split('T')[0];
    setStartDate(firstDay);
    setEndDate(currentDay);
    if (setSelectedDate) {
      if (firstDay === currentDay) {
        setSelectedDate(firstDay);
      } else {
        setSelectedDate(`${firstDay} to ${currentDay}`);
      }
    }
    setIsDatePickerOpen(false);
  };

  const formattedDisplayDate = () => {
    if (startDate === endDate) {
      return new Date(startDate).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' });
    }
    const d1 = new Date(startDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
    const d2 = new Date(endDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
    return `${d1} ➔ ${d2}`;
  };

  return (
    <header className="h-auto min-h-[4rem] py-3 md:py-0 md:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-8 w-full sticky top-0 z-40 gap-4 md:gap-6 transition-colors">
      <div className="flex items-center gap-4 w-auto shrink-0 justify-start order-1">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate">{t("welcomeBack")}</h1>
        </div>
      </div>

      {/* Centered Search Bar */}
      <div className="relative w-full order-3 md:order-2 md:flex-1 max-w-md mx-auto flex justify-center mt-2 md:mt-0">
         <div className="relative w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           <input 
             type="text" 
             placeholder="Search invoices, customers, ledger records..."
             className="pl-10 pr-4 py-2 w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full text-sm border border-transparent focus:bg-white focus:border-[var(--color-aqua)] focus:outline-none transition-all shadow-sm"
           />
         </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 shrink-0 order-2 md:order-3">
        {/* FROM - TO Date Range Picker Button */}
        <div className="relative flex-1 md:flex-none flex justify-end">
          <button
            type="button"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-[10px] md:text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
          >
            <Calendar size={15} className="text-cyan-500 shrink-0" />
            <span className="truncate max-w-[150px] md:max-w-none">{formattedDisplayDate()}</span>
            <ChevronDown size={14} className="text-slate-400 shrink-0" />
          </button>

          {/* Date Picker Dropdown */}
          {isDatePickerOpen && (
            <div className="absolute right-0 md:right-auto mt-2 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl z-50 w-[260px] md:w-72 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Date Range Filter</span>
                <span className="text-[10px] font-semibold text-cyan-500">Select Range</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-1 md:gap-2">
                  <button
                    type="button"
                    onClick={handleSetToday}
                    className="text-[10px] md:text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md transition-colors font-medium"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={handleSetThisMonth}
                    className="text-[10px] md:text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md transition-colors font-medium"
                  >
                    This Month
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold px-2 md:px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors focus:outline-none">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-72 max-w-md mx-4 sm:mx-0">
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

        {/* Admin Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 pr-3 rounded-lg transition-colors focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-[var(--color-aqua)] flex items-center justify-center text-white shadow-sm">
              <User size={16} />
            </div>
            <ChevronDown size={14} className="text-slate-500" />
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