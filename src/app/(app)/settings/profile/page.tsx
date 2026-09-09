"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { User, Mail, Briefcase, MapPin, Globe, Link2, Clock, ShieldCheck, Code2 } from "lucide-react";

function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#1A1F1B] last:border-0">
      <Icon className="mt-0.5 h-[14px] w-[14px] shrink-0 stroke-[1.5px] text-[#8E968E]" />
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[#505650] mb-0.5">{label}</p>
        <p className={`text-[13px] text-[#C4CCC4] truncate ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function SkillBadge({ skill }: { skill: string }) {
  return (
    <span className="inline-flex items-center rounded-[4px] border border-[#222823] bg-[#121613] px-2 py-0.5 font-mono text-[11px] text-[#8E968E]">
      {skill}
    </span>
  );
}

export default function ProfileSettingsPage() {
  const { user, isLoading } = useAuth();

  const profile = user?.profile;
  const displayName =
    profile?.displayName ||
    [profile?.firstName || user?.firstname, profile?.lastName || user?.lastname]
      .filter(Boolean)
      .join(" ") ||
    user?.email?.split("@")[0] ||
    "—";

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="h-8 w-48 rounded bg-[#121613] animate-pulse" />
        <div className="h-40 rounded-[8px] bg-[#121613] animate-pulse" />
        <div className="h-48 rounded-[8px] bg-[#121613] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8 select-none">
      {/* Page Header */}
      <div className="space-y-1">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.10em] text-[#8E968E]">
          Settings
        </p>
        <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.035em] text-[#F5F3EF]">
          Profile
        </h1>
        <p className="text-[14px] text-[#C4CCC4]">
          Your account identity and developer profile details.
        </p>
      </div>

      {/* Identity Card */}
      <div className="rounded-[8px] border border-[#222823] bg-[#0E1210] overflow-hidden">
        {/* Avatar + name banner */}
        <div className="flex items-center gap-4 border-b border-[#1A1F1B] p-5">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={displayName}
              className="h-12 w-12 rounded-full object-cover border border-[#222823]"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#171C18] border border-[#222823] font-mono text-[16px] font-bold text-[#99B9A3]">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-semibold text-[#F5F3EF] truncate">{displayName}</h2>
            {profile?.jobTitle && (
              <p className="font-mono text-[12px] text-[#8E968E]">{profile.jobTitle}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 rounded-[4px] border border-[#99B9A3]/20 bg-[#99B9A3]/5 px-2.5 py-1">
            <ShieldCheck className="h-[12px] w-[12px] stroke-[1.5px] text-[#99B9A3]" />
            <span className="font-mono text-[10px] text-[#99B9A3]">
              {user?.is_email_verified || user?.emailVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        {/* Account fields */}
        <div className="px-5">
          <InfoRow icon={Mail} label="Email" value={user?.email} mono />
          <InfoRow
            icon={User}
            label="Full Name"
            value={[profile?.firstName || user?.firstname, profile?.lastName || user?.lastname]
              .filter(Boolean)
              .join(" ") || null}
          />
          <InfoRow icon={User} label="Username" value={profile?.username} mono />
          <InfoRow icon={Briefcase} label="Job Title" value={profile?.jobTitle} />
          <InfoRow icon={Briefcase} label="Company" value={profile?.company} />
          <InfoRow icon={MapPin} label="Location" value={profile?.location} />
          <InfoRow icon={Globe} label="Website" value={profile?.websiteUrl} mono />
          <InfoRow icon={Link2} label="GitHub Username" value={profile?.githubUsername} mono />
          <InfoRow icon={Clock} label="Timezone" value={profile?.timezone} mono />
        </div>
      </div>

      {/* Bio */}
      {profile?.bio && (
        <div className="rounded-[8px] border border-[#222823] bg-[#0E1210] p-5 space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[#505650]">Bio</p>
          <p className="text-[13px] text-[#C4CCC4] leading-[1.6]">{profile.bio}</p>
        </div>
      )}

      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <div className="rounded-[8px] border border-[#222823] bg-[#0E1210] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-[14px] w-[14px] stroke-[1.5px] text-[#8E968E]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[#505650]">Skills</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
          </div>
        </div>
      )}

      {/* Account Meta */}
      <div className="rounded-[8px] border border-[#222823] bg-[#0E1210] p-5 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[#505650]">Account</p>
        <div className="space-y-2 font-mono text-[12px] text-[#8E968E]">
          <div className="flex justify-between">
            <span>User ID</span>
            <span className="text-[#505650]">{user?.id ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Profile complete</span>
            <span className={user?.is_profile_completed || user?.profileComplete ? "text-[#99B9A3]" : "text-[#CB8585]"}>
              {user?.is_profile_completed || user?.profileComplete ? "Yes" : "No"}
            </span>
          </div>
          {user?.created_at && (
            <div className="flex justify-between">
              <span>Member since</span>
              <span className="text-[#505650]">
                {new Date(user.created_at).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
