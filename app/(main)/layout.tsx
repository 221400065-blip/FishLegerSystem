"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguage } from "@/lib/LanguageContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, setIsSidebarOpen } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <Sidebar />
      <div className={`${isSidebarOpen ? 'md:pl-64 pl-0' : 'md:pl-16 pl-0'} transition-all duration-300 flex flex-col min-h-screen w-full`}>
        <Navbar />
        <main className="p-4 md:p-8 flex-1 w-full overflow-hidden">
          {children}
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
