"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Users, Shield, Palette, Percent, Receipt, Edit, Trash2, Plus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { t, customerBillFormat, setCustomerBillFormat, supplierBillFormat, setSupplierBillFormat, language, setLanguage: setGlobalLanguage, theme, setTheme } = useLanguage();
  const [activeTab, setActiveTab] = useState("General");
  
  // Local state for language choice before saving
  const [selectedLang, setSelectedLang] = useState(language);

  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

  // Security State
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  
  // User Management State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Cashier" });
  const [users, setUsers] = useState([
    { id: 1, name: "Admin User", email: "admin@ledgersystem.com", role: "Super Admin", joined: "Jan 2026" },
    { id: 2, name: "Staff One", email: "staff@ledgersystem.com", role: "Cashier", joined: "Mar 2026" }
  ]);
  
  // Appearance State
  const [activeColorTheme, setActiveColorTheme] = useState("aqua");

  const handleGeneralSave = () => {
    setGlobalLanguage(selectedLang as any);
  };

  const handleUpdatePassword = () => {
    alert("Password successfully updated!");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, { id: Date.now(), name: newUser.name, email: newUser.email, role: newUser.role, joined: "Sep 2026" }]);
    setIsAddUserModalOpen(false);
    setNewUser({ name: "", email: "", role: "Cashier" });
  };

  const handleColorChange = (theme: string, hex: string) => {
    setActiveColorTheme(theme);
    document.documentElement.style.setProperty('--color-aqua', hex);
  };

  const tabs = [
    { id: "General", label: t("general"), icon: SettingsIcon },
    { id: "Commission", label: "Commission", icon: Percent },
    { id: "UserRoles", label: t("userRoles"), icon: Users },
    { id: "Notification", label: "Notification", icon: Bell },
    { id: "Security", label: t("security"), icon: Shield },
    { id: "Appearance", label: t("appearance"), icon: Palette },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("settings")}</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your system preferences and configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-max shrink-0">
          <nav className="flex flex-col p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left ${
                  activeTab === tab.id
                    ? "bg-[var(--color-aqua)]/10 text-[var(--color-ocean-blue)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? "text-[var(--color-aqua)]" : "text-slate-400"} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
          {activeTab === "General" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t("general")} Settings</h2>
                <p className="text-sm text-slate-500">Configure basic application settings.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Store Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)]" defaultValue="Ledger System" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Contact Number</label>
                  <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)]" defaultValue="+92 300 0000000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Language</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setSelectedLang('en')} 
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedLang === 'en' 
                          ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]/10 text-[var(--color-ocean-blue)] font-bold' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      English
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedLang('ur')} 
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedLang === 'ur' 
                          ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]/10 text-[var(--color-ocean-blue)] font-bold' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      اردو (Urdu)
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200" />

              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Receipt size={18} className="text-slate-500" />
                  {t("billingSettings")}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Configure how bills are printed for customers and suppliers.</p>
                
                <div className="mt-4 space-y-6">
                  {/* Customer Bill Format */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Customer Bill Format</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${customerBillFormat === 'thermal' ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]/5 ring-1 ring-[var(--color-aqua)]' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="customerBillFormat" 
                          value="thermal" 
                          checked={customerBillFormat === 'thermal'} 
                          onChange={() => setCustomerBillFormat('thermal')} 
                          className="w-4 h-4 text-[var(--color-aqua)]"
                        />
                        <span className="font-medium text-slate-900">{t("thermalBill")}</span>
                      </label>
                      <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${customerBillFormat === 'simple' ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]/5 ring-1 ring-[var(--color-aqua)]' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="customerBillFormat" 
                          value="simple" 
                          checked={customerBillFormat === 'simple'} 
                          onChange={() => setCustomerBillFormat('simple')} 
                          className="w-4 h-4 text-[var(--color-aqua)]"
                        />
                        <span className="font-medium text-slate-900">{t("simpleBill")}</span>
                      </label>
                    </div>
                  </div>

                  {/* Supplier Bill Format */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Supplier Bill Format</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${supplierBillFormat === 'thermal' ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]/5 ring-1 ring-[var(--color-aqua)]' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="supplierBillFormat" 
                          value="thermal" 
                          checked={supplierBillFormat === 'thermal'} 
                          onChange={() => setSupplierBillFormat('thermal')} 
                          className="w-4 h-4 text-[var(--color-aqua)]"
                        />
                        <span className="font-medium text-slate-900">{t("thermalBill")}</span>
                      </label>
                      <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${supplierBillFormat === 'simple' ? 'border-[var(--color-aqua)] bg-[var(--color-aqua)]/5 ring-1 ring-[var(--color-aqua)]' : 'border-slate-200 hover:border-slate-300'}`}>
                        <input 
                          type="radio" 
                          name="supplierBillFormat" 
                          value="simple" 
                          checked={supplierBillFormat === 'simple'} 
                          onChange={() => setSupplierBillFormat('simple')} 
                          className="w-4 h-4 text-[var(--color-aqua)]"
                        />
                        <span className="font-medium text-slate-900">{t("simpleBill")}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="button"
                  onClick={handleGeneralSave} 
                  className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {t("save")}
                </button>
              </div>
            </div>
          )}

          {activeTab === "Commission" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Commission Settings</h2>
                <p className="text-sm text-slate-500">Configure global commission rates.</p>
              </div>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Commission for POS (%)</label>
                  <input type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)]" defaultValue="8" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-slate-700">Apply Commission to POS</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle2" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-200 appearance-none cursor-pointer checked:right-0 checked:border-[var(--color-aqua)] checked:bg-[var(--color-aqua)] transition-all"/>
                      <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  {t("save")}
                </button>
              </div>
            </div>
          )}

          {activeTab === "UserRoles" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">User & Roles</h2>
                <p className="text-sm text-slate-500">Manage system users and their access levels.</p>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-semibold text-slate-600">NAME</TableHead>
                      <TableHead className="font-semibold text-slate-600">EMAIL</TableHead>
                      <TableHead className="font-semibold text-slate-600">ROLE</TableHead>
                      <TableHead className="font-semibold text-slate-600">JOINED</TableHead>
                      <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-slate-600">{u.email}</TableCell>
                        <TableCell><Badge className={u.role === 'Super Admin' ? "bg-[var(--color-ocean-blue)] text-white" : "bg-slate-100 text-slate-800 border"}>{u.role}</Badge></TableCell>
                        <TableCell className="text-slate-600">{u.joined}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[var(--color-aqua)]">
                            <Edit size={16}/>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                            <Trash2 size={16}/>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <button onClick={() => setIsAddUserModalOpen(true)} className="bg-white border border-[var(--color-aqua)] text-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/10 px-6 py-2 rounded-lg font-medium transition-colors">
                <span className="flex items-center gap-1"><Plus size={16} /> Add User</span>
              </button>
            </div>
          )}

          {activeTab === "Notification" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
                <p className="text-sm text-slate-500">Configure how and when you receive alerts.</p>
              </div>
              <div className="space-y-4 max-w-md">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div>
                    <span className="block text-sm font-medium text-slate-700">Order Alerts</span>
                    <span className="block text-xs text-slate-500 mt-1">Notify me when a new order is placed</span>
                  </div>
                  <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle3" id="toggle3" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-200 appearance-none cursor-pointer checked:right-0 checked:border-[var(--color-aqua)] checked:bg-[var(--color-aqua)] transition-all"/>
                      <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div>
                    <span className="block text-sm font-medium text-slate-700">Low Stock Alerts</span>
                    <span className="block text-xs text-slate-500 mt-1">Notify me when inventory drops below 15</span>
                  </div>
                  <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle4" id="toggle4" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-200 appearance-none cursor-pointer checked:right-0 checked:border-[var(--color-aqua)] checked:bg-[var(--color-aqua)] transition-all"/>
                      <label htmlFor="toggle4" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="block text-sm font-medium text-slate-700">Daily Report Email</span>
                    <span className="block text-xs text-slate-500 mt-1">Send a summary of daily transactions</span>
                  </div>
                  <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle5" id="toggle5" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-200 appearance-none cursor-pointer checked:right-0 checked:border-[var(--color-aqua)] checked:bg-[var(--color-aqua)] transition-all"/>
                      <label htmlFor="toggle5" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Security</h2>
                <p className="text-sm text-slate-500">Update your password and security settings.</p>
              </div>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Current Password</label>
                  <input type="password" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">New Password</label>
                  <input type="password" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                  <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)]" />
                </div>
              </div>
              <div className="pt-4">
                <button onClick={handleUpdatePassword} className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === "Appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Appearance</h2>
                <p className="text-sm text-slate-500">Customize the look and feel of your application.</p>
              </div>
              <div className="space-y-8 max-w-md">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-700 block">Color Theme</label>
                  <div className="flex gap-4">
                    <button onClick={() => handleColorChange('aqua', '#06B6D4')} className={`w-10 h-10 rounded-full bg-[#06B6D4] transition-all ${activeColorTheme === 'aqua' ? 'ring-4 ring-slate-200 ring-offset-2' : 'hover:ring-4 ring-slate-100'}`}></button>
                    <button onClick={() => handleColorChange('blue', '#2563EB')} className={`w-10 h-10 rounded-full bg-blue-600 transition-all ${activeColorTheme === 'blue' ? 'ring-4 ring-slate-200 ring-offset-2' : 'hover:ring-4 ring-slate-100'}`}></button>
                    <button onClick={() => handleColorChange('purple', '#9333EA')} className={`w-10 h-10 rounded-full bg-purple-600 transition-all ${activeColorTheme === 'purple' ? 'ring-4 ring-slate-200 ring-offset-2' : 'hover:ring-4 ring-slate-100'}`}></button>
                    <button onClick={() => handleColorChange('green', '#16A34A')} className={`w-10 h-10 rounded-full bg-green-600 transition-all ${activeColorTheme === 'green' ? 'ring-4 ring-slate-200 ring-offset-2' : 'hover:ring-4 ring-slate-100'}`}></button>
                    <button onClick={() => handleColorChange('orange', '#F97316')} className={`w-10 h-10 rounded-full bg-orange-500 transition-all ${activeColorTheme === 'orange' ? 'ring-4 ring-slate-200 ring-offset-2' : 'hover:ring-4 ring-slate-100'}`}></button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-700 block">Dark Mode</label>
                  <div className="flex items-center justify-between py-2 p-4 border border-slate-200 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">Enable Dark Mode</span>
                    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" checked={theme === 'dark'} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-slate-200 appearance-none cursor-pointer checked:right-0 checked:border-[var(--color-aqua)] checked:bg-[var(--color-aqua)] transition-all"/>
                        <label className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add User Modal */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new staff member and assign their role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="e.g. Ali Raza" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="e.g. ali@ledgersystem.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select 
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-aqua)]"
              >
                <option value="Cashier">Cashier</option>
                <option value="Manager">Manager</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)}>Cancel</Button>
            <Button className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white" onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}