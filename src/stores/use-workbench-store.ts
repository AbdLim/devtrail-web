import { create } from "zustand";

export interface InspectorData {
  title: string;
  subtitle?: string;
  type?: "activity" | "evidence" | "project" | "accomplishment" | "note";
  data?: any;
}

interface WorkbenchState {
  // Sidebar state
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
  isCaptureOpen: boolean;
  openCapture: () => void;
  closeCapture: () => void;
  toggleCapture: () => void;

  // Command Palette State
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
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

  isCaptureOpen: false,
  openCapture: () => set({ isCaptureOpen: true }),
  closeCapture: () => set({ isCaptureOpen: false }),
  toggleCapture: () => set((state) => ({ isCaptureOpen: !state.isCaptureOpen })),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
}));
