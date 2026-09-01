"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

type AvatarPickerProps = {
  onSelect?: (file: File) => void;
};

export function AvatarPicker({ onSelect }: AvatarPickerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const url = URL.createObjectURL(file);
    // revoke old preview
    if (preview) URL.revokeObjectURL(preview);
    setPreview(url);
    onSelect?.(file);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative h-20 w-20 overflow-hidden rounded-full border-2 border-dashed border-white/20 bg-white/5 transition hover:border-indigo-500/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        )}
        aria-label="Upload profile photo"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs text-white/40 group-hover:text-white/70">
            Photo
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="sr-only"
        aria-label="Upload photo"
      />
      <p className="text-xs text-white/40">Optional. JPG, PNG or WebP, max 5 MB.</p>
    </div>
  );
}
