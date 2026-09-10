"use client";

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
  return (
    <div className="space-y-6">
      
      {/* Low Stock Alert Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <AlertTriangle className="text-orange-600" size={20} />
          </div>
          <div>
            <h3 className="text-orange-800 font-semibold text-sm">Inventory Alert</h3>
            <p className="text-orange-600 text-sm mt-0.5">5 products are running low on stock</p>
          </div>
        </div>
        <Link href="/inventory" className="text-orange-700 text-sm font-semibold hover:underline">
          View All &rarr;
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Daily Revenue</p>
                <h2 className="text-3xl font-bold text-slate-900">$12,450</h2>
              </div>
              <div className="w-10 h-10 bg-[var(--color-aqua)]/10 text-[var(--color-aqua)] rounded-full flex items-center justify-center">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                +12% today
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Orders</p>
                <h2 className="text-3xl font-bold text-slate-900">340</h2>
              </div>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                +24 new today
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Commissions</p>
                <h2 className="text-3xl font-bold text-slate-900">$1,280</h2>
              </div>
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <Percent size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs font-medium text-slate-500">
                Across 8 customers
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Suppliers</p>
                <h2 className="text-3xl font-bold text-slate-900">24</h2>
              </div>
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <Truck size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs font-medium text-slate-500">
                2 new this month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 rounded-xl shadow-sm border-slate-200">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-bold text-slate-900">Sales Trends</CardTitle>
            <p className="text-sm text-slate-500">Revenue across all customers</p>
          </CardHeader>
          <CardContent>
            <SalesTrendsChart />
          </CardContent>
        </Card>

        <Card className="col-span-1 rounded-xl shadow-sm border-slate-200">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-bold text-slate-900">Top Selling Categories</CardTitle>
            <p className="text-sm text-slate-500">Based on volume</p>
          </CardHeader>
          <CardContent>
             <TopCategoriesChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Data Table */}
      <Card className="rounded-xl shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Recent Orders</CardTitle>
            <p className="text-sm text-slate-500">Latest transactions from POS</p>
          </div>
          <Link href="/pos" className="text-sm font-medium text-[var(--color-aqua)] hover:underline">
            View All Orders
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold text-slate-600">ORDER ID</TableHead>
                <TableHead className="font-semibold text-slate-600">CUSTOMER NAME</TableHead>
                <TableHead className="font-semibold text-slate-600">ITEMS</TableHead>
                <TableHead className="font-semibold text-slate-600">PAYMENT METHOD</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">TOTAL</TableHead>
                <TableHead className="font-semibold text-slate-600">STATUS</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-slate-900">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="text-slate-500">{order.payment}</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">{order.total}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-semibold border-0
                      ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                      ${order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : ''}
                      ${order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : ''}
                    `}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-slate-400 hover:text-slate-900">
                      <MoreHorizontal size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
    </div>
  );
}
