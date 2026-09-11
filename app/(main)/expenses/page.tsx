"use client";

import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
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
                  <TableRow key={expense.id}>
                    <TableCell className="text-slate-600">{expense.date}</TableCell>
                    <TableCell className="font-medium text-slate-900">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right font-semibold text-slate-900 pr-12">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-900 bg-slate-900 rounded-md text-white hover:bg-slate-800 hover:text-white">
                        <MoreHorizontal size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
    </div>
  );
}
