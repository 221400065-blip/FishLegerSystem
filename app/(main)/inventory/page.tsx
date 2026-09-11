"use client";
import { useLanguage } from "@/lib/LanguageContext";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, Package, AlertTriangle, XOctagon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const initialInventory = [
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
  const { t } = useLanguage();
  const [inventory, setInventory] = useState(initialInventory);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Modals state
  const [addProductModal, setAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [viewProductModal, setViewProductModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  
  // Form and selected item state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", category: "Accessories", sku: "", unitPrice: 0, sellingPrice: 0, stock: 0 });

  const filteredProducts = inventory.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === "Low Stock") {
      matchesStatus = product.stock > 0 && product.stock < 15;
    } else if (filterStatus === "Out of Stock") {
      matchesStatus = product.stock === 0;
    }

    return matchesCategory && matchesSearch && matchesStatus;
  });

  const totalProducts = inventory.length;
  const lowStockCount = inventory.filter(p => p.stock > 0 && p.stock < 15).length;
  const outOfStockCount = inventory.filter(p => p.stock === 0).length;

  const handleAddSubmit = () => {
    const newProduct = {
      id: `P-${100 + inventory.length + 1}`,
      image: "https://placehold.co/80x80/cbd5e1/FFFFFF?text=New",
      title: formData.title,
      category: formData.category,
      sku: formData.sku,
      stock: formData.stock,
      unitPrice: formData.unitPrice,
      sellingPrice: formData.sellingPrice
    };
    setInventory([newProduct, ...inventory]);
    setAddProductModal(false);
    setFormData({ title: "", category: "Accessories", sku: "", unitPrice: 0, sellingPrice: 0, stock: 0 });
  };

  const handleEditSubmit = () => {
    setInventory(inventory.map(p => p.id === selectedProduct.id ? { ...p, title: formData.title, category: formData.category, sku: formData.sku, unitPrice: formData.unitPrice, sellingPrice: formData.sellingPrice, stock: formData.stock } : p));
    setEditProductModal(false);
  };

  const handleDeleteConfirm = () => {
    setInventory(inventory.filter(p => p.id !== selectedProduct.id));
    setDeleteModal(false);
  };

  const openEdit = (p: any) => {
    setSelectedProduct(p);
    setFormData({ title: p.title, category: p.category, sku: p.sku, unitPrice: p.unitPrice, sellingPrice: p.sellingPrice, stock: p.stock });
    setEditProductModal(true);
  };

  const openView = (p: any) => {
    setSelectedProduct(p);
    setViewProductModal(true);
  };

  const openDelete = (p: any) => {
    setSelectedProduct(p);
    setDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          onClick={() => setFilterStatus("All")}
          className={`rounded-xl shadow-sm border-slate-200 cursor-pointer transition-all ${filterStatus === "All" ? "ring-2 ring-[var(--color-aqua)]" : "hover:border-[var(--color-aqua)]"}`}
        >
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

        <Card 
          onClick={() => setFilterStatus("Low Stock")}
          className={`rounded-xl shadow-sm border-orange-200 bg-orange-50 cursor-pointer transition-all ${filterStatus === "Low Stock" ? "ring-2 ring-orange-500" : "hover:border-orange-400"}`}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800 uppercase tracking-wider mb-1">{t("inventoryAlert")}</p>
              <h2 className="text-3xl font-bold text-orange-600">{lowStockCount}</h2>
            </div>
            <div className="w-12 h-12 bg-orange-200 text-orange-700 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => setFilterStatus("Out of Stock")}
          className={`rounded-xl shadow-sm border-red-200 bg-red-50 cursor-pointer transition-all ${filterStatus === "Out of Stock" ? "ring-2 ring-red-500" : "hover:border-red-400"}`}
        >
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

        <Button 
          onClick={() => {
            setFormData({ title: "", category: "Accessories", sku: "", unitPrice: 0, sellingPrice: 0, stock: 0 });
            setAddProductModal(true);
          }} 
          className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-semibold w-full md:w-auto shrink-0"
        >
          <Plus size={18} className="mr-2" /> {t("addNew")} Product
        </Button>
      </div>

      {/* Product Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
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
                <TableHead className="text-right font-semibold text-slate-600">{t("actions").toUpperCase()}</TableHead>
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
                        <Button onClick={() => openView(product)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--color-ocean-blue)]">
                          <Eye size={16} />
                        </Button>
                        <Button onClick={() => openEdit(product)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[var(--color-aqua)]">
                          <Edit size={16} />
                        </Button>
                        <Button onClick={() => openDelete(product)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500">
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
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Fast Charger 20W" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Chargers" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="e.g. CHG-20W" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit Price</label>
                <Input type="number" value={formData.unitPrice || ''} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Selling Price</label>
                <Input type="number" value={formData.sellingPrice || ''} onChange={e => setFormData({...formData, sellingPrice: Number(e.target.value)})} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Stock</label>
              <Input type="number" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProductModal(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={editProductModal} onOpenChange={setEditProductModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for {selectedProduct?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Title</label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit Price</label>
                <Input type="number" value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Selling Price</label>
                <Input type="number" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: Number(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock</label>
              <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProductModal(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90">Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Details Modal */}
      <Dialog open={viewProductModal} onOpenChange={setViewProductModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <img src={selectedProduct.image} alt={selectedProduct.title} className="w-16 h-16 rounded-md object-cover bg-slate-100" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedProduct.title}</h3>
                  <p className="text-sm text-slate-500">{selectedProduct.id} • {selectedProduct.sku}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Category</p>
                  <p className="font-bold text-slate-900">{selectedProduct.category}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Stock</p>
                  <p className="font-bold text-slate-900">{selectedProduct.stock} Units</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Unit Price</p>
                  <p className="font-bold text-slate-900">${selectedProduct.unitPrice.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Selling Price</p>
                  <p className="font-bold text-[var(--color-ocean-blue)] text-lg">${selectedProduct.sellingPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewProductModal(false)}>Close</Button>
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
              Are you sure you want to delete <strong className="text-slate-900">{selectedProduct?.title}</strong>? This action cannot be undone.
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
