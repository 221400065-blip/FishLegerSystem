"use client";

import { MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[var(--color-ocean-blue)] rounded-xl flex items-center justify-center">
            <MonitorSmartphone className="text-[var(--color-aqua)]" size={20} />
          </div>
          <div>
            <h2 className="text-[var(--color-ocean-blue)] font-bold text-lg leading-tight">Ledger System</h2>
            <p className="text-xs text-slate-500 font-medium">Multi-Customer Billing</p>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h1>
          <p className="text-slate-500 text-sm">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Email
            </label>
            <Input 
              type="email" 
              placeholder="samar@gmail.com" 
              defaultValue="samar@gmail.com"
              required 
              className="h-12 bg-slate-50/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Password
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              defaultValue="samar123"
              required 
              className="h-12 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none text-slate-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Link href="#" className="text-sm font-medium text-[var(--color-aqua)] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" className="w-full h-12 bg-[var(--color-aqua)] hover:bg-[var(--color-aqua)]/90 text-white font-semibold text-base rounded-xl transition-colors shadow-sm">
            Sign In &rarr;
          </Button>
        </form>

      </div>
      
      <p className="mt-8 text-sm text-slate-400">
        2026 Ledger System All rights reserved
      </p>
    </div>
  );
}
