"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";
import { FileText, Printer, Download, Users, Truck, Eye, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const { customers, suppliers } = useLanguage();
  const [activeTab, setActiveTab] = useState<"customers" | "suppliers">("customers");
  const router = useRouter();
  
  const [previewInvoice, setPreviewInvoice] = useState<any | null>(null);

  const totalCustomerReceivable = customers.reduce((sum, c) => sum + ((c.billed || 0) - (c.paid || 0)), 0);
  const totalCustomerPaid = customers.reduce((sum, c) => sum + (c.paid || 0), 0);
  const totalCustomerBilled = customers.reduce((sum, c) => sum + (c.billed || 0), 0);

  const totalSupplierPayable = suppliers.reduce((sum, s) => sum + ((s.totalPurchases || 0) - (s.paid || 0)), 0);
  const totalSupplierPaid = suppliers.reduce((sum, s) => sum + (s.paid || 0), 0);
  const totalSupplierPurchases = suppliers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  const openKhata = (entity: any, type: "customer" | "supplier") => {
    router.push(`/reports/${type}s/${entity.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Khata Reports</h1>
          <p className="text-sm text-slate-500 mt-1">View historical ledger statements and generate PDFs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-fit print:hidden">
        <button
          onClick={() => setActiveTab("customers")}
          className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "customers" 
              ? "bg-white text-slate-900 shadow-sm" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <Users size={16} /> Customer Reports
        </button>
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "suppliers" 
              ? "bg-white text-slate-900 shadow-sm" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <Truck size={16} /> Supplier Reports
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-500 uppercase mb-1">
              {activeTab === "customers" ? "Total Invoiced" : "Total Purchased"}
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              RS {(activeTab === "customers" ? totalCustomerBilled : totalSupplierPurchases).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-500 uppercase mb-1">Total Paid</p>
            <h2 className="text-3xl font-bold text-green-600">
              RS {(activeTab === "customers" ? totalCustomerPaid : totalSupplierPaid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-500 uppercase mb-1">
              {activeTab === "customers" ? "Outstanding Dues" : "Net Payable"}
            </p>
            <h2 className="text-3xl font-bold text-red-600">
              RS {(activeTab === "customers" ? totalCustomerReceivable : totalSupplierPayable).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between print:hidden">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-[var(--color-aqua)]" /> 
            {activeTab === "customers" ? "Customer Master List" : "Supplier Master List"}
          </h2>
        </div>
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold text-slate-600">NAME</TableHead>
                <TableHead className="font-semibold text-slate-600">PHONE</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  {activeTab === "customers" ? "TOTAL SALES" : "TOTAL PURCHASES"}
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">TOTAL PAID</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  {activeTab === "customers" ? "OUTSTANDING DUES" : "NET PAYABLE"}
                </TableHead>
                <TableHead className="text-center font-semibold text-slate-600">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTab === "customers" && customers.length > 0 ? (
                customers.map(c => {
                  const billed = c.billed || 0;
                  const paid = c.paid || 0;
                  const bal = billed - paid;
                  return (
                    <TableRow key={c.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-semibold text-slate-900">{c.name}</TableCell>
                      <TableCell className="text-slate-600">{c.phone || '-'}</TableCell>
                      <TableCell className="text-right text-slate-700 font-medium">RS {billed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">RS {paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className={`text-right font-bold ${bal > 0 ? 'text-red-600' : 'text-slate-900'}`}>RS {bal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" onClick={() => openKhata(c, "customer")} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          <Eye size={14} className="mr-1" /> View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : activeTab === "suppliers" && suppliers.length > 0 ? (
                suppliers.map(s => {
                  const purchased = s.totalPurchases || 0;
                  const paid = s.paid || 0;
                  const bal = purchased - paid;
                  return (
                    <TableRow key={s.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-semibold text-slate-900">{s.name}</TableCell>
                      <TableCell className="text-slate-600">{s.phone || '-'}</TableCell>
                      <TableCell className="text-right text-slate-700 font-medium">RS {purchased.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">RS {paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className={`text-right font-bold ${bal > 0 ? 'text-red-600' : 'text-slate-900'}`}>RS {bal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" onClick={() => openKhata(s, "supplier")} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          <Eye size={14} className="mr-1" /> View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Invoice / Receipt Preview Modal */}
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
