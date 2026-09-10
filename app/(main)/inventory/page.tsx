"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, Package, AlertTriangle, XOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const inventoryData = [
  { id: "P-101", image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=65W", title: "Samsung 65W Charger", category: "Chargers", sku: "CHG-S65W", stock: 45, unitPrice: 25.00, sellingPrice: 45.00 },
  { id: "P-102", image: "https://placehold.co/80x80/f97316/FFFFFF?text=2M", title: "iPhone Cable 2M", category: "Cables", sku: "CBL-IP2M", stock: 8, unitPrice: 10.00, sellingPrice: 25.00 },
  { id: "P-103", image: "https://placehold.co/80x80/0B2545/FFFFFF?text=Hub", title: "USB-C Hub Multi", category: "Accessories", sku: "ACC-HUB", stock: 24, unitPrice: 35.00, sellingPrice: 65.00 },
  { id: "P-104", image: "https://placehold.co/80x80/06B6D4/FFFFFF?text=20W", title: "Fast Charger 20W", category: "Chargers", sku: "CHG-F20W", stock: 12, unitPrice: 8.00, sellingPrice: 18.00 },
  { id: "P-105", image: "https://placehold.co/80x80/cbd5e1/FFFFFF?text=Stnd", title: "Phone Stand Adjustable", category: "Accessories", sku: "ACC-STND", stock: 0, unitPrice: 5.00, sellingPrice: 15.00 },
  { id: "P-106", image: "https://placehold.co/80x80/0B2545/FFFFFF?text=Case", title: "Silicone Case Pro", category: "Accessories", sku: "ACC-CASE", stock: 50, unitPrice: 3.00, sellingPrice: 12.00 },
  { id: "P-107", image: "https://placehold.co/80x80/f97316/FFFFFF?text=CtoC", title: "Type-C to Type-C 1M", category: "Cables", sku: "CBL-CTC1", stock: 14, unitPrice: 6.00, sellingPrice: 15.00 },
];

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export default function InventoryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [addProductModal, setAddProductModal] = useState(false);

  const filteredProducts = inventoryData.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalProducts = inventoryData.length;
  const lowStockCount = inventoryData.filter(p => p.stock > 0 && p.stock < 15).length;
  const outOfStockCount = inventoryData.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6">
      
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Products</p>
              <h2 className="text-3xl font-bold text-slate-900">{totalProducts}</h2>
            </div>
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
              <Package size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-slate-200 bg-orange-50 border-orange-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800 uppercase tracking-wider mb-1">Low Stock Alert</p>
              <h2 className="text-3xl font-bold text-orange-600">{lowStockCount}</h2>
            </div>
            <div className="w-12 h-12 bg-orange-200 text-orange-700 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-slate-200 bg-red-50 border-red-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800 uppercase tracking-wider mb-1">Out of Stock</p>
              <h2 className="text-3xl font-bold text-red-600">{outOfStockCount}</h2>
            </div>
            <div className="w-12 h-12 bg-red-200 text-red-700 rounded-xl flex items-center justify-center">
              <XOctagon size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls Row */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search product, SKU, or category..." 
              className="pl-10 pr-4 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto hide-scrollbar">
            {["All", "Chargers", "Accessories", "Cables"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  activeCategory === tab 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={() => setAddProductModal(true)} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-semibold w-full md:w-auto shrink-0">
          <Plus size={18} className="mr-2" /> Add New Product
        </Button>
      </div>

      {/* Product Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="w-20 font-semibold text-slate-600">IMAGE</TableHead>
                <TableHead className="font-semibold text-slate-600">PRODUCT TITLE</TableHead>
                <TableHead className="font-semibold text-slate-600">CATEGORY</TableHead>
                <TableHead className="font-semibold text-slate-600">SKU CODE</TableHead>
                <TableHead className="text-center font-semibold text-slate-600">STOCK QTY</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">UNIT PRICE</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">SELLING PRICE</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <img src={product.image} alt={product.title} className="w-10 h-10 rounded-md object-cover bg-slate-100" />
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{product.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-500">{product.sku}</TableCell>
                    <TableCell className="text-center">
                      {product.stock === 0 ? (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 font-bold px-2 py-0.5">
                          Out of stock
                        </Badge>
                      ) : product.stock < 15 ? (
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 font-bold px-2 py-0.5">
                          {product.stock} units
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 font-bold px-2 py-0.5">
                          {product.stock} units
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-500">${product.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold text-[var(--color-ocean-blue)]">${product.sellingPrice.toFixed(2)}</TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                    No products found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Dialog open={addProductModal} onOpenChange={setAddProductModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Product</DialogTitle>
            <DialogDescription>
              Enter the product details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Title</label>
              <Input placeholder="e.g. Fast Charger 20W" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input placeholder="e.g. Chargers" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <Input placeholder="e.g. CHG-20W" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit Price</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Selling Price</label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Stock</label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProductModal(false)}>Cancel</Button>
            <Button onClick={() => setAddProductModal(false)} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
