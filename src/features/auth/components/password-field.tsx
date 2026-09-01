"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type PasswordFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  id: string;
};

export function PasswordField({ label, error, id, className, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-mono text-[#A3AAA5]">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "w-full rounded-md border border-[#252A28] bg-[#0D0F0F] px-3 py-2 pr-10 text-xs text-[#F1F0EA] placeholder-[#737A76] transition focus:border-[#91AD9D] focus:outline-none",
            error && "border-[#C98383]/60 focus:border-[#C98383]",
            className,
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737A76] hover:text-[#F1F0EA] focus:outline-none"
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[#C98383]">
          {error}
        </p>
      )}
    </div>
  );
}
