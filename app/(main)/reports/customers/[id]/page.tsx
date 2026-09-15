"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, Receipt, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function CustomerKhataReport() {
  const { customers } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [previewInvoice, setPreviewInvoice] = useState<any | null>(null);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return <div className="p-8 text-center text-slate-500">Customer not found.</div>;
  }

  const filteredLedger = customer.ledger?.filter((entry: any) => {
    if (!fromDate && !toDate) return true;
    const entryDate = new Date(entry.date).toISOString().split('T')[0];
    if (fromDate && toDate) return entryDate >= fromDate && entryDate <= toDate;
    if (fromDate) return entryDate >= fromDate;
    if (toDate) return entryDate <= toDate;
    return true;
  }) || [];

  // Recalculate summary based on filtered ledger
  const filteredBilled = filteredLedger.reduce((sum, entry) => entry.type === "Sale Invoice" ? sum + entry.debit : sum, 0);
  const filteredPaid = filteredLedger.reduce((sum, entry) => entry.type === "Payment Recv" ? sum + entry.credit : sum, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header / Actions - Hidden in Print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Khata Statement</h1>
            <p className="text-sm text-slate-500">Detailed ledger report for {customer.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Input 
              type="date" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
              className="w-36 h-9 text-sm"
              title="From Date"
            />
            <span className="text-slate-400">to</span>
            <Input 
              type="date" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
              className="w-36 h-9 text-sm"
              title="To Date"
            />
          </div>
          <Button onClick={handlePrint} className="bg-[var(--color-ocean-blue)] hover:bg-[var(--color-ocean-blue)]/90 text-white shadow-sm h-9">
            <Printer size={16} className="mr-2" /> Generate PDF
          </Button>
        </div>
      </div>

      {/* Printable Report Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0">
        
        {/* Report Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 print:bg-white print:border-b-2 print:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{customer.name}</h2>
              <div className="text-sm text-slate-600 mt-1 space-y-0.5">
                <p><span className="font-medium">Customer ID:</span> {customer.id}</p>
                <p><span className="font-medium">Phone:</span> {customer.phone || 'N/A'}</p>
                <p><span className="font-medium">Address:</span> {customer.address || 'Address not provided'}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-[var(--color-ocean-blue)] flex items-center gap-2 justify-end">
                <FileText size={18} /> LEDGER REPORT
              </h3>
              <p className="text-xs text-slate-500 mt-1">Generated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-slate-100 print:border-b-2 print:border-slate-800">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center print:border-slate-300">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-slate-900">RS {((fromDate || toDate) ? filteredBilled : (customer.billed || 0)).toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center print:border-slate-300">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">RS {((fromDate || toDate) ? filteredPaid : (customer.paid || 0)).toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center print:border-slate-300">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Outstanding Dues</p>
            <p className="text-2xl font-bold text-red-600">RS {((fromDate || toDate) ? (filteredBilled - filteredPaid) : ((customer.billed || 0) - (customer.paid || 0))).toLocaleString()}</p>
          </div>
        </div>

        {/* Historical Ledger Table */}
        <div className="p-6">
          <h3 className="font-bold text-slate-900 mb-4 text-lg">Transaction History</h3>
          <Table className="print:text-xs">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-bold text-slate-700 w-40">DATE & TIME</TableHead>
                <TableHead className="font-bold text-slate-700 w-32">REF #</TableHead>
                <TableHead className="font-bold text-slate-700 w-32">TYPE</TableHead>
                <TableHead className="font-bold text-slate-700">DESCRIPTION / ITEMS</TableHead>
                <TableHead className="text-right font-bold text-slate-700 whitespace-nowrap">DEBIT (+)</TableHead>
                <TableHead className="text-right font-bold text-slate-700 whitespace-nowrap">CREDIT (-)</TableHead>
                <TableHead className="text-right font-bold text-slate-700 whitespace-nowrap">EXPENSE</TableHead>
                <TableHead className="text-right font-bold text-slate-700 whitespace-nowrap">BALANCE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLedger.map((entry: any) => {
                const isInvoice = entry.type === "Sale Invoice";
                const isExpense = entry.type === "Expense Entry";
                return (
                  <TableRow key={entry.id} className={`${isExpense ? 'bg-orange-50/50' : ''}`}>
                    <TableCell className="text-sm whitespace-nowrap text-slate-600">
                      {new Date(entry.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </TableCell>
                    <TableCell>
                      {isInvoice ? (
                        <span 
                          className="text-[var(--color-aqua)] font-bold cursor-pointer hover:underline flex items-center gap-1 print:text-black print:no-underline"
                          onClick={() => {
                            const inv = customer.invoices?.find((i:any) => i.id === entry.refNo);
                            if (inv) setPreviewInvoice(inv);
                          }}
                        >
                          <Receipt size={14} className="print:hidden" /> {entry.refNo}
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-800">{entry.refNo}</span>
                      )}
                    </TableCell>
                    <TableCell>
                       <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700 print:bg-transparent print:p-0">
                         {entry.type}
                       </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700 max-w-xs" title={entry.description}>
                      {isInvoice ? (
                        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                          {(() => {
                            const inv = customer.invoices?.find((i:any) => i.id === entry.refNo);
                            if (inv && inv.items && inv.items.length > 0) {
                              return inv.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{item.qty}x</span>
                                  <span className="truncate flex-1">{item.name}</span>
                                  <span className="text-slate-500">@ RS {item.price}</span>
                                </div>
                              ));
                            }
                            return <span>{entry.description}</span>;
                          })()}
                        </div>
                      ) : (
                        <span className="truncate block">{entry.description}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {entry.debit > 0 ? entry.debit.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {entry.credit > 0 ? entry.credit.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-orange-600">
                      {entry.expense > 0 ? entry.expense.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900 bg-slate-50/50">
                      {entry.balance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredLedger.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center h-32 text-slate-500">No transactions recorded yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Invoice Preview Modal (Hidden in Print) */}
      <Dialog open={!!previewInvoice} onOpenChange={(open) => !open && setPreviewInvoice(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          {previewInvoice && (
            <div className="py-4 font-mono text-sm">
              <div className="text-center mb-4">
                <h2 className="font-bold text-lg">FISH LEGER</h2>
                <p>{previewInvoice.id}</p>
                <p>{new Date(previewInvoice.date).toLocaleString()}</p>
              </div>
              <div className="border-t border-b border-dashed border-slate-300 py-3 mb-3 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>ITEM</span>
                  <span>TOTAL</span>
                </div>
                {previewInvoice.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.qty}x {item.name}</span>
                    <span>{(item.total || (item.qty * item.costPrice)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span>RS {previewInvoice.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setPreviewInvoice(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
