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

      {/* Sidebar - Use display-none based approach */}
      <div style={{ display: 'flex' }}>
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-h-screen">

        {/* Top Navbar */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10 flex-shrink-0">
          <TopNav title={title} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background w-full">
          <div className="w-full h-full max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}