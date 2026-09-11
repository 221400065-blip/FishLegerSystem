"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { User, Mail, Phone, MapPin, Building, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@ledgersystem.com",
    phone: "+92 300 1234567",
    address: "123 Tech Market, Blue Area, ISB"
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t("profile") || "My Profile"}</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-[var(--color-ocean-blue)] relative">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-[var(--color-aqua)] flex items-center justify-center font-bold text-3xl text-white">
              SM
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-6 px-6">
          <div className="flex justify-between items-start">
            <div>
              {isEditing ? (
                <Input 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="font-bold text-xl h-8 w-64"
                />
              ) : (
                <h2 className="text-xl font-bold text-slate-900">{profileData.name}</h2>
              )}
              <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm">
                <Briefcase size={14} /> Store Manager
              </p>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-medium shadow-sm"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 border-b pb-2">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  {isEditing ? (
                    <Input 
                      value={profileData.email} 
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="h-8"
                    />
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  {isEditing ? (
                    <Input 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="h-8"
                    />
                  ) : (
                    <span>{profileData.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  {isEditing ? (
                    <Input 
                      value={profileData.address} 
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="h-8"
                    />
                  ) : (
                    <span>{profileData.address}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 border-b pb-2">Business Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Building size={16} className="text-slate-400" />
                  <span>Ledger System HQ</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="font-medium min-w-[80px]">Role:</span>
                  <span>Super Admin</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="font-medium min-w-[80px]">Joined:</span>
                  <span>Jan 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
