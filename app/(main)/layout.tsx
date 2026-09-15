"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguage } from "@/lib/LanguageContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, isSidebarHovered, setIsSidebarOpen } = useLanguage();
  const expanded = isSidebarOpen || isSidebarHovered;

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] overflow-x-hidden print:overflow-visible print:h-auto print:min-h-0 print:bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className={`${expanded ? 'md:pl-64 pl-0' : 'md:pl-16 pl-0'} transition-all duration-300 flex flex-col min-h-screen w-full print:block print:pl-0 print:h-auto print:min-h-0`}>
        <div className="print:hidden">
          <Navbar />
        </div>
        <main className="px-4 md:px-6 lg:px-8 py-6 flex-1 w-full overflow-hidden print:overflow-visible print:block print:p-0">
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
