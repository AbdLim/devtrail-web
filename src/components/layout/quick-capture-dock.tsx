"use client";

import { useEffect, useState } from "react";
import { Plus, X, CornerDownLeft, Sparkles, Check, AlertCircle } from "lucide-react";
import { useWorkbenchStore } from "@/stores/use-workbench-store";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

const entryKinds = [
  { id: "note", label: "Note" },
  { id: "accomplishment", label: "Accomplishment" },
  { id: "learning", label: "Learning" },
  { id: "blocker", label: "Blocker" },
  { id: "decision", label: "Decision" },
] as const;

export function QuickCaptureDock() {
  const { isQuickCaptureOpen, setQuickCaptureOpen } = useWorkbenchStore();
  const [content, setContent] = useState("");
  const [kind, setKind] = useState<string>("note");
  const [project, setProject] = useState<string>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Global hotkey listener for 'C' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "c" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        const activeElement = document.activeElement;
        const isInput =
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA" ||
          activeElement?.tagName === "SELECT" ||
          activeElement?.getAttribute("contenteditable") === "true";

        if (!isInput) {
          e.preventDefault();
          setQuickCaptureOpen(true);
        }
      }

      if (e.key === "Escape" && isQuickCaptureOpen) {
        setQuickCaptureOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isQuickCaptureOpen, setQuickCaptureOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate quick capture save (Phase 4 backend API integration will wire this up)
      toast.success("Journal note recorded to career memory!");
      setContent("");
      setQuickCaptureOpen(false);
    } catch {
      toast.error("Failed to record note");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isQuickCaptureOpen) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 hidden md:block">
        <button
          type="button"
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-3 rounded-full border border-[#252A28] bg-[#121515]/90 px-4 py-2 text-xs text-[#A3AAA5] shadow-xl backdrop-blur-md hover:border-[#91AD9D]/40 hover:text-[#F1F0EA] transition-all"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#91AD9D]/15 text-[#91AD9D]">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span>What did you work on?</span>
          <kbd className="font-mono text-[10px] bg-[#171A19] border border-[#252A28] px-1.5 py-0.5 rounded text-[#737A76] ml-2">
            C
          </kbd>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4 flex justify-center bg-gradient-to-t from-[#0D0F0F] via-[#0D0F0F]/80 to-transparent">
      <div className="w-full max-w-xl rounded-xl border border-[#252A28] bg-[#121515] p-3 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between border-b border-[#252A28] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#737A76]">Kind:</span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {entryKinds.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKind(k.id)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-medium transition",
                      kind === k.id
                        ? "bg-[#91AD9D]/15 text-[#91AD9D] border border-[#91AD9D]/30"
                        : "text-[#737A76] hover:text-[#A3AAA5] hover:bg-[#171A19]"
                    )}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQuickCaptureOpen(false)}
              className="p-1 text-[#737A76] hover:text-[#F1F0EA] rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Note Input */}
          <textarea
            autoFocus
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Record a decision, technical accomplishment, or blocker..."
            className="w-full bg-transparent text-xs text-[#F1F0EA] placeholder-[#737A76] resize-none focus:outline-none"
          />

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="bg-[#171A19] border border-[#252A28] text-[11px] font-mono text-[#A3AAA5] rounded px-2 py-1 focus:outline-none"
            >
              <option value="general">General / No Project</option>
              <option value="devtrail">DevTrail Web</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuickCaptureOpen(false)}
                className="px-3 py-1 text-xs text-[#737A76] hover:text-[#F1F0EA]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="flex items-center gap-1.5 rounded bg-[#91AD9D] px-3 py-1 text-xs font-medium text-[#0D0F0F] hover:bg-[#B1CCBC] disabled:opacity-50 transition"
              >
                <span>Save</span>
                <CornerDownLeft className="h-3 w-3" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
