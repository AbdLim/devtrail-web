"use client";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { InspectorDrawer } from "./inspector-drawer";
import { QuickCaptureDock } from "./quick-capture-dock";
import { CommandPalette } from "../ui/command-palette";
import { useWorkbenchStore } from "@/stores/use-workbench-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { inspector } = useWorkbenchStore();

  return (
    <div className="min-h-screen bg-[#0D0F0F] text-[#F1F0EA] flex flex-col font-sans antialiased selection:bg-[#91AD9D]/30 selection:text-[#F1F0EA]">
      <div className="flex flex-1 min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <div className="flex flex-1 min-h-0">
            {/* Main Canvas Area */}
            <main className="flex-1 p-6 md:p-10 max-w-5xl w-full mx-auto pb-24 overflow-y-auto">
              {children}
            </main>
            {/* Contextual Inspector Drawer Column */}
            {inspector.isOpen && <InspectorDrawer />}
          </div>
        </div>
      </div>
      
      {/* Signature Floating Quick Capture & Command Palette */}
      <QuickCaptureDock />
      <CommandPalette />
    </div>
  );
}
