"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  GitCommitHorizontal,
  FolderGit2,
  BrainCircuit,
  Search,
  Plus,
  Settings,
  X,
  ArrowRight,
} from "lucide-react";
import { useWorkbenchStore } from "@/stores/use-workbench-store";
import { cn } from "@/lib/utils/cn";

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen, setQuickCaptureOpen } =
    useWorkbenchStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      id: "today",
      title: "Go to Today",
      category: "Navigation",
      icon: Calendar,
      action: () => router.push("/today"),
    },
    {
      id: "timeline",
      title: "Go to Timeline",
      category: "Navigation",
      icon: GitCommitHorizontal,
      action: () => router.push("/timeline"),
    },
    {
      id: "projects",
      title: "Go to Projects",
      category: "Navigation",
      icon: FolderGit2,
      action: () => router.push("/projects"),
    },
    {
      id: "memory",
      title: "Go to Memory",
      category: "Navigation",
      icon: BrainCircuit,
      action: () => router.push("/memory"),
    },
    {
      id: "search",
      title: "Search Career Memory",
      category: "Navigation",
      icon: Search,
      action: () => router.push("/search"),
    },
    {
      id: "note",
      title: "Quick Add Note",
      category: "Actions",
      icon: Plus,
      action: () => setQuickCaptureOpen(true),
    },
    {
      id: "settings",
      title: "Open Settings",
      category: "Navigation",
      icon: Settings,
      action: () => router.push("/settings/profile"),
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }

      if (e.key === "Escape" && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const executeCommand = (cmd: (typeof commands)[0]) => {
    cmd.action();
    setCommandPaletteOpen(false);
    setQuery("");
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl border border-[#252A28] bg-[#121515] shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 border-b border-[#252A28] bg-[#0D0F0F]">
          <Search className="h-4 w-4 text-[#737A76] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent py-3 text-xs text-[#F1F0EA] placeholder-[#737A76] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-[#737A76] hover:text-[#F1F0EA] rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Command Options List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => executeCommand(cmd)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded.md text-xs transition",
                    idx === selectedIndex
                      ? "bg-[#171A19] text-[#F1F0EA] border border-[#252A28]"
                      : "text-[#A3AAA5] hover:bg-[#1B1F1E] hover:text-[#F1F0EA]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[#91AD9D]" />
                    <span>{cmd.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#737A76]">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-[#737A76]">
              No commands found matching "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#252A28] px-4 py-2 bg-[#0D0F0F] flex items-center justify-between text-[10px] font-mono text-[#737A76]">
          <span>Navigation Shortcuts</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="bg-[#171A19] border border-[#252A28] px-1 rounded">esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
