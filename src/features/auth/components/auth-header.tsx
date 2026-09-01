type AuthHeaderProps = {
  title: string;
  description?: string;
};

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-white/60">{description}</p>
      )}
    </div>
  );
}
