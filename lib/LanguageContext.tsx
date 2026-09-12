"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "ur";

export type NotificationType = "inventory" | "order" | "customer" | "system";

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  isRead: boolean;
  date: string;
}

interface Translations {
  [key: string]: string;
}

const en: Translations = {
  // Sidebar
  dashboard: "Dashboard",
  posTerminal: "Ledger System",
  customers: "Customers",
  inventory: "Inventory",
  suppliers: "Suppliers",
  purchaseBills: "Purchase Bills",
  expenses: "Expenses",
  reports: "Reports",
  settings: "Settings",

  welcomeBack: "Store Manager",
  searchPlaceholder: "Search anything...",
  notifications: "Notifications",
  lowStockAlert: "Low Stock Alert",
  newOrder: "New Order",
  myAccount: "My Account",
  profile: "Profile",
  logout: "Log out",

  // Dashboard
  inventoryAlert: "Inventory Alert",
  productsLowStock: "products are running low on stock",
  viewAll: "View All \u2192",
  dailyRevenue: "Daily Revenue",
  totalOrders: "Total Orders",
  pendingCommissions: "Pending Commissions",
  activeSuppliers: "Active Suppliers",
  salesTrends: "Sales Trends",
  revenueAcrossCustomers: "Revenue across all customers",
  topSellingCategories: "Top Selling Categories",
  basedOnVolume: "Based on volume",
  recentOrders: "Recent Orders",
  latestTransactions: "Latest transactions from Ledger",
  viewAllOrders: "View All Orders",

  // Common
  add: "Add",
  addNew: "Add New",
  cancel: "Cancel",
  save: "Save",
  status: "Status",
  actions: "Actions",
  total: "Total",
  search: "Search...",

  // Time Filter
  today: "Today",
  thisWeek: "This Week",
  thisMonth: "This Month",

  // POS
  billingTo: "Billing to",
  subtotal: "Subtotal",
  commission: "Commission",
  customerTotal: "Customer Total",
  completeSale: "Complete Sale",
  activeSessions: "Active Sessions",
  grandSummary: "Grand Summary",
  totalItems: "Total Items",
  combinedSubtotal: "Combined Subtotal",
  tax: "Tax",
  grandTotal: "Grand Total",
  payAllInvoices: "Pay All Invoices",
  selectCustomer: "Select Customer",
  searchProduct: "Search product...",

  // Settings
  general: "General",
  userRoles: "User & Roles",
  security: "Security",
  appearance: "Appearance",
  billingSettings: "Billing Settings",
  billFormat: "Bill Format",
  thermalBill: "Thermal Receipt (Small)",
  simpleBill: "A4 Simple Bill",
};

const ur: Translations = {
  // Sidebar
  dashboard: "ڈیش بورڈ",
  posTerminal: "لیجر سسٹم",
  customers: "گاہک",
  inventory: "اسٹاک",
  suppliers: "سپلائرز",
  purchaseBills: "خریداری کے بل",
  expenses: "اخراجات",
  reports: "رپورٹس",
  settings: "ترتیبات",

  welcomeBack: "اسٹور مینیجر",
  searchPlaceholder: "کچھ بھی تلاش کریں...",
  notifications: "اطلاعات",
  lowStockAlert: "کم اسٹاک الرٹ",
  newOrder: "نیا آرڈر",
  myAccount: "میرا اکاؤنٹ",
  profile: "پروفائل",
  logout: "لاگ آؤٹ",

  // Dashboard
  inventoryAlert: "اسٹاک الرٹ",
  productsLowStock: "پروڈکٹس کا اسٹاک کم ہو رہا ہے",
  viewAll: "سب دیکھیں \u2192",
  dailyRevenue: "روزانہ کی آمدنی",
  totalOrders: "کل آرڈرز",
  pendingCommissions: "زیر التواء کمیشن",
  activeSuppliers: "فعال سپلائرز",
  salesTrends: "فروخت کے رجحانات",
  revenueAcrossCustomers: "تمام گاہکوں سے آمدنی",
  topSellingCategories: "سب سے زیادہ بکنے والی کیٹیگریز",
  basedOnVolume: "حجم کی بنیاد پر",
  recentOrders: "حالیہ آرڈرز",
  latestTransactions: "لیجر سے حالیہ لین دین",
  viewAllOrders: "سب آرڈرز دیکھیں",

  // Common
  add: "شامل کریں",
  addNew: "نیا شامل کریں",
  cancel: "منسوخ کریں",
  save: "محفوظ کریں",
  status: "حیثیت",
  actions: "اقدامات",
  total: "کل",
  search: "تلاش کریں...",

  // Time Filter
  today: "آج",
  thisWeek: "اس ہفتے",
  thisMonth: "اس مہینے",

  // POS
  billingTo: "بل برائے",
  subtotal: "ذیلی کل",
  commission: "کمیشن",
  customerTotal: "گاہک کا کل",
  completeSale: "فروخت مکمل کریں",
  activeSessions: "فعال سیشنز",
  grandSummary: "بڑی سمری",
  totalItems: "کل آئٹمز",
  combinedSubtotal: "مجموعی ذیلی کل",
  tax: "ٹیکس",
  grandTotal: "مجموعی کل",
  payAllInvoices: "تمام انوائسز ادا کریں",
  selectCustomer: "گاہک منتخب کریں",
  searchProduct: "پروڈکٹ تلاش کریں...",

  // Settings
  general: "عمومی",
  userRoles: "صارفین اور کردار",
  security: "سیکیورٹی",
  appearance: "ظاہری شکل",
  billingSettings: "بلنگ کی ترتیبات",
  billFormat: "بل کا فارمیٹ",
  thermalBill: "تھرمل رسید (چھوٹی)",
  simpleBill: "اے 4 سادہ بل",
};

const translations = {
  en,
  ur,
};

export type Customer = { id: string; name: string; phone?: string; billed?: number; paid?: number; status?: string; };

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  customerBillFormat: "thermal" | "simple";
  setCustomerBillFormat: (format: "thermal" | "simple") => void;
  supplierBillFormat: "thermal" | "simple";
  setSupplierBillFormat: (format: "thermal" | "simple") => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSidebarHovered: boolean;
  setIsSidebarHovered: (isHovered: boolean) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerBillFormat, setCustomerBillFormat] = useState<"thermal" | "simple">("thermal");
  const [supplierBillFormat, setSupplierBillFormat] = useState<"thermal" | "simple">("simple");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Low Stock Alert", description: "5 products are running low on stock.", type: "inventory", isRead: false, date: "10 mins ago" },
    { id: "2", title: "New Order", description: "Ahmed Traders placed an order for RS 1,250.", type: "order", isRead: false, date: "1 hour ago" },
    { id: "3", title: "Payment Received", description: "Payment of RS 500 received from Zara Malik.", type: "customer", isRead: false, date: "3 hours ago" },
    { id: "4", title: "System Update", description: "Ledger System v2.1 has been installed successfully.", type: "system", isRead: true, date: "1 day ago" }
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: "C-001", name: "Ahmed Traders", phone: "+92 300 1234567", billed: 12450.00, paid: 10000.00, status: "Active" },
    { id: "C-002", name: "Ali Electronics", phone: "+92 321 7654321", billed: 3800.00, paid: 3800.00, status: "Active" },
    { id: "C-003", name: "Zara Imports", phone: "+92 333 9876543", billed: 45600.00, paid: 40000.00, status: "Active" },
    { id: "C-004", name: "Sana Hussain", phone: "+92 345 1122334", billed: 150.00, paid: 0.00, status: "Inactive" },
    { id: "C-005", name: "Bilal Ahmed", phone: "+92 300 5566778", billed: 8900.00, paid: 8900.00, status: "Active" },
    { id: "C-006", name: "Nadia Shah", phone: "+92 311 9988776", billed: 620.00, paid: 500.00, status: "Inactive" },
  ]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem("customersData");
      if (stored) {
        setCustomers(JSON.parse(stored));
      }
      const storedDate = localStorage.getItem("selectedDate");
      if (storedDate) {
        setSelectedDate(storedDate);
      }
    } catch (e) {
      console.error("Failed to load customers from local storage", e);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("customersData", JSON.stringify(customers));
      localStorage.setItem("selectedDate", selectedDate);
    }
  }, [customers, selectedDate, isClient]);

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, ...customer } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const t = (key: keyof typeof en): string => {
    return translations[language][key] as string || key as string;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, setLanguage, t, 
      selectedDate, setSelectedDate, 
      customerBillFormat, setCustomerBillFormat, 
      supplierBillFormat, setSupplierBillFormat, 
      isSidebarOpen, setIsSidebarOpen, 
      isSidebarHovered, setIsSidebarHovered,
      theme, setTheme,
      notifications, markNotificationAsRead, deleteNotification, clearAllNotifications,
      customers, addCustomer, updateCustomer, deleteCustomer
    }}>
      <div dir={language === 'ur' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
