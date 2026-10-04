"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminUiContextType {
  sidebarOpenMobile: boolean;
  setSidebarOpenMobile: (open: boolean) => void;
  toggleSidebarMobile: () => void;
  sidebarCollapsedDesktop: boolean;
  setSidebarCollapsedDesktop: (collapsed: boolean) => void;
  toggleSidebarDesktop: () => void;
}

const AdminUiContext = createContext<AdminUiContextType | undefined>(undefined);

export function AdminUiProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [sidebarCollapsedDesktop, setSidebarCollapsedDesktop] = useState(false);

  // Close mobile sidebar on route changes or resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpenMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebarMobile = () => setSidebarOpenMobile((prev) => !prev);
  const toggleSidebarDesktop = () => setSidebarCollapsedDesktop((prev) => !prev);

  return (
    <AdminUiContext.Provider
      value={{
        sidebarOpenMobile,
        setSidebarOpenMobile,
        toggleSidebarMobile,
        sidebarCollapsedDesktop,
        setSidebarCollapsedDesktop,
        toggleSidebarDesktop,
      }}
    >
      {children}
    </AdminUiContext.Provider>
  );
}

export function useAdminUi() {
  const context = useContext(AdminUiContext);
  if (!context) {
    throw new Error("useAdminUi must be used within an AdminUiProvider");
  }
  return context;
}
