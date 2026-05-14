import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex w-full bg-background text-foreground overflow-hidden">

      {/* Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <TopNav title={title} />
        </div>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}