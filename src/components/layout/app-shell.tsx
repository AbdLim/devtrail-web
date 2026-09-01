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
    <div className="min-h-screen flex flex-col bg-[#090B0A] text-[#F4F1E8] font-sans antialiased">
      {/* Subtle ambient atmosphere gradient — spec §8 */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 80% 0%, rgba(153,185,163,0.045), transparent 30%),
            radial-gradient(circle at 20% 100%, rgba(156,146,186,0.025), transparent 30%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen">
        <AppSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <AppHeader />

          <div className="flex flex-1 min-h-0">
            {/* Main Canvas — 40-48px horizontal padding, max 1100px per spec §17 */}
            <main
              className="flex-1 overflow-y-auto px-10 py-8 pb-24"
              style={{ maxWidth: inspector.isOpen ? undefined : "1100px" }}
            >
              {children}
            </main>

            {/* Contextual Inspector — §29 */}
            {inspector.isOpen && <InspectorDrawer />}
          </div>
        </div>
      </div>

      {/* Signature bottom Quick Capture Dock */}
      <QuickCaptureDock />

      {/* Command Palette — ⌘K */}
      <CommandPalette />
    </div>
  );
}
