"use client";

import { useState } from "react";
import { Search, Plus, FileText, CheckCircle2, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/lib/LanguageContext";

const allPurchaseOrders = [
  { id: "PO-001", date: "10 Sep 2026", supplier: "Samsung Electronics Ltd", items: 45, status: "Paid", amount: 14250.00 },
  { id: "PO-002", date: "12 Sep 2026", supplier: "Apple Distribution Inc", items: 120, status: "Pending", amount: 38000.00 },
  { id: "PO-003", date: "14 Sep 2026", supplier: "Haier Appliances", items: 8, status: "Paid", amount: 4560.00 },
  { id: "PO-004", date: "15 Sep 2026", facility: "Anker Tech Solutions", items: 150, status: "Unpaid", amount: 1500.00 },
];

export default function SuppliersPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("All POs");
  const [searchQuery, setSearchQuery] = useState("");
  const [createPOModal, setCreatePOModal] = useState(false);

  const filteredPOs = allPurchaseOrders.filter(po => {
    const matchesTab = 
      activeTab === "All POs" || 
      (activeTab === "Paid" && po.status === "Paid") || 
      (activeTab === "Unpaid" && (po.status === "Unpaid" || po.status === "Pending"));
    const matchesSearch = 
      (po.supplier || po.facility || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      po.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supplier Billing & Purchase Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Manage wholesale purchases, dues, and supplier records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-slate-200">
            Export Reports
          </Button>
          <Button onClick={() => setCreatePOModal(true)} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-semibold">
            <Plus size={18} className="mr-2" /> Create PO
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          onClick={() => setActiveTab("Unpaid")}
          className={`rounded-xl shadow-sm border-slate-200 cursor-pointer transition-all ${activeTab === "Unpaid" ? "ring-2 ring-[var(--color-aqua)]" : "hover:border-[var(--color-aqua)]"}`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Total Outstanding Dues</p>
                <h2 className="text-3xl font-bold text-slate-900">$84,950.00</h2>
              </div>
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <Clock size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          onClick={() => setActiveTab("Unpaid")}
          className={`rounded-xl shadow-sm border-slate-200 cursor-pointer transition-all ${activeTab === "Unpaid" ? "ring-2 ring-[var(--color-aqua)]" : "hover:border-[var(--color-aqua)]"}`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Total Pending Invoices</p>
                <h2 className="text-3xl font-bold text-slate-900">$14,230.00</h2>
              </div>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <FileText size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => setActiveTab("Paid")}
          className={`rounded-xl shadow-sm border-slate-200 cursor-pointer transition-all ${activeTab === "Paid" ? "ring-2 ring-[var(--color-aqua)]" : "hover:border-[var(--color-aqua)]"}`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Paid this month</p>
                <h2 className="text-3xl font-bold text-slate-900">$18,450.00</h2>
              </div>
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {["All POs", "Paid", "Unpaid"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === tab 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            type="text" 
            placeholder="Search POs..." 
            className="pl-10 pr-4 bg-slate-50 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-semibold text-slate-600">PO REFERENCE</TableHead>
              <TableHead className="font-semibold text-slate-600">DATE</TableHead>
              <TableHead className="font-semibold text-slate-600">SUPPLIER</TableHead>
              <TableHead className="text-center font-semibold text-slate-600">ITEMS</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">AMOUNT</TableHead>
              <TableHead className="font-semibold text-slate-600">STATUS</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.length > 0 ? (
              filteredPOs.map((po) => (
                <TableRow key={po.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-[var(--color-aqua)]">{po.id}</TableCell>
                  <TableCell className="text-slate-600">{po.date}</TableCell>
                  <TableCell className="font-medium text-slate-900">{po.supplier || po.facility}</TableCell>
                  <TableCell className="text-center text-slate-600">{po.items} items</TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    ${po.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`font-semibold ${
                        po.status === 'Paid' 
                          ? 'bg-green-100 text-green-700' 
                          : po.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {po.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--color-aqua)]">
                        <FileText size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                  No purchase orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createPOModal} onOpenChange={setCreatePOModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Purchase Order</DialogTitle>
            <DialogDescription>
              Create a new PO for a supplier.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier Name</label>
              <Input placeholder="e.g. Samsung Electronics Ltd" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Items</label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Amount</label>
              <Input type="number" placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePOModal(false)}>Cancel</Button>
            <Button onClick={() => setCreatePOModal(false)} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Create PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
