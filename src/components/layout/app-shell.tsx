"use client";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { InspectorDrawer } from "./inspector-drawer";
import { QuickCaptureDock } from "./quick-capture-dock";
import { CommandPalette } from "../ui/command-palette";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0D0F0F] text-[#F1F0EA] flex flex-col font-sans antialiased selection:bg-[#91AD9D]/30 selection:text-[#F1F0EA]">
      <div className="flex flex-1 min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto pb-24">
            {children}
          </main>
        </div>
      </div>
      
      {/* Contextual Overlays & Docks */}
      <InspectorDrawer />
      <QuickCaptureDock />
      <CommandPalette />
    </div>
  );
}
