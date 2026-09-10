import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
