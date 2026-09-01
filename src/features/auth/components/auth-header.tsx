type AuthHeaderProps = {
  title: string;
  description?: string;
};

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="mb-6 space-y-1 text-left">
      <h1 className="text-xl font-semibold tracking-tight text-[#F1F0EA]">{title}</h1>
      {description && (
        <p className="text-xs text-[#A3AAA5] leading-relaxed">{description}</p>
      )}
    </div>
  );
}
