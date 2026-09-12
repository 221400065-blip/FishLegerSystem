"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, ShoppingCart, Percent, Truck, MoreHorizontal } from "lucide-react";
import { SalesTrendsChart, TopCategoriesChart } from "@/components/dashboard/Charts";
import Link from "next/link";

const recentOrders = [
  { id: "ORD-738", customer: "Ahmed Traders", items: 4, payment: "Credit Card", total: "RS 245.00", status: "Completed" },
  { id: "ORD-739", customer: "Zara Imports", items: 12, payment: "Bank Transfer", total: "RS 380.00", status: "Pending" },
  { id: "ORD-740", customer: "Ali Electronics", items: 2, payment: "Cash", total: "RS 56.00", status: "Completed" },
  { id: "ORD-741", customer: "Sana Store", items: 8, payment: "Credit Card", total: "RS 190.50", status: "Processing" },
  { id: "ORD-742", customer: "Bilal Wholesale", items: 24, payment: "Wallet", total: "RS 1,240.00", status: "Pending" },
];

export default function DashboardPage() {
  const { t, selectedDate, customers } = useLanguage();
  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const [profitModalOpen, setProfitModalOpen] = useState(false);

  const metrics = {
    "Today": { sales: "RS 12,450", suppliers: 8, profit: "RS 3,240", salesChange: "+15% from yesterday", suppliersChange: "+2 active", profitChange: "+12% margin" },
    "This Week": { sales: "RS 84,300", suppliers: 12, profit: "RS 18,500", salesChange: "+8% from last week", suppliersChange: "Stable", profitChange: "+4% margin" },
    "This Month": { sales: "RS 320,500", suppliers: 15, profit: "RS 74,000", salesChange: "+22% from last month", suppliersChange: "+4 active", profitChange: "+8% margin" }
  };

  // Helper to determine the "time range key" for metrics & charts based on the selected date
  const getTimeFilterKey = (dateStr: string) => {
    if (!dateStr || dateStr.toLowerCase() === "today") return "Today";
    if (dateStr.toLowerCase() === "this week") return "This Week";
    if (dateStr.toLowerCase() === "this month") return "This Month";
    
    // If it's a date range
    if (dateStr.includes(" to ") || dateStr.includes("➔")) {
      const parts = dateStr.includes(" to ") ? dateStr.split(" to ") : dateStr.split("➔");
      const d1 = new Date(parts[0].trim());
      const d2 = new Date(parts[1].trim());
      
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Today";
        if (diffDays <= 7) return "This Week";
        return "This Month";
      }
      return "This Week";
    }
    
    // Single date
    return "Today";
  };

  const timeKey = getTimeFilterKey(selectedDate);
  const currentMetrics = metrics[timeKey as keyof typeof metrics] || metrics["Today"];

  // Date Range aur Single Date dono ko safely format karne ka function
  const formatDateHelper = (dateStr: string) => {
    if (!dateStr) return "SEP 11, 2026";

    // Agar Date Range Pass hui ho (e.g. "2026-08-31 to 2026-09-11")
    if (dateStr.includes(" to ") || dateStr.includes("➔")) {
      const parts = dateStr.includes(" to ") ? dateStr.split(" to ") : dateStr.split("➔");
      const d1 = new Date(parts[0].trim());
      const d2 = new Date(parts[1].trim());

      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const f1 = d1.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
        const f2 = d2.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
        return `${f1} - ${f2}`;
      }
    }

    // Agar Single Date Ho
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return dateStr;
  };

  const formattedDate = formatDateHelper(selectedDate);

  return (
    <div className="space-y-6">
      
      {/* Low Stock Alert Banner */}
      <Link href="/inventory" className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between hover:bg-orange-100 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <AlertTriangle className="text-orange-600" size={20} />
          </div>
          <div>
            <h3 className="text-orange-800 font-semibold text-sm">{t("inventoryAlert")}</h3>
            <p className="text-orange-600 text-sm mt-0.5">5 {t("productsLowStock")}</p>
          </div>
        </div>
        <span className="text-orange-700 text-sm font-semibold hover:underline">
          {t("viewAll")}
        </span>
      </Link>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => setSalesModalOpen(true)} className="cursor-pointer h-full">
          <Card className="rounded-xl shadow-sm border-slate-200 hover:border-[var(--color-aqua)] transition-colors h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-1">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-bold text-slate-500 uppercase whitespace-nowrap block text-[10px]" title={`SALES ON ${formattedDate}`}>SALES ON {formattedDate}</p>
                  <h2 className="text-3xl font-medium text-slate-900">{currentMetrics.sales}</h2>
                </div>
                <div className="w-8 h-8 bg-[var(--color-aqua)]/10 text-[var(--color-aqua)] rounded-full flex items-center justify-center shrink-0">
                  <DollarSign size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  {currentMetrics.salesChange}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Link href="/suppliers">
          <Card className="rounded-xl shadow-sm border-slate-200 hover:border-[var(--color-aqua)] transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-1">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-bold text-slate-500 uppercase whitespace-nowrap block text-[10px]" title="ACTIVE SUPPLIERS">ACTIVE SUPPLIERS</p>
                  <h2 className="text-3xl font-medium text-slate-900">{currentMetrics.suppliers}</h2>
                </div>
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                  <Truck size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  {currentMetrics.suppliersChange}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/customers">
          <Card className="rounded-xl shadow-sm border-slate-200 hover:border-[var(--color-aqua)] transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-1">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-bold text-slate-500 uppercase whitespace-nowrap block text-[10px]" title="ACTIVE CUSTOMERS">ACTIVE CUSTOMERS</p>
                  <h2 className="text-3xl font-medium text-slate-900">{customers.length}</h2>
                </div>
                <div className="w-8 h-8 bg-blue-100 text-[var(--color-ocean-blue)] rounded-full flex items-center justify-center shrink-0">
                  <ShoppingCart size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  Live Sync
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <div onClick={() => setProfitModalOpen(true)} className="cursor-pointer h-full">
          <Card className="rounded-xl shadow-sm border-slate-200 hover:border-[var(--color-aqua)] transition-colors h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-1">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-bold text-slate-500 uppercase whitespace-nowrap block text-[10px]" title={`PROFIT ON ${formattedDate}`}>PROFIT ON {formattedDate}</p>
                  <h2 className="text-3xl font-medium text-slate-900">{currentMetrics.profit}</h2>
                </div>
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <Percent size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  {currentMetrics.profitChange}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 rounded-xl shadow-sm border-slate-200">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-bold text-slate-900">Sales</CardTitle>
            <p className="text-sm text-slate-500">Revenue across all customers</p>
          </CardHeader>
          <CardContent>
            <SalesTrendsChart selectedDate={selectedDate} />
          </CardContent>
        </Card>

        <Card className="col-span-1 rounded-xl shadow-sm border-slate-200">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-bold text-slate-900">Low Stock Alerts</CardTitle>
            <p className="text-sm text-slate-500">Items needing reorder soon</p>
          </CardHeader>
          <CardContent>
             <TopCategoriesChart />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Dialog open={salesModalOpen} onOpenChange={setSalesModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sales Breakdown ({formattedDate})</DialogTitle>
            <DialogDescription>Detailed view of your sales metrics.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Total Sales</span>
              <span className="font-bold text-slate-900">{currentMetrics.sales}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-600">Received Amount</span>
              <span className="font-semibold text-green-600">RS {Number(currentMetrics.sales.replace(/[^0-9.-]+/g, '')) * 0.7}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Remaining Amount</span>
              <span className="font-semibold text-red-600">RS {Number(currentMetrics.sales.replace(/[^0-9.-]+/g, '')) * 0.3}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={profitModalOpen} onOpenChange={setProfitModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profit Breakdown ({formattedDate})</DialogTitle>
            <DialogDescription>Detailed view of your profit margins.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Total Profit</span>
              <span className="font-bold text-green-600">{currentMetrics.profit}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}