"use client";

import { X, ExternalLink } from "lucide-react";
import { useWorkbenchStore } from "@/stores/use-workbench-store";

function InspectorSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8E968E]">
        {label}
      </p>
      <div className="text-[13px] text-[#E0E5E0] leading-[1.5]">{children}</div>
    </div>
  );
}

export function InspectorDrawer() {
  const { inspector, closeInspector } = useWorkbenchStore();
  const data = inspector.data;

  if (!data) return null;

  const d = data.data as {
    description?: string;
    project?: string;
    repo?: string;
    timestamp?: string;
    tags?: string[];
    url?: string;
    label?: string;
    meta?: string;
  };

  const isGitHub = data.type === "evidence";

  return (
    <aside
      className="w-[320px] shrink-0 border-l border-[#222823] bg-[#0F1310] flex flex-col overflow-hidden"
      style={{
        boxShadow: "-18px 0 40px rgba(0,0,0,0.18)",
        animation: "inspectorSlideIn 220ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
      }}
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#222823] px-4">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8E968E]">
          Evidence Panel
        </span>
        <button
          type="button"
          onClick={closeInspector}
          title="Close inspector"
          className="rounded p-1 text-[#8E968E] hover:bg-[#191E1A] hover:text-[#F5F3EF] transition-colors"
        >
          <X className="h-[14px] w-[14px] stroke-[1.5px]" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Primary identifier */}
        {d.meta && (
          <p className="font-mono text-[12px] text-[#8AA792] font-semibold tracking-[0.02em] uppercase">
            {d.label ?? "Activity"}
          </p>
        )}

        <h2 className="text-[15px] font-semibold leading-[1.35] text-[#F5F3EF]">
          {data.title}
        </h2>

        {data.subtitle && (
          <p className="font-mono text-[11px] text-[#8E968E] uppercase tracking-[0.05em]">
            {data.subtitle}
          </p>
        )}

        {/* Description if present */}
        {d.description && (
          <p className="text-[13px] text-[#C4CCC4] leading-[1.6]">
            {d.description}
          </p>
        )}

        <div className="border-t border-[#222823]" />

        {/* Structured metadata sections */}
        <div className="space-y-4">
          {isGitHub && (
            <InspectorSection label="Source">
              <span className="text-[#F5F3EF] font-medium">GitHub</span>
            </InspectorSection>
          )}
          {!isGitHub && (
            <InspectorSection label="Source">
              <span className="text-[#F5F3EF] font-medium">Manual note</span>
            </InspectorSection>
          )}

          {d.project && (
            <InspectorSection label="Project">
              <span className="text-[#F5F3EF] font-medium">{d.project}</span>
            </InspectorSection>
          )}

          {d.repo && (
            <InspectorSection label="Repository">
              <span className="font-mono text-[12px] text-[#F5F3EF]">{d.repo}</span>
            </InspectorSection>
          )}

          {d.tags && d.tags.length > 0 && (
            <InspectorSection label="Technologies">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {d.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] text-[#C4CCC4]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </InspectorSection>
          )}

          {d.timestamp && (
            <InspectorSection label="Verified">
              <span className="font-mono text-[12px] text-[#F5F3EF]">{d.timestamp}</span>
            </InspectorSection>
          )}
        </div>

        {/* External link if present */}
        {d.url && (
          <>
            <div className="border-t border-[#222823]" />
            <a
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#99B9A3] hover:text-[#B4CEBC] transition-colors"
            >
              Open on GitHub
              <ExternalLink className="h-[12px] w-[12px] stroke-[1.5px]" />
            </a>
          </>
        )}
      </div>
    </aside>
  );
}
