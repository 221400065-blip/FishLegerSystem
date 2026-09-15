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
  billing: "Today's Billing",
  customerBilling: "Customer Billing",
  supplierBilling: "Supplier Billing",
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
  billing: "آج کی بلنگ",
  customerBilling: "گاہک کی بلنگ",
  supplierBilling: "سپلائر کی بلنگ",
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

export interface InventoryItem {
  id: string;
  image: string;
  title: string;
  category: string;
  sku: string;
  stock: number;
  unitPrice: number;
  sellingPrice: number;
}

export interface SupplierPurchase {
  id: string;
  date: string;
  items: number;
  totalAmount: number;
  paidAmount: number;
  status: "Pending" | "Paid" | "Unpaid" | "Partial";
  products: any[];
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  paid: number;
  payable: number;
  status: string;
  ledger?: LedgerEntry[];
  purchases?: SupplierPurchase[];
}

export type Invoice = { 
  id: string; 
  date: string; 
  totalAmount: number; 
  paidAmount: number; 
  status: "Paid" | "Pending" | "Overdue" | "Partial"; 
  items: any[]; 
  sessionClosed?: boolean;
};

export interface LedgerEntry {
  id: string;
  date: string;
  refNo: string;
  type: "Sale Invoice" | "Payment Recv" | "Expense Entry" | "Purchase PO" | "Payment Sent";
  description: string;
  debit: number;
  credit: number;
  expense: number;
  balance: number;
}

export type Customer = { 
  id: string; 
  name: string; 
  phone?: string; 
  whatsapp?: string;
  email?: string; 
  address?: string; 
  billed?: number; 
  paid?: number; 
  status?: string; 
  creditLimit?: number; 
  creditPeriod?: string;
  cnic?: string;
  businessName?: string;
  notes?: string;
  openingBalanceType?: "Debit" | "Credit";
  invoices?: Invoice[]; 
  ledger?: LedgerEntry[]; 
  createdAt?: string; 
};

export interface BillingFeedItem {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  name: string;
  price: number | string;
  qty: number | string;
  total: number;
  timestamp: number;
  isRestored?: boolean;
}

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
  addNotification: (notification: Omit<Notification, "id" | "isRead" | "date">) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addInvoice: (customerId: string, invoice: Invoice) => void;
  receivePayment: (customerId: string, amount: number) => void;
  addExpense: (customerId: string, amount: number, description: string) => void;
  settleDailySession: (customerId: string) => void;
  
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  addSupplierPurchase: (supplierId: string, purchase: SupplierPurchase) => void;
  receiveSupplierPayment: (supplierId: string, amount: number) => void;
  addSupplierExpense: (supplierId: string, amount: number, description: string) => void;

  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  updateProductStock: (productId: string, qty: number) => void;

  billingFeed: BillingFeedItem[];
  setBillingFeed: React.Dispatch<React.SetStateAction<BillingFeedItem[]>>;
  selectedCustomerIds: string[];
  setSelectedCustomerIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeCustomerId: string;
  setActiveCustomerId: (id: string) => void;
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

  const [billingFeed, setBillingFeed] = useState<BillingFeedItem[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [activeCustomerId, setActiveCustomerId] = useState<string>("");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem("customersData");
      if (stored) {
        setCustomers(JSON.parse(stored));
      }
      const storedSuppliers = localStorage.getItem("suppliersData");
      if (storedSuppliers) {
        setSuppliers(JSON.parse(storedSuppliers));
      }
      const storedInventory = localStorage.getItem("inventoryData");
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
      const storedCustFormat = localStorage.getItem("customerBillFormat");
      if (storedCustFormat) {
        setCustomerBillFormat(storedCustFormat as "thermal" | "simple");
      }
      const storedSuppFormat = localStorage.getItem("supplierBillFormat");
      if (storedSuppFormat) {
        setSupplierBillFormat(storedSuppFormat as "thermal" | "simple");
      }
    } catch (e) {
      console.error("Failed to load data from local storage", e);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("customersData", JSON.stringify(customers));
      localStorage.setItem("suppliersData", JSON.stringify(suppliers));
      localStorage.setItem("inventoryData", JSON.stringify(inventory));
      localStorage.setItem("customerBillFormat", customerBillFormat);
      localStorage.setItem("supplierBillFormat", supplierBillFormat);
    }
  }, [customers, suppliers, inventory, customerBillFormat, supplierBillFormat, isClient]);

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const settleDailySession = (customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      const todayStr = new Date().toISOString().split('T')[0];
      const updatedInvoices = c.invoices?.map(inv => {
        if (inv.date.startsWith(todayStr)) {
          return { ...inv, sessionClosed: true };
        }
        return inv;
      }) || [];
      return { ...c, invoices: updatedInvoices };
    }));
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, ...customer } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addInvoice = (customerId: string, invoice: Invoice) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const currentBilled = c.billed || 0;
        const currentPaid = c.paid || 0;
        const currentBalance = currentBilled - currentPaid;
        const newBalance = currentBalance + invoice.totalAmount;
        
        // Build description string from items e.g., "2x Samsung 65W, 1x iPhone Cable"
        const itemsDescription = invoice.items.length > 0
          ? invoice.items.map(item => `${item.qty}x ${item.name}`).join(", ")
          : "Products Purchased";

        const newLedgerEntry: LedgerEntry = {
          id: `L-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          date: invoice.date || new Date().toISOString(),
          refNo: invoice.id,
          type: "Sale Invoice",
          description: itemsDescription,
          debit: invoice.totalAmount,
          credit: 0,
          expense: 0,
          balance: newBalance
        };

        return {
          ...c,
          billed: currentBilled + invoice.totalAmount,
          invoices: [...(c.invoices || []), invoice],
          ledger: [...(c.ledger || []), newLedgerEntry]
        };
      }
      return c;
    }));
  };

  const receivePayment = (customerId: string, amount: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const currentBilled = c.billed || 0;
        const currentPaid = c.paid || 0;
        const currentBalance = currentBilled - currentPaid;
        const newBalance = currentBalance - amount;
        
        const newLedgerEntry: LedgerEntry = {
          id: `L-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          date: new Date().toISOString(),
          refNo: `PAY-${Date.now().toString().slice(-4)}`,
          type: "Payment Recv",
          description: "Payment Received",
          debit: 0,
          credit: amount,
          expense: 0,
          balance: newBalance
        };

        let remainingAmount = amount;
        const updatedInvoices = (c.invoices || []).map(inv => {
          if (remainingAmount > 0 && inv.status !== "Paid") {
            const pendingForInvoice = inv.totalAmount - inv.paidAmount;
            if (pendingForInvoice > 0) {
              const amountToApply = Math.min(pendingForInvoice, remainingAmount);
              remainingAmount -= amountToApply;
              const newPaid = inv.paidAmount + amountToApply;
              return {
                ...inv,
                paidAmount: newPaid,
                status: (newPaid >= inv.totalAmount ? "Paid" : "Partial") as "Paid" | "Partial"
              };
            }
          }
          return inv;
        });

        return {
          ...c,
          paid: currentPaid + amount,
          invoices: updatedInvoices,
          ledger: [...(c.ledger || []), newLedgerEntry]
        };
      }
      return c;
    }));
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
  };

  const updateSupplier = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === supplier.id ? { ...s, ...supplier } : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const addSupplierPurchase = (supplierId: string, purchase: SupplierPurchase) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        const currentTotal = s.totalPurchases || 0;
        const currentPaid = s.paid || 0;
        const currentBalance = s.payable || (currentTotal - currentPaid);
        const newBalance = currentBalance + purchase.totalAmount;

        const itemsDescription = purchase.products.length > 0
          ? purchase.products.map(item => `${item.qty}x ${item.name}`).join(", ")
          : "Products Restocked";

        const newLedgerEntry: LedgerEntry = {
          id: `L-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          date: purchase.date || new Date().toISOString(),
          refNo: purchase.id,
          type: "Purchase PO",
          description: itemsDescription,
          debit: 0,
          credit: purchase.totalAmount, // Purchase adds to credit (what we owe)
          expense: 0,
          balance: newBalance
        };

        return {
          ...s,
          totalPurchases: currentTotal + purchase.totalAmount,
          payable: newBalance,
          purchases: [...(s.purchases || []), purchase],
          ledger: [...(s.ledger || []), newLedgerEntry]
        };
      }
      return s;
    }));
  };

  const receiveSupplierPayment = (supplierId: string, amount: number) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        const currentTotal = s.totalPurchases || 0;
        const currentPaid = s.paid || 0;
        const currentBalance = s.payable || (currentTotal - currentPaid);
        const newBalance = currentBalance - amount;

        const newLedgerEntry: LedgerEntry = {
          id: `L-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          date: new Date().toISOString(),
          refNo: `PAY-${Date.now().toString().slice(-4)}`,
          type: "Payment Sent",
          description: "Payment to Supplier",
          debit: amount,
          credit: 0,
          expense: 0,
          balance: newBalance
        };

        let remainingAmount = amount;
        const updatedPurchases = (s.purchases || []).map(p => {
          if (remainingAmount > 0 && p.status !== "Paid") {
            const pendingForPurchase = p.totalAmount - p.paidAmount;
            if (pendingForPurchase > 0) {
              const amountToApply = Math.min(pendingForPurchase, remainingAmount);
              remainingAmount -= amountToApply;
              const newPaid = p.paidAmount + amountToApply;
              return {
                ...p,
                paidAmount: newPaid,
                status: (newPaid >= p.totalAmount ? "Paid" : "Partial") as "Paid" | "Partial" | "Unpaid"
              };
            }
          }
          return p;
        });

        return {
          ...s,
          paid: currentPaid + amount,
          payable: newBalance,
          purchases: updatedPurchases,
          ledger: [...(s.ledger || []), newLedgerEntry]
        };
      }
      return s;
    }));
  };

  const addSupplierExpense = (supplierId: string, amount: number, description: string) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        const currentTotal = s.totalPurchases || 0;
        const currentPaid = s.paid || 0;
        const currentBalance = s.payable || (currentTotal - currentPaid);
        const newBalance = currentBalance + amount;

        const newLedgerEntry: LedgerEntry = {
          id: `L-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          date: new Date().toISOString(),
          refNo: `EXP-${Date.now().toString().slice(-4)}`,
          type: "Expense Entry",
          description: description,
          debit: 0,
          credit: 0,
          expense: amount,
          balance: newBalance
        };

        return {
          ...s,
          payable: newBalance,
          ledger: [...(s.ledger || []), newLedgerEntry]
        };
      }
      return s;
    }));
  };

  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [item, ...prev]);
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === item.id ? { ...i, ...item } : i));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const updateProductStock = (productId: string, qtyToAdd: number) => {
    setInventory(prev => prev.map(i => i.id === productId ? { ...i, stock: i.stock + qtyToAdd } : i));
  };

  const addExpense = (customerId: string, amount: number, description: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const currentBilled = c.billed || 0;
        const currentPaid = c.paid || 0;
        const currentBalance = currentBilled - currentPaid;
        const newBalance = currentBalance + amount;
        
        const newLedgerEntry: LedgerEntry = {
          id: `L-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          date: new Date().toISOString(),
          refNo: `EXP-${Date.now().toString().slice(-4)}`,
          type: "Expense Entry",
          description: description,
          debit: 0,
          credit: 0,
          expense: amount,
          balance: newBalance
        };

        return {
          ...c,
          billed: currentBilled + amount, 
          ledger: [...(c.ledger || []), newLedgerEntry]
        };
      }
      return c;
    }));
  };

  const addNotification = (notification: Omit<Notification, "id" | "isRead" | "date">) => {
    setNotifications(prev => [{
      ...notification,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      isRead: false,
      date: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }, ...prev]);
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
      notifications, addNotification, markNotificationAsRead, deleteNotification, clearAllNotifications,
      customers, addCustomer, updateCustomer, deleteCustomer, addInvoice, receivePayment, addExpense, settleDailySession,
      suppliers, addSupplier, updateSupplier, deleteSupplier, addSupplierPurchase,
      receiveSupplierPayment,
      addSupplierExpense,
      inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, updateProductStock,
      billingFeed, setBillingFeed,
      selectedCustomerIds, setSelectedCustomerIds,
      activeCustomerId, setActiveCustomerId
    }}>
      <div dir="ltr">
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
