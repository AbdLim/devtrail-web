"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useWorkbenchStore } from "@/stores/use-workbench-store";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { useCreateJournalEntry } from "@/features/journal/hooks/use-create-journal-entry";
import type { JournalEntryType } from "@/features/journal/types/journal.types";

const CAPTURE_TYPES: Array<{
  type: JournalEntryType;
  label: string;
  placeholder: string;
}> = [
  { type: "note", label: "Note", placeholder: "What are you working on right now?" },
  { type: "accomplishment", label: "Win", placeholder: "What milestone did you achieve today?" },
  { type: "learning", label: "Learning", placeholder: "What pattern or concept did you master?" },
  { type: "blocker", label: "Blocker", placeholder: "What impediment or bottleneck are you facing?" },
  { type: "decision", label: "Decision", placeholder: "What architectural decision was made and why?" },
];


export function QuickCaptureDock() {
  const { isCaptureOpen, openCapture, closeCapture } = useWorkbenchStore();
  const { data: projects = [] } = useProjects();
  const createJournalMutation = useCreateJournalEntry();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [captureType, setCaptureType] = useState<JournalEntryType>("note");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const monthAbbr = today.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayNum = today.getDate().toString().padStart(2, "0");
  const time = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  const activeConfig = CAPTURE_TYPES.find((t) => t.type === captureType) || CAPTURE_TYPES[0];
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Initialize fresh idempotency key on open
  const handleOpen = useCallback(() => {
    setIdempotencyKey(crypto.randomUUID());
    setError(null);
    openCapture();
  }, [openCapture]);

  const handleClose = useCallback(() => {
    closeCapture();
    setTitle("");
    setContent("");
    setIsProjectDropdownOpen(false);
    setError(null);
  }, [closeCapture]);

  // Keyboard shortcut: C to open, Esc to close
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isCaptureOpen) {
        handleClose();
        return;
      }
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (e.key === "c" && !isTyping && !isCaptureOpen && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleOpen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCaptureOpen, handleOpen, handleClose]);

  // Focus title input on open
  useEffect(() => {
    if (isCaptureOpen) {
      setTimeout(() => titleInputRef.current?.focus(), 60);
    }
  }, [isCaptureOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    }
    if (isProjectDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isProjectDropdownOpen]);

  // Cmd+Enter to save
  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    }
  }

  async function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) return;

    const finalTitle = trimmedTitle || trimmedContent.slice(0, 80);
    const finalContent = trimmedContent || trimmedTitle;

    setError(null);
    try {
      await createJournalMutation.mutateAsync({
        title: finalTitle,
        content: finalContent,
        entryType: captureType,
        projectId: selectedProjectId || undefined,
        idempotencyKey: idempotencyKey || crypto.randomUUID(),
        occurredAt: new Date().toISOString(),
      });

      handleClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save journal entry";
      setError(msg);
    }
  }

  const isFocused = isCaptureOpen;

  return (
    <>
      {/* Scrim */}
      {isCaptureOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Dock — centered relative to canvas */}
      <div
        className="fixed bottom-4 z-50 pointer-events-none"
        style={{ left: "216px", right: "0" }}
      >
        <div className="mx-auto w-[520px] pointer-events-auto" ref={dockRef}>
          <div
            className={cn(
              "rounded-[10px] border bg-[#121612] transition-all duration-[200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              isFocused
                ? "border-[#99B9A3]/55 shadow-[0_0_0_1px_rgba(153,185,163,0.12),0_16px_44px_rgba(0,0,0,0.4)]"
                : "border-[#2B332D] shadow-[0_10px_35px_rgba(0,0,0,0.22)]"
            )}
          >
            {/* Collapsed — single bar */}
            {!isCaptureOpen && (
              <button
                type="button"
                onClick={handleOpen}
                id="quick-capture-trigger"
                className="flex w-full items-center gap-2.5 h-[44px] px-4 text-left group"
              >
                <Plus className="h-[14px] w-[14px] stroke-[1.5px] text-[#8E968E] group-hover:text-[#99B9A3] transition-colors shrink-0" />
                <span className="flex-1 text-[13px] text-[#C4CCC4] group-hover:text-[#F5F3EF] transition-colors select-none font-normal">
                  Capture something you don&apos;t want to forget
                </span>
                <kbd className="font-mono text-[10px] text-[#8E968E] shrink-0 font-medium px-1.5 py-0.5 rounded border border-[#222823] bg-[#171C18]">
                  C
                </kbd>
              </button>
            )}

            {/* Expanded */}
            {isCaptureOpen && (
              <div className="p-3.5 space-y-2.5 animate-fade-in-up">
                {/* Metadata row */}
                <div className="flex items-center justify-between gap-2 border-b border-[#222823] pb-2">
                  {/* Project selector dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                      className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-[0.04em] text-[#99B9A3] hover:text-[#B4CEBC] transition-colors px-1.5 py-1 rounded bg-[#171C18] border border-[#222823]"
                    >
                      {selectedProject ? (
                        <>
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: selectedProject.color || "#99B9A3" }}
                          />
                          <span className="truncate max-w-[140px]">{selectedProject.name}</span>
                        </>
                      ) : (
                        <span>General / No Project</span>
                      )}
                      <ChevronDown className="h-[11px] w-[11px] stroke-[1.5px]" />
                    </button>

                    {/* Dropdown menu */}
                    {isProjectDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-56 rounded-[8px] border border-[#222823] bg-[#090B0A] p-1 shadow-2xl z-50 max-h-48 overflow-y-auto space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(null);
                            setIsProjectDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[12px] text-left transition-colors",
                            selectedProjectId === null
                              ? "bg-[#171C18] text-[#F5F3EF]"
                              : "text-[#8E968E] hover:bg-[#121613] hover:text-[#C4CCC4]"
                          )}
                        >
                          <span>General / No Project</span>
                          {selectedProjectId === null && <Check className="h-3 w-3 text-[#99B9A3]" />}
                        </button>

                        {projects.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedProjectId(p.id);
                              setIsProjectDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[12px] text-left transition-colors",
                              selectedProjectId === p.id
                                ? "bg-[#171C18] text-[#F5F3EF]"
                                : "text-[#8E968E] hover:bg-[#121613] hover:text-[#C4CCC4]"
                            )}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: p.color || "#99B9A3" }}
                              />
                              <span className="truncate">{p.name}</span>
                            </div>
                            {selectedProjectId === p.id && <Check className="h-3 w-3 text-[#99B9A3]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Capture type selector */}
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {CAPTURE_TYPES.map((t) => (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => setCaptureType(t.type)}
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.06em] px-2 py-1 rounded-[4px] transition-colors shrink-0",
                          captureType === t.type
                            ? "text-[#C3AA78] bg-[rgba(195,170,120,0.15)] font-semibold border border-[#C3AA78]/30"
                            : "text-[#8E968E] hover:text-[#F5F3EF] hover:bg-[#171C18]"
                        )}
                      >
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>

                </div>

                {error && (
                  <p className="text-xs text-[#CB8585]">{error}</p>
                )}

                {/* Title Input */}
                <input
                  ref={titleInputRef}
                  id="quick-capture-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={activeConfig.placeholder}
                  className="w-full bg-transparent font-medium text-[14px] text-[#F5F3EF] placeholder:text-[#6E766E] outline-none"
                />

                {/* Content / Details Textarea */}
                <textarea
                  id="quick-capture-input"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add more details, links, or context (optional)..."
                  rows={2}
                  className="w-full resize-none bg-transparent text-[13px] leading-[1.6] text-[#C4CCC4] placeholder:text-[#525A54] outline-none"
                />

                {/* Footer — timestamp + save */}
                <div className="flex items-center justify-between pt-1 border-t border-[#222823]">
                  <span className="font-mono text-[10px] text-[#8E968E] uppercase tracking-[0.08em] font-medium">
                    {monthAbbr} {dayNum} · {time}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#8E968E] hover:text-[#F5F3EF] transition-colors px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      id="quick-capture-save"
                      onClick={handleSave}
                      disabled={(!title.trim() && !content.trim()) || createJournalMutation.isPending}
                      className="flex items-center gap-1.5 h-[28px] rounded-[6px] bg-[#99B9A3] border border-[#99B9A3] px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#090B0A] hover:bg-[#B4CEBC] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[120ms]"
                    >
                      {createJournalMutation.isPending ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span>Save</span>
                          <kbd className="text-[9px] text-[#090B0A]/70 font-mono">⌘↵</kbd>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

