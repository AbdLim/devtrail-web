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
} from "lucide-react";
import { useWorkbenchStore } from "@/stores/use-workbench-store";
import { cn } from "@/lib/utils/cn";

interface CommandItem {
  id: string;
  title: string;
  icon: typeof Calendar;
  path: string | null;
}

const COMMAND_GROUPS: { label: string; commands: CommandItem[] }[] = [
  {
    label: "Navigation",
    commands: [
      { id: "today", title: "Go to Today", icon: Calendar, path: "/today" },
      { id: "timeline", title: "Go to Timeline", icon: GitCommitHorizontal, path: "/timeline" },
      { id: "projects", title: "Go to Projects", icon: FolderGit2, path: "/projects" },
      { id: "memory", title: "Go to Memory", icon: BrainCircuit, path: "/memory" },
      { id: "search", title: "Search Career Memory", icon: Search, path: "/search" },
      { id: "settings", title: "Open Settings", icon: Settings, path: "/settings/profile" },
    ],
  },
  {
    label: "Actions",
    commands: [
      { id: "capture", title: "Capture Note", icon: Plus, path: null },
    ],
  },
];

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen, openCapture } = useWorkbenchStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allCommands = COMMAND_GROUPS.flatMap((g) => g.commands);

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
        setQuery("");
      }
      if (e.key === "ArrowDown" && isCommandPaletteOpen) {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      }
      if (e.key === "ArrowUp" && isCommandPaletteOpen) {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && isCommandPaletteOpen && filteredCommands[selectedIndex]) {
        e.preventDefault();
        execute(filteredCommands[selectedIndex]);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCommandPaletteOpen, selectedIndex, filteredCommands, setCommandPaletteOpen]);

  function execute(cmd: (typeof allCommands)[0]) {
    setCommandPaletteOpen(false);
    setQuery("");
    setSelectedIndex(0);
    if (cmd.id === "capture") {
      openCapture();
    } else if (cmd.path) {
      router.push(cmd.path);
    }
  }

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center"
      style={{ paddingTop: "12vh" }}
    >
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => { setCommandPaletteOpen(false); setQuery(""); }}
        aria-hidden="true"
      />

      {/* Palette — §41 */}
      <div className="relative w-[580px] rounded-[10px] border border-[#303832] bg-[#121612] shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Search row */}
        <div className="flex items-center gap-3 border-b border-[#222823] px-4 h-[48px]">
          <Search className="h-[14px] w-[14px] text-[#8E968E] shrink-0 stroke-[1.5px]" />
          <input
            id="command-palette-input"
            autoFocus
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-[14px] text-[#F5F3EF] placeholder:text-[#6E766E] outline-none"
          />
          <button
            type="button"
            onClick={() => { setCommandPaletteOpen(false); setQuery(""); }}
            className="p-1 rounded text-[#8E968E] hover:text-[#F5F3EF] hover:bg-[#1B201C] transition-colors"
          >
            <X className="h-[13px] w-[13px] stroke-[1.5px]" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[340px] overflow-y-auto py-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 h-[38px] text-[13px] text-left transition-colors duration-[100ms]",
                    isSelected
                      ? "bg-[#1B211D] text-[#F5F3EF]"
                      : "text-[#C4CCC4] hover:bg-[#191E1A] hover:text-[#F5F3EF]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[14px] w-[14px] shrink-0 stroke-[1.5px] transition-colors",
                      isSelected ? "text-[#99B9A3]" : "text-[#8E968E]"
                    )}
                  />
                  <span className="flex-1">{cmd.title}</span>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center font-mono text-[12px] text-[#8E968E]">
              No commands found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#222823] px-4 py-2 flex items-center gap-3 font-mono text-[10px] text-[#8E968E]">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> select</span>
          <span><kbd className="font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
