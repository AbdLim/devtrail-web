"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useWorkbenchStore } from "@/stores/use-workbench-store";

const CAPTURE_TYPES = ["Learning", "Decision", "Win", "Blocker", "Note"] as const;
type CaptureType = (typeof CAPTURE_TYPES)[number];

export function QuickCaptureDock() {
  const { isCaptureOpen, openCapture, closeCapture } = useWorkbenchStore();
  const [text, setText] = useState("");
  const [captureType, setCaptureType] = useState<CaptureType>("Note");
  const [project, setProject] = useState("Curri AI");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const monthAbbr = today.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayNum = today.getDate().toString().padStart(2, "0");
  const time = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  const handleOpen = useCallback(() => openCapture(), [openCapture]);
  const handleClose = useCallback(() => {
    closeCapture();
    setText("");
  }, [closeCapture]);

  /* ─── Keyboard shortcut: C to open, Esc to close ─── */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isCaptureOpen) {
        handleClose();
        return;
      }
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key === "c" && !isTyping && !isCaptureOpen && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleOpen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCaptureOpen, handleOpen, handleClose]);

  useEffect(() => {
    if (isCaptureOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isCaptureOpen]);

  /* ─── Cmd+Enter to save ───────────────────────────── */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    }
  }

  function handleSave() {
    if (!text.trim()) return;
    // TODO: connect to capture API
    console.log("Captured:", { text, captureType, project });
    setText("");
    handleClose();
  }

  const isFocused = isCaptureOpen;

  return (
    <>
      {/* ─── Scrim ──────────────────────────────────────── */}
      {isCaptureOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* ─── Dock — centered relative to canvas ─────────── */}
      <div
        className="fixed bottom-4 z-50 pointer-events-none"
        style={{ left: "216px", right: "0" }} // align to main canvas
      >
        <div className="mx-auto w-[480px] pointer-events-auto" ref={dockRef}>
          <div
            className={cn(
              "rounded-[8px] border bg-[#121612] transition-all duration-[200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              isFocused
                ? "border-[#99B9A3]/55 shadow-[0_0_0_1px_rgba(153,185,163,0.12),0_12px_38px_rgba(0,0,0,0.28)]"
                : "border-[#2B332D] shadow-[0_10px_35px_rgba(0,0,0,0.22)]"
            )}
          >
            {/* ─── Collapsed — single bar ─────────── */}
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
                <kbd className="font-mono text-[10px] text-[#8E968E] shrink-0 font-medium">C</kbd>
              </button>
            )}

            {/* ─── Expanded ───────────────────────── */}
            {isCaptureOpen && (
              <div className="p-3 space-y-2 animate-fade-in-up">
                {/* Metadata row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Project selector */}
                    <button
                      type="button"
                      className="flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.10em] text-[#99B9A3] hover:text-[#B4CEBC] transition-colors"
                    >
                      {project}
                      <ChevronDown className="h-[11px] w-[11px] stroke-[1.5px]" />
                    </button>
                  </div>
                  {/* Capture type selector */}
                  <div className="flex items-center gap-1">
                    {CAPTURE_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCaptureType(t)}
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[4px] transition-colors",
                          captureType === t
                            ? "text-[#C3AA78] bg-[rgba(195,170,120,0.12)] font-semibold"
                            : "text-[#8E968E] hover:text-[#F5F3EF]"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea — visually dominant */}
                <textarea
                  ref={textareaRef}
                  id="quick-capture-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What did you learn, decide, or accomplish?"
                  rows={3}
                  className="w-full resize-none bg-transparent text-[14px] leading-[1.6] text-[#F5F3EF] placeholder:text-[#6E766E] outline-none"
                />

                {/* Footer — timestamp + save */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[10px] text-[#8E968E] uppercase tracking-[0.08em] font-medium">
                    {monthAbbr} {dayNum} · {time}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#8E968E] hover:text-[#F5F3EF] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      id="quick-capture-save"
                      onClick={handleSave}
                      disabled={!text.trim()}
                      className="flex items-center gap-1.5 h-[28px] rounded-[6px] bg-[#1B211D] border border-[#2B332D] px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#99B9A3] hover:bg-[#222823] hover:border-[#99B9A3]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-[120ms] animate-button-press"
                    >
                      Save
                      <kbd className="text-[9px] text-[#8AA792]">⌘↵</kbd>
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
