"use client";

import { useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/LanguageContext";
import { Badge } from "@/components/ui/badge";

const expenses = [
  { id: "EXP-01", date: "2026-09-15", description: "Freight", category: "Logistics", amount: 150.00 },
  { id: "EXP-02", date: "2026-09-14", description: "Office Supplies", category: "Admin", amount: 65.00 },
  { id: "EXP-03", date: "2026-09-10", description: "Utility Bill", category: "Utilities", amount: 210.00 },
];

export default function ExpensesPage() {
  const { t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [expenseList, setExpenseList] = useState(expenses);
  const [newExpense, setNewExpense] = useState({ description: "", category: "", amount: "" });

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) return;
    const newEntry = {
      id: `EXP-0${expenseList.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      description: newExpense.description,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount)
    };
    setExpenseList([newEntry, ...expenseList]);
    setIsAddModalOpen(false);
    setNewExpense({ description: "", category: "", amount: "" });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Expenses & Purchase Bills</h1>
        <p className="text-sm text-slate-500 mt-1">Manage operational expenses and supplier purchase bills</p>
      </div>



      <div className="grid grid-cols-1 gap-6">
        {/* Expenses */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Expenses</h2>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-semibold">
              <Plus size={16} className="mr-1" /> Add Expense
            </Button>
          </div>
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-600">DATE</TableHead>
                  <TableHead className="font-semibold text-slate-600">DESCRIPTION</TableHead>
                  <TableHead className="font-semibold text-slate-600">CATEGORY</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right pr-12">AMOUNT</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseList.map((expense) => (
                  <TableRow key={expense.id} className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => { setSelectedExpense(expense); setIsDetailModalOpen(true); }}>
                    <TableCell className="text-slate-600">{expense.date}</TableCell>
                    <TableCell className="font-medium text-slate-900">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right font-semibold text-slate-900 pr-12">RS {expense.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[var(--color-ocean-blue)]" onClick={(e) => { e.stopPropagation(); setSelectedExpense(expense); setIsDetailModalOpen(true); }}>
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
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Enter the details for the new expense.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                placeholder="e.g. Office Supplies" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input 
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                placeholder="e.g. Admin" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount ($)</label>
              <Input 
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                placeholder="0.00" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white" onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>Detailed view of this expense record.</DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">ID</span>
                <span className="font-medium text-slate-900">{selectedExpense.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Date</span>
                <span className="font-medium text-slate-900">{selectedExpense.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Description</span>
                <span className="font-medium text-slate-900">{selectedExpense.description}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Category</span>
                <span className="font-medium text-slate-900">{selectedExpense.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Amount</span>
                <span className="font-bold text-[var(--color-aqua)]">RS {selectedExpense.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Payment Method</span>
                <span className="font-medium text-slate-900">Cash</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Notes</span>
                <span className="font-medium text-slate-500 text-right max-w-[200px]">N/A</span>
              </div>
            </div>
          )}
          <DialogFooter className="flex items-center gap-2 mt-4 sm:justify-between">
            <Button variant="destructive" onClick={() => setIsDetailModalOpen(false)}>Delete</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
              <Button className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white" onClick={() => setIsDetailModalOpen(false)}>Edit Expense</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
