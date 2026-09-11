"use client";

import { useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/LanguageContext";

const purchaseBills = [
  { id: "PB-1041", date: "2026-09-12", supplier: "TechCorp Ltd", amount: 1240.00, status: "Paid" },
  { id: "PB-1042", date: "2026-09-10", supplier: "Office Supplies Inc", amount: 450.00, status: "Pending" },
  { id: "PB-1043", date: "2026-09-08", supplier: "Prime Electronics", amount: 3120.00, status: "Paid" },
];

export default function PurchaseBillsPage() {
  const { t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [bills, setBills] = useState(purchaseBills);
  const [newBill, setNewBill] = useState({ supplier: "", amount: "" });

  const handleAddBill = () => {
    if (!newBill.supplier || !newBill.amount) return;
    const newEntry = {
      id: `PB-${1044 + bills.length}`,
      date: new Date().toISOString().split('T')[0],
      supplier: newBill.supplier,
      amount: parseFloat(newBill.amount),
      status: "Pending"
    };
    setBills([newEntry, ...bills]);
    setIsAddModalOpen(false);
    setNewBill({ supplier: "", amount: "" });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("purchaseBills")}</h1>
        <p className="text-sm text-slate-500 mt-1">Manage supplier purchase bills</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Purchase Bills</h2>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-semibold">
              <Plus size={16} className="mr-1" /> Add Bill
            </Button>
          </div>
          <div className="overflow-x-auto w-full">
            <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold text-slate-600">DATE</TableHead>
                <TableHead className="font-semibold text-slate-600">BILL ID</TableHead>
                <TableHead className="font-semibold text-slate-600">SUPPLIER</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right pr-8">AMOUNT</TableHead>
                <TableHead className="font-semibold text-slate-600">STATUS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => { setSelectedBill(bill); setIsDetailModalOpen(true); }}>
                  <TableCell className="text-slate-600">{bill.date}</TableCell>
                  <TableCell className="font-medium text-[var(--color-aqua)]">{bill.id}</TableCell>
                  <TableCell className="font-medium text-slate-900">{bill.supplier}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 pr-8">${bill.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={bill.status === 'Paid' ? 'bg-green-100 text-green-700 font-semibold' : 'bg-orange-100 text-orange-700 font-semibold'}>
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[var(--color-ocean-blue)]" onClick={(e) => { e.stopPropagation(); setSelectedBill(bill); setIsDetailModalOpen(true); }}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[var(--color-aqua)]">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Purchase Bill</DialogTitle>
            <DialogDescription>Enter the supplier and amount to record a new purchase bill.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier Name</label>
              <Input 
                value={newBill.supplier}
                onChange={(e) => setNewBill({...newBill, supplier: e.target.value})}
                placeholder="e.g. TechCorp Ltd" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount ($)</label>
              <Input 
                type="number"
                value={newBill.amount}
                onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                placeholder="0.00" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white" onClick={handleAddBill}>Add Bill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Purchase Bill Details</DialogTitle>
            <DialogDescription>Itemized view of this purchase bill.</DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Bill ID</span>
                  <p className="font-bold text-[var(--color-aqua)]">{selectedBill.id}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Supplier</span>
                  <p className="font-semibold text-slate-900">{selectedBill.supplier}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Date</span>
                  <p className="font-medium text-slate-700">{selectedBill.date}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Status</span>
                  <div>
                    <Badge variant="secondary" className={selectedBill.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                      {selectedBill.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>ITEM</TableHead>
                      <TableHead>QTY</TableHead>
                      <TableHead className="text-right">PRICE</TableHead>
                      <TableHead className="text-right">TOTAL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Product A</TableCell>
                      <TableCell>10</TableCell>
                      <TableCell className="text-right">$25.00</TableCell>
                      <TableCell className="text-right font-medium">$250.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Product B</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell className="text-right">$45.00</TableCell>
                      <TableCell className="text-right font-medium">$225.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t border-slate-200">
                <span className="text-slate-600 font-medium">Grand Total</span>
                <span className="text-2xl font-bold text-slate-900">${selectedBill.amount.toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter className="flex items-center gap-2 mt-2 sm:justify-between">
            <Button variant="outline" className="text-slate-600 border-slate-200" onClick={() => setIsDetailModalOpen(false)}>Edit Bill</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
              <Button className="bg-[var(--color-ocean-blue)] hover:bg-[var(--color-ocean-blue)]/90 text-white" onClick={() => setIsDetailModalOpen(false)}>Update Status</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
