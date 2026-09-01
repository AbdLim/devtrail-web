import { create } from "zustand";

export interface InspectorData {
  title: string;
  subtitle?: string;
  type?: "activity" | "evidence" | "project" | "accomplishment" | "note";
  data?: any;
}

interface WorkbenchState {
  // Sidebar state (240px expanded ↔ 64px collapsed)
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Inspector Panel State
  inspector: {
    isOpen: boolean;
    data: InspectorData | null;
  };
  openInspector: (data: InspectorData) => void;
  closeInspector: () => void;

  // Quick Capture Dock State
  isQuickCaptureOpen: boolean;
  toggleQuickCapture: () => void;
  setQuickCaptureOpen: (open: boolean) => void;

  // Command Palette State
  isCommandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useWorkbenchStore = create<WorkbenchState>((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  inspector: {
    isOpen: false,
    data: null,
  },
  openInspector: (data) =>
    set({
      inspector: {
        isOpen: true,
        data,
      },
    }),
  closeInspector: () =>
    set((state) => ({
      inspector: {
        ...state.inspector,
        isOpen: false,
      },
    })),

  isQuickCaptureOpen: false,
  toggleQuickCapture: () => set((state) => ({ isQuickCaptureOpen: !state.isQuickCaptureOpen })),
  setQuickCaptureOpen: (open) => set({ isQuickCaptureOpen: open }),

  isCommandPaletteOpen: false,
  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));
