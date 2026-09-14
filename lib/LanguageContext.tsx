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

export interface Invoice {
  id: string; // e.g. INV-1001
  date: string;
  totalAmount: number;
  paidAmount: number;
  status: "Pending" | "Partial" | "Paid";
  items: any[];
}

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
  addInvoice: (customerId: string, invoice: Invoice) => void;
  receivePayment: (customerId: string, amount: number) => void;
  addExpense: (customerId: string, amount: number, description: string) => void;
  
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

  carts: Record<string, any[]>;
  setCarts: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
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

  const [carts, setCarts] = useState<Record<string, any[]>>({
    "C-001": [],
    "C-002": [
      { id: "P-103", name: "USB-C Hub Multi", price: 65.00, qty: 1, total: 65.00 },
    ],
  });
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>(["C-001"]);
  const [activeCustomerId, setActiveCustomerId] = useState<string>("C-001");

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

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: "S-001", name: "Samsung Electronics Ltd", phone: "+92 300 1112222", totalPurchases: 14250, paid: 14250, payable: 0, status: "Active" },
    { id: "S-002", name: "Apple Distribution Inc", phone: "+92 300 3334444", totalPurchases: 38000, paid: 15000, payable: 23000, status: "Active" }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "P-101", image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=65W", title: "Samsung 65W Charger", category: "Chargers", sku: "CHG-S65W", stock: 45, unitPrice: 25.00, sellingPrice: 45.00 },
    { id: "P-102", image: "https://placehold.co/80x80/f97316/FFFFFF?text=2M", title: "iPhone Cable 2M", category: "Cables", sku: "CBL-IP2M", stock: 8, unitPrice: 10.00, sellingPrice: 25.00 },
    { id: "P-103", image: "https://placehold.co/80x80/0B2545/FFFFFF?text=Hub", title: "USB-C Hub Multi", category: "Accessories", sku: "ACC-HUB", stock: 24, unitPrice: 35.00, sellingPrice: 65.00 },
    { id: "P-104", image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=20W", title: "Fast Charger 20W", category: "Chargers", sku: "CHG-F20W", stock: 12, unitPrice: 8.00, sellingPrice: 18.00 },
    { id: "P-105", image: "https://placehold.co/80x80/cbd5e1/FFFFFF?text=Stnd", title: "Phone Stand Adjustable", category: "Accessories", sku: "ACC-STND", stock: 0, unitPrice: 5.00, sellingPrice: 15.00 },
    { id: "P-106", image: "https://placehold.co/80x80/0B2545/FFFFFF?text=Case", title: "Silicone Case Pro", category: "Accessories", sku: "ACC-CASE", stock: 50, unitPrice: 3.00, sellingPrice: 12.00 },
    { id: "P-107", image: "https://placehold.co/80x80/f97316/FFFFFF?text=CtoC", title: "Type-C to Type-C 1M", category: "Cables", sku: "CBL-CTC1", stock: 14, unitPrice: 6.00, sellingPrice: 15.00 },
  ]);

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
      customers, addCustomer, updateCustomer, deleteCustomer, addInvoice, receivePayment, addExpense,
      suppliers, addSupplier, updateSupplier, deleteSupplier, addSupplierPurchase,
      receiveSupplierPayment,
      addSupplierExpense,
      inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, updateProductStock,
      carts, setCarts,
      selectedCustomerIds, setSelectedCustomerIds,
      activeCustomerId, setActiveCustomerId
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
