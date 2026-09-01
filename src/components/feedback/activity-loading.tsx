/* ─── Activity River Loading State (§57) ─────────────── */

export function ActivityLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-0">
          {/* Time column */}
          <div className="w-[56px] shrink-0 pt-[3px]">
            <div
              className="h-3 w-10 bg-[#222823] rounded-sm animate-[skeletonPulse_2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          </div>

          {/* Marker column */}
          <div className="w-6 shrink-0 flex flex-col items-center">
            <div
              className="w-2 h-2 rounded-full bg-[#222823] mt-0.5 animate-[skeletonPulse_2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 150}ms` }}
            />
            {i < count - 1 && (
              <div className="w-px flex-1 mt-1 mb-0 bg-[#222823]" />
            )}
          </div>

          {/* Content column */}
          <div className="flex-1 pb-8 pl-3 min-w-0 space-y-2">
            <div
              className="h-3 w-20 bg-[#222823] rounded-sm animate-[skeletonPulse_2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 150}ms` }}
            />
            <div
              className="h-4 w-4/5 bg-[#222823] rounded-sm animate-[skeletonPulse_2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 150 + 50}ms` }}
            />
            <div
              className="h-3 w-2/3 bg-[#222823] rounded-sm animate-[skeletonPulse_2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 150 + 100}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
