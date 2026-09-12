"use client";

import { useState } from "react";
import { Search, Plus, FileText, CheckCircle2, Clock, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/lib/LanguageContext";

const initialPurchaseOrders = [
  { id: "PO-001", date: "10 Sep 2026", supplier: "Samsung Electronics Ltd", items: 45, status: "Paid", amount: 14250.00, paid: 14250.00 },
  { id: "PO-002", date: "12 Sep 2026", supplier: "Apple Distribution Inc", items: 120, status: "Pending", amount: 38000.00, paid: 15000.00 },
  { id: "PO-003", date: "14 Sep 2026", supplier: "Haier Appliances", items: 8, status: "Paid", amount: 4560.00, paid: 4560.00 },
  { id: "PO-004", date: "15 Sep 2026", supplier: "Anker Tech Solutions", items: 150, status: "Unpaid", amount: 1500.00, paid: 0.00 },
];

export default function SuppliersPage() {
  const { t } = useLanguage();
  const [pos, setPos] = useState(initialPurchaseOrders);
  const [activeTab, setActiveTab] = useState("All POs");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [createPOModal, setCreatePOModal] = useState(false);
  const [editPOModal, setEditPOModal] = useState(false);
  const [viewPOModal, setViewPOModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Form and selected item state
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [formData, setFormData] = useState({ supplier: "", items: 0, amount: 0, status: "Unpaid", paid: 0 });

  const filteredPOs = pos.filter(po => {
    const matchesTab = 
      activeTab === "All POs" || 
      (activeTab === "Paid" && po.status === "Paid") || 
      (activeTab === "Unpaid" && (po.status === "Unpaid" || po.status === "Pending"));
    const matchesSearch = 
      (po.supplier || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      po.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalOutstanding = filteredPOs.filter(po => po.status === "Unpaid").reduce((sum, po) => sum + po.amount, 0);
  const totalPending = filteredPOs.filter(po => po.status === "Pending").reduce((sum, po) => sum + po.amount, 0);
  const totalPaid = filteredPOs.filter(po => po.status === "Paid").reduce((sum, po) => sum + po.amount, 0);
  const aggregateTotal = filteredPOs.reduce((sum, po) => sum + po.amount, 0);

  const handleAddSubmit = () => {
    const newPO = {
      id: `PO-00${pos.length + 1}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      supplier: formData.supplier,
      items: formData.items,
      amount: formData.amount,
      paid: formData.paid,
      status: formData.status
    };
    setPos([newPO, ...pos]);
    setCreatePOModal(false);
    setFormData({ supplier: "", items: 0, amount: 0, status: "Unpaid", paid: 0 });
  };

  const handleEditSubmit = () => {
    setPos(pos.map(p => p.id === selectedPO.id ? { ...p, supplier: formData.supplier, items: formData.items, amount: formData.amount, paid: formData.paid, status: formData.status } : p));
    setEditPOModal(false);
  };

  const handleDeleteConfirm = () => {
    setPos(pos.filter(p => p.id !== selectedPO.id));
    setDeleteModal(false);
  };

  const openEdit = (p: any) => {
    setSelectedPO(p);
    setFormData({ supplier: p.supplier, items: p.items, amount: p.amount, paid: p.paid, status: p.status });
    setEditPOModal(true);
  };

  const openView = (p: any) => {
    setSelectedPO(p);
    setViewPOModal(true);
  };

  const openDelete = (p: any) => {
    setSelectedPO(p);
    setDeleteModal(true);
  };

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
          <Button 
            onClick={() => {
              setFormData({ supplier: "", items: 0, amount: 0, status: "Unpaid", paid: 0 });
              setCreatePOModal(true);
            }} 
            className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-semibold"
          >
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
                <h2 className="text-3xl font-bold text-slate-900">RS {totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
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
                <h2 className="text-3xl font-bold text-slate-900">RS {totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
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
                <h2 className="text-3xl font-bold text-slate-900">RS {totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
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
        <div className="overflow-x-auto w-full">
          <Table>
          <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold text-slate-600">PO REFERENCE</TableHead>
                <TableHead className="font-semibold text-slate-600">DATE</TableHead>
                <TableHead className="font-semibold text-slate-600">SUPPLIER</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">TOTAL ORDER AMOUNT</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">AMOUNT PAID</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">BALANCE PAYABLE</TableHead>
                <TableHead className="font-semibold text-slate-600 text-center">STATUS</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">ACTIONS</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.length > 0 ? (
              filteredPOs.map((po) => (
                <TableRow key={po.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-[var(--color-aqua)]">{po.id}</TableCell>
                  <TableCell className="text-slate-600">{po.date}</TableCell>
                  <TableCell className="font-medium text-slate-900">{po.supplier}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    ${po.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-600">
                    ${po.paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${po.amount - po.paid > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    ${(po.amount - po.paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
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
                      <Button onClick={() => openView(po)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--color-ocean-blue)]">
                        <Eye size={16} />
                      </Button>
                      <Button onClick={() => openEdit(po)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--color-aqua)]">
                        <Edit size={16} />
                      </Button>
                      <Button onClick={() => openDelete(po)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
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
              <Input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} placeholder="e.g. Samsung Electronics Ltd" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Items</label>
              <Input type="number" value={formData.items || ''} onChange={e => setFormData({...formData, items: Number(e.target.value)})} placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Amount</label>
              <Input type="number" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePOModal(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Create PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit PO Modal */}
      <Dialog open={editPOModal} onOpenChange={setEditPOModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Purchase Order</DialogTitle>
            <DialogDescription>
              Update the details for {selectedPO?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier Name</label>
              <Input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Total Amount</label>
                <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Paid</label>
                <Input type="number" value={formData.paid} onChange={e => setFormData({...formData, paid: Number(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-2">
                <Button onClick={() => setFormData({...formData, status: "Paid"})} variant={formData.status === "Paid" ? "default" : "outline"} className={formData.status === "Paid" ? "bg-green-600 hover:bg-green-700 text-white" : ""}>Paid</Button>
                <Button onClick={() => setFormData({...formData, status: "Pending"})} variant={formData.status === "Pending" ? "default" : "outline"} className={formData.status === "Pending" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}>Pending</Button>
                <Button onClick={() => setFormData({...formData, status: "Unpaid"})} variant={formData.status === "Unpaid" ? "default" : "outline"} className={formData.status === "Unpaid" ? "bg-red-600 hover:bg-red-700 text-white" : ""}>Unpaid</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPOModal(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Update PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View PO Details Modal */}
      <Dialog open={viewPOModal} onOpenChange={setViewPOModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Purchase Order Details</DialogTitle>
          </DialogHeader>
          {selectedPO && (
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-aqua)]">{selectedPO.id}</h3>
                  <p className="text-sm text-slate-500">{selectedPO.date}</p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`font-semibold ${
                    selectedPO.status === 'Paid' 
                      ? 'bg-green-100 text-green-700' 
                      : selectedPO.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedPO.status}
                </Badge>
              </div>
              <div className="space-y-1">
                 <p className="text-xs text-slate-500">Supplier</p>
                 <p className="font-bold text-slate-900">{selectedPO.supplier}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Total Items</p>
                  <p className="font-bold text-slate-900">{selectedPO.items}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                  <p className="font-bold text-slate-900">RS {selectedPO.amount.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Amount Paid</p>
                  <p className="font-bold text-green-600">RS {selectedPO.paid.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Balance Payable</p>
                  <p className="font-bold text-red-600">RS {(selectedPO.amount - selectedPO.paid).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewPOModal(false)}>Close</Button>
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
              Are you sure you want to delete PO <strong className="text-slate-900">{selectedPO?.id}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">Delete PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
