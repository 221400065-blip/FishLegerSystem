"use client";
import { useLanguage } from "@/lib/LanguageContext";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const allCustomers = [
  { id: "C-001", name: "Ahmed Khan", phone: "+92 300 1234567", orders: 45, spent: 12450.00, commission: 8, status: "Active" },
  { id: "C-002", name: "Ali Raza", phone: "+92 321 7654321", orders: 12, spent: 3800.00, commission: 5, status: "Active" },
  { id: "C-003", name: "Zara Malik", phone: "+92 333 9876543", orders: 89, spent: 45600.00, commission: 10, status: "Active" },
  { id: "C-004", name: "Sana Hussain", phone: "+92 345 1122334", orders: 2, spent: 150.00, commission: 0, status: "Inactive" },
  { id: "C-005", name: "Bilal Ahmed", phone: "+92 300 5566778", orders: 34, spent: 8900.00, commission: 7, status: "Active" },
  { id: "C-006", name: "Nadia Shah", phone: "+92 311 9988776", orders: 5, spent: 620.00, commission: 2, status: "Inactive" },
];

export default function CustomersPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [addCustomerModal, setAddCustomerModal] = useState(false);

  const filteredCustomers = allCustomers.filter(customer => {
    const matchesTab = activeTab === "All" || customer.status === activeTab;
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Directory & Billing Accounts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your customer accounts and their billing status</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-[var(--color-aqua)]/10 text-[var(--color-ocean-blue)] text-sm px-3 py-1">
            {filteredCustomers.length} Total
          </Badge>
          <Button onClick={() => setAddCustomerModal(true)} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-semibold">
            <Plus size={18} className="mr-2" /> Add New Customer
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            type="text" 
            placeholder="Search customers by name or ID..." 
            className="pl-10 pr-4 bg-slate-50 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {["All", "Active", "Inactive"].map(tab => (
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
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="w-24 font-semibold text-slate-600">ID</TableHead>
                <TableHead className="font-semibold text-slate-600">CUSTOMER NAME</TableHead>
                <TableHead className="font-semibold text-slate-600">PHONE</TableHead>
                <TableHead className="text-center font-semibold text-slate-600">TOTAL ORDERS</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">TOTAL SPENT</TableHead>
                <TableHead className="text-center font-semibold text-slate-600">{t("status").toUpperCase()}</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">{t("actions").toUpperCase()}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  return (
                    <TableRow key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-500">{customer.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 bg-[var(--color-ocean-blue)]/5">
                            <AvatarFallback className="text-[var(--color-ocean-blue)] font-bold text-xs bg-transparent">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-slate-900">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{customer.phone}</TableCell>
                      <TableCell className="text-center font-medium text-slate-900">{customer.orders}</TableCell>
                      <TableCell className="text-right font-semibold text-slate-900">
                        ${customer.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="secondary" 
                          className={`font-semibold ${
                            customer.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--color-aqua)]">
                            <Edit size={16} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                    No customers found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredCustomers.length}</strong> of <strong className="text-slate-900">{allCustomers.length}</strong> customers
          </p>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" size="icon" 
              className="h-8 w-8 bg-white border-slate-200 text-slate-400 disabled:opacity-50" 
              disabled={activePage === 1}
              onClick={() => setActivePage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </Button>
            {[1, 2, 3].map(page => (
              <Button 
                key={page}
                variant="outline" 
                onClick={() => setActivePage(page)}
                className={`h-8 w-8 p-0 ${
                  activePage === page 
                    ? "bg-[var(--color-aqua)] border-[var(--color-aqua)] text-white hover:bg-[var(--color-aqua)]/90 hover:text-white" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button 
              variant="outline" size="icon" 
              className="h-8 w-8 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              disabled={activePage === 3}
              onClick={() => setActivePage(p => Math.min(3, p + 1))}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={addCustomerModal} onOpenChange={setAddCustomerModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the customer details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input placeholder="e.g. +92 300 1234567" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Button>
                <Button variant="outline" className="bg-slate-50 text-slate-600">Inactive</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCustomerModal(false)}>Cancel</Button>
            <Button onClick={() => setAddCustomerModal(false)} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Save Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
