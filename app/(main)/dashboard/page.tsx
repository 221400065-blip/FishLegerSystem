"use client";
import { useLanguage } from "@/lib/LanguageContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, ShoppingCart, Percent, Truck, MoreHorizontal } from "lucide-react";
import { SalesTrendsChart, TopCategoriesChart } from "@/components/dashboard/Charts";
import Link from "next/link";

const recentOrders = [
  { id: "ORD-738", customer: "Ahmed Traders", items: 4, payment: "Credit Card", total: "$245.00", status: "Completed" },
  { id: "ORD-739", customer: "Zara Imports", items: 12, payment: "Bank Transfer", total: "$380.00", status: "Pending" },
  { id: "ORD-740", customer: "Ali Electronics", items: 2, payment: "Cash", total: "$56.00", status: "Completed" },
  { id: "ORD-741", customer: "Sana Store", items: 8, payment: "Credit Card", total: "$190.50", status: "Processing" },
  { id: "ORD-742", customer: "Bilal Wholesale", items: 24, payment: "Wallet", total: "$1,240.00", status: "Pending" },
];

export default function DashboardPage() {
  const { t, timeFilter } = useLanguage();

  const metrics = {
    "Today": { sales: "$12,450", suppliers: 8, profit: "$3,240", salesChange: "+15% from yesterday", suppliersChange: "+2 active", profitChange: "+12% margin" },
    "This Week": { sales: "$84,300", suppliers: 12, profit: "$18,500", salesChange: "+8% from last week", suppliersChange: "Stable", profitChange: "+4% margin" },
    "This Month": { sales: "$320,500", suppliers: 15, profit: "$74,000", salesChange: "+22% from last month", suppliersChange: "+4 active", profitChange: "+8% margin" }
  };

  const currentMetrics = metrics[timeFilter as keyof typeof metrics] || metrics["Today"];
  
  const getHeaderPrefix = () => {
    if (timeFilter === "This Week") return "THIS WEEK'S";
    if (timeFilter === "This Month") return "THIS MONTH'S";
    return "TODAY'S";
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Link href="/reports">
          <Card className="rounded-xl shadow-sm border-slate-200 hover:border-[var(--color-aqua)] transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{getHeaderPrefix()} SALES</p>
                  <h2 className="text-3xl font-bold text-slate-900">{currentMetrics.sales}</h2>
                </div>
                <div className="w-10 h-10 bg-[var(--color-aqua)]/10 text-[var(--color-aqua)] rounded-full flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  {currentMetrics.salesChange}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/suppliers">
          <Card className="rounded-xl shadow-sm border-slate-200 hover:border-[var(--color-aqua)] transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">ACTIVE SUPPLIERS</p>
                  <h2 className="text-3xl font-bold text-slate-900">{currentMetrics.suppliers}</h2>
                </div>
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <Truck size={20} />
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

        <Link href="/reports">
          <Card className="rounded-xl shadow-sm border-slate-200 hover:border-[var(--color-aqua)] transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{getHeaderPrefix()} PROFIT</p>
                  <h2 className="text-3xl font-bold text-slate-900">{currentMetrics.profit}</h2>
                </div>
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Percent size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  {currentMetrics.profitChange}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 rounded-xl shadow-sm border-slate-200">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-bold text-slate-900">{t("salesTrends")}</CardTitle>
            <p className="text-sm text-slate-500">{t("revenueAcrossCustomers")}</p>
          </CardHeader>
          <CardContent>
            <SalesTrendsChart timeFilter={timeFilter} />
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


      
    </div>
  );
}
