"use client";
import { useLanguage } from "@/lib/LanguageContext";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, DollarSign, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function CustomersPage() {
  const { t, customers, addCustomer, updateCustomer, deleteCustomer } = useLanguage();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  
  // Modals state
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [editCustomerModal, setEditCustomerModal] = useState(false);
  const [viewCustomerModal, setViewCustomerModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  
  // Form and selected item state
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", status: "Active" });

  const filteredCustomers = customers.filter(customer => {
    const matchesTab = activeTab === "All" || customer.status === activeTab;
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalRevenue = filteredCustomers.reduce((sum, c) => sum + (c.billed || 0), 0);
  const totalActive = filteredCustomers.filter(c => c.status === "Active").length;
  const totalOutstanding = filteredCustomers.reduce((sum, c) => sum + ((c.billed || 0) - (c.paid || 0)), 0); 

  const handleAddSubmit = () => {
    const newCustomer = {
      id: `C-00${customers.length + 1}`,
      name: formData.name,
      phone: formData.phone,
      billed: 0,
      paid: 0,
      status: formData.status
    };
    addCustomer(newCustomer);
    setAddCustomerModal(false);
    setFormData({ name: "", phone: "", status: "Active" });
  };

  const handleEditSubmit = () => {
    if (selectedCustomer) {
      updateCustomer({ ...selectedCustomer, name: formData.name, phone: formData.phone, status: formData.status });
    }
    setEditCustomerModal(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id);
    }
    setDeleteModal(false);
  };

  const openEdit = (c: any) => {
    setSelectedCustomer(c);
    setFormData({ name: c.name, phone: c.phone, status: c.status });
    setEditCustomerModal(true);
  };

  const openView = (c: any) => {
    setSelectedCustomer(c);
    setViewCustomerModal(true);
  };

  const openDelete = (c: any) => {
    setSelectedCustomer(c);
    setDeleteModal(true);
  };
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
          <Button 
            onClick={() => {
              setFormData({ name: "", phone: "", status: "Active" });
              setAddCustomerModal(true);
            }} 
            className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-semibold"
          >
            <Plus size={18} className="mr-2" /> Add New Customer
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Total Customer Revenue</p>
                <h2 className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div className="w-10 h-10 bg-[var(--color-aqua)]/10 text-[var(--color-aqua)] rounded-full flex items-center justify-center">
                <DollarSign size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Total Outstanding Receivables</p>
                <h2 className="text-3xl font-bold text-slate-900">${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              </div>
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <CreditCard size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">Total Active Customers</p>
                <h2 className="text-3xl font-bold text-slate-900">{totalActive}</h2>
              </div>
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Users size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
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
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="w-24 font-semibold text-slate-600">ID</TableHead>
                <TableHead className="font-semibold text-slate-600">CUSTOMER NAME</TableHead>
                <TableHead className="font-semibold text-slate-600">PHONE</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">TOTAL BILLED</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">AMOUNT PAID</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">BALANCE RECEIVABLE</TableHead>
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
                      <TableCell className="text-right font-medium text-slate-900">
                        ${(customer.billed || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-600">
                        ${(customer.paid || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${(customer.billed || 0) - (customer.paid || 0) > 0 ? 'text-orange-600' : 'text-slate-900'}`}>
                        ${((customer.billed || 0) - (customer.paid || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                          <Button onClick={() => openView(customer)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--color-ocean-blue)]">
                            <Eye size={16} />
                          </Button>
                          <Button onClick={() => openEdit(customer)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--color-aqua)]">
                            <Edit size={16} />
                          </Button>
                          <Button onClick={() => openDelete(customer)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500">
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
            Showing <strong className="text-slate-900">{filteredCustomers.length}</strong> of <strong className="text-slate-900">{customers.length}</strong> customers
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
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="e.g. +92 300 1234567" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-2">
                <Button onClick={() => setFormData({...formData, status: "Active"})} variant={formData.status === "Active" ? "default" : "outline"} className={formData.status === "Active" ? "bg-green-600 hover:bg-green-700" : ""}>Active</Button>
                <Button onClick={() => setFormData({...formData, status: "Inactive"})} variant={formData.status === "Inactive" ? "default" : "outline"} className={formData.status === "Inactive" ? "bg-slate-600 hover:bg-slate-700" : ""}>Inactive</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCustomerModal(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Save Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={editCustomerModal} onOpenChange={setEditCustomerModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Customer</DialogTitle>
            <DialogDescription>
              Update the details for {selectedCustomer?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-2">
                <Button onClick={() => setFormData({...formData, status: "Active"})} variant={formData.status === "Active" ? "default" : "outline"} className={formData.status === "Active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}>Active</Button>
                <Button onClick={() => setFormData({...formData, status: "Inactive"})} variant={formData.status === "Inactive" ? "default" : "outline"} className={formData.status === "Inactive" ? "bg-slate-600 hover:bg-slate-700 text-white" : ""}>Inactive</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCustomerModal(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Update Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer Details Modal */}
      <Dialog open={viewCustomerModal} onOpenChange={setViewCustomerModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <Avatar className="h-16 w-16 bg-[var(--color-ocean-blue)]/5">
                  <AvatarFallback className="text-[var(--color-ocean-blue)] font-bold text-xl bg-transparent">
                    {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-sm text-slate-500">{selectedCustomer.id} • {selectedCustomer.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Total Billed</p>
                  <p className="font-bold text-slate-900">${(selectedCustomer.billed || 0).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Amount Paid</p>
                  <p className="font-bold text-green-600">${(selectedCustomer.paid || 0).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-slate-500 mb-1">Outstanding Balance</p>
                  <p className="font-bold text-orange-600 text-lg">${((selectedCustomer.billed || 0) - (selectedCustomer.paid || 0)).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewCustomerModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600 flex items-center gap-2">
              <Trash2 size={20} /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <strong className="text-slate-900">{selectedCustomer?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
