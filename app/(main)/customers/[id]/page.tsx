"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { ChevronLeft, Plus, DollarSign, CreditCard, Clock, Activity, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CustomerLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { customers, receivePayment } = useLanguage();
  
  const customer = customers.find(c => c.id === resolvedParams.id);
  
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-xl font-semibold text-slate-700">Customer not found</h2>
        <Button onClick={() => router.push('/customers')} variant="outline">Back to Customers</Button>
      </div>
    );
  }

  const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const outstanding = (customer.billed || 0) - (customer.paid || 0);

  const pendingInvoices = (customer.invoices || []).filter(inv => inv.status !== "Paid");

  const handlePaymentSubmit = () => {
    const amt = parseFloat(paymentAmount);
    if (!amt || isNaN(amt) || amt <= 0) return;
    
    receivePayment(customer.id, amt, selectedInvoices);
    setPaymentModalOpen(false);
    setPaymentAmount("");
    setSelectedInvoices([]);
  };

  const toggleInvoiceSelect = (invId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invId) ? prev.filter(id => id !== invId) : [...prev, invId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/customers')} className="shrink-0 mt-1">
            <ChevronLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Avatar className="h-10 w-10 bg-[var(--color-ocean-blue)]/10 text-[var(--color-ocean-blue)]">
                <AvatarFallback className="font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="font-medium text-[var(--color-aqua)]">{customer.id}</span>
                  {customer.phone && <span>• {customer.phone}</span>}
                  {customer.address && <span>• {customer.address}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => setPaymentModalOpen(true)}
          className="bg-[var(--color-ocean-blue)] hover:bg-[var(--color-ocean-blue)]/90 text-white font-bold h-11 px-6 shadow-md"
        >
          <Plus size={18} className="mr-2" /> Receive Payment (Ughari)
        </Button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase">Total Sales (Kul Kharidari)</p>
              <h3 className="text-2xl font-bold text-slate-900">RS {(customer.billed || 0).toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Activity size={20} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase">Total Paid (Vasool Shuda)</p>
              <h3 className="text-2xl font-bold text-green-600">RS {(customer.paid || 0).toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-slate-200 border-l-4 border-l-orange-500">
          <CardContent className="p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase">Outstanding Dues (Baqaya)</p>
              <h3 className="text-2xl font-bold text-orange-600">RS {outstanding.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <Clock size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-slate-200 bg-slate-50/50">
          <CardContent className="p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase">Allowed Credit Limit</p>
              <h3 className="text-xl font-bold text-slate-700">RS {(customer.creditLimit || 50000).toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center">
              <CreditCard size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ledger Master Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-[var(--color-aqua)]" /> Ledger Master Feed
          </h2>
        </div>
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold text-slate-600 whitespace-nowrap">DATE & TIME</TableHead>
                <TableHead className="font-semibold text-slate-600">REF #</TableHead>
                <TableHead className="font-semibold text-slate-600">TYPE</TableHead>
                <TableHead className="font-semibold text-slate-600">DESCRIPTION</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">DEBIT (+)</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">CREDIT (-)</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">EXPENSE</TableHead>
                <TableHead className="text-right font-bold text-slate-900">BALANCE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(customer.ledger && customer.ledger.length > 0) ? (
                customer.ledger.slice().reverse().map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                      {new Date(entry.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">{entry.refNo}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`
                        ${entry.type === 'Sale Invoice' ? 'bg-blue-100 text-blue-700' : ''}
                        ${entry.type === 'Payment Recv' ? 'bg-green-100 text-green-700' : ''}
                        ${entry.type === 'Expense Entry' ? 'bg-orange-100 text-orange-700' : ''}
                      `}>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{entry.description}</TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {entry.debit > 0 ? `RS ${entry.debit.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {entry.credit > 0 ? `RS ${entry.credit.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-orange-600">
                      {entry.expense > 0 ? `RS ${entry.expense.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      RS {entry.balance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                    No ledger entries found for this customer.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Receive Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Receive Payment</DialogTitle>
            <DialogDescription>
              Record a payment for {customer.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-5">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-500">Current Outstanding</span>
                <span className="text-lg font-bold text-orange-600">RS {outstanding.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Payment Amount (RS)</label>
              <Input 
                type="number" 
                value={paymentAmount} 
                onChange={(e) => setPaymentAmount(e.target.value)} 
                placeholder="Enter amount received" 
                className="text-lg py-6 font-semibold"
              />
            </div>

            {pendingInvoices.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900">Select Pending Invoices to Apply Against (Optional)</label>
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 hide-scrollbar">
                  {pendingInvoices.map(inv => (
                    <label 
                      key={inv.id} 
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedInvoices.includes(inv.id) ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]/5' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={selectedInvoices.includes(inv.id)}
                          onChange={() => toggleInvoiceSelect(inv.id)}
                          className="w-4 h-4 text-[var(--color-aqua)] rounded border-slate-300 focus:ring-[var(--color-aqua)]"
                        />
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{inv.id}</p>
                          <p className="text-xs text-slate-500">{new Date(inv.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-slate-900">RS {(inv.totalAmount - inv.paidAmount).toLocaleString()}</p>
                        <Badge variant="secondary" className="mt-1 text-[10px] uppercase bg-orange-100 text-orange-700">{inv.status}</Badge>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handlePaymentSubmit} 
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              className="bg-[var(--color-ocean-blue)] hover:bg-[var(--color-ocean-blue)]/90 text-white"
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
