"use client";

import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminUiProvider } from "./AdminUiContext";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminUiProvider>
      <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] transition-colors">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <AdminHeader />
          <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 overflow-y-auto min-w-0">
            {children}
          </main>
        </div>
      </div>
    </AdminUiProvider>
  );
}
