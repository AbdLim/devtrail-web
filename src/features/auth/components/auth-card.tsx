import { cn } from "@/lib/utils/cn";

type AuthCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-xl border border-[#252A28] bg-[#121515] p-6 sm:p-8 shadow-2xl backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
