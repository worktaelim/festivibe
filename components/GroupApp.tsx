"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getGroup,
  addMember,
  subscribeMembers,
  subscribePicks,
  togglePick,
  randomColor,
  compressImage,
  type Group,
  type Member,
  type ArtistPick,
} from "@/lib/db";
import { ARTISTS, DAY_LABELS, type Day } from "@/lib/artists";

// ── helpers ──────────────────────────────────────────────────────────────────

function Avatar({
  member,
  size = 28,
}: {
  member: { name: string; photo_url: string; color: string };
  size?: number;
}) {
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return member.photo_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={member.photo_url}
      alt={member.name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #0a0a0f",
        flexShrink: 0,
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: member.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 700,
        color: "#fff",
        border: "2px solid #0a0a0f",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function AvatarStack({
  members,
  maxShow = 4,
}: {
  members: Member[];
  maxShow?: number;
}) {
  const shown = members.slice(0, maxShow);
  const extra = members.length - maxShow;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((m, i) => (
        <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: maxShow - i }}>
          <Avatar member={m} size={26} />
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            marginLeft: -8,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "rgba(240,240,245,0.7)",
            border: "2px solid #0a0a0f",
            fontWeight: 600,
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

// ── Join form ─────────────────────────────────────────────────────────────────

function JoinForm({
  group,
  onJoin,
}: {
  group: Group;
  onJoin: (memberId: string) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"photo" | "info">("photo");

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await compressImage(file);
    setPhotoUrl(url);
    setStep("info");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const id = await addMember(group.id, {
        name: name.trim(),
        phone: phone.trim(),
        photo_url: photoUrl,
        color: randomColor(),
      });
      localStorage.setItem(`festivibe_member_${group.id}`, id);
      onJoin(id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🌵</div>
        <div className="gradient-text" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>
          Festivibe
        </div>
        <div style={{ color: "rgba(240,240,245,0.5)", fontSize: 14, marginTop: 6 }}>
          Coachella 2026 · Week 2
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#13131a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "28px 24px",
          width: "100%",
          maxWidth: 380,
        }}
      >
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "rgba(240,240,245,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            you&apos;re joining
          </div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{group.name}</div>
        </div>

        {step === "photo" ? (
          <div style={{ textAlign: "center" }}>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  background: "rgba(247,37,133,0.12)",
                  border: "2px dashed rgba(247,37,133,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                }}
              >
                📸
              </div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Add your photo</div>
              <div style={{ fontSize: 13, color: "rgba(240,240,245,0.45)" }}>
                Your crew will see this next to artists you pick
              </div>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
            </label>
            <button
              onClick={() => setStep("info")}
              style={{
                marginTop: 20,
                background: "none",
                border: "none",
                color: "rgba(240,240,245,0.4)",
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Skip for now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {photoUrl && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="your photo"
                  style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }}
                />
              </div>
            )}
            <input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={loading || !name.trim()}
              style={primaryBtnStyle(loading || !name.trim())}
            >
              {loading ? "Joining..." : "Join the crew"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Lineup Tab ────────────────────────────────────────────────────────────────

function LineupTab({
  memberId,
  members,
  picks,
  onToggle,
}: {
  memberId: string;
  members: Member[];
  picks: ArtistPick[];
  onToggle: (artistId: string) => void;
}) {
  const [activeDay, setActiveDay] = useState<Day>("fri");
  const [search, setSearch] = useState("");

  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  const myPicks = new Set(
    picks.filter((p) => p.member_id === memberId).map((p) => p.artist_id)
  );

  const dayArtists = ARTISTS.filter((a) => a.day === activeDay);
  const filtered = search.trim()
    ? dayArtists.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    : dayArtists;

  function interestedMembers(artistId: string): Member[] {
    return picks
      .filter((p) => p.artist_id === artistId)
      .map((p) => memberMap[p.member_id])
      .filter(Boolean) as Member[];
  }

  const days: Day[] = ["fri", "sat", "sun"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Day tabs */}
      <div
        style={{
          display: "flex",
          padding: "12px 16px 0",
          gap: 8,
          background: "#0a0a0f",
        }}
      >
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 12,
              border: "none",
              background: activeDay === d
                ? dayGradient(d)
                : "rgba(255,255,255,0.06)",
              color: activeDay === d ? "#fff" : "rgba(240,240,245,0.5)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {DAY_LABELS[d].split(" ")[0]}
            <br />
            <span style={{ fontSize: 10, fontWeight: 500 }}>
              {DAY_LABELS[d].split(" ").slice(1).join(" ")}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: "12px 16px" }}>
        <input
          placeholder="Search artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputStyle,
            width: "100%",
            fontSize: 14,
            padding: "10px 14px",
          }}
        />
      </div>

      {/* Artist list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 100px" }}>
        {filtered.map((artist) => {
          const interested = interestedMembers(artist.id);
          const isPicked = myPicks.has(artist.id);
          return (
            <div
              key={artist.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.2 }}>
                  {artist.name}
                </div>
                {interested.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <AvatarStack members={interested} />
                    <span style={{ fontSize: 12, color: "rgba(240,240,245,0.4)" }}>
                      {interested.length === 1
                        ? `${interested[0].name.split(" ")[0]} is in`
                        : `${interested.length} going`}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onToggle(artist.id)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "none",
                  background: isPicked
                    ? "rgba(247,37,133,0.2)"
                    : "rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }}
              >
                {isPicked ? "♥" : "♡"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── My Picks Tab ──────────────────────────────────────────────────────────────

function PicksTab({
  groupId,
  memberId,
  members,
  picks,
}: {
  groupId: string;
  memberId: string;
  members: Member[];
  picks: ArtistPick[];
}) {
  const days: Day[] = ["fri", "sat", "sun"];
  const myPickSet = new Set(
    picks.filter((p) => p.member_id === memberId).map((p) => p.artist_id)
  );
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  const myPicks = ARTISTS.filter((a) => myPickSet.has(a.id));

  function interestedOthers(artistId: string): Member[] {
    return picks
      .filter((p) => p.artist_id === artistId && p.member_id !== memberId)
      .map((p) => memberMap[p.member_id])
      .filter(Boolean) as Member[];
  }

  if (myPicks.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          textAlign: "center",
          color: "rgba(240,240,245,0.45)",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 48 }}>♡</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>No picks yet</div>
        <div style={{ fontSize: 14 }}>Tap the heart on artists in the Lineup tab</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
      {days.map((day) => {
        const dayArtists = myPicks.filter((a) => a.day === day);
        if (dayArtists.length === 0) return null;
        return (
          <div key={day} style={{ marginBottom: 28 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: dayColor(day),
                marginBottom: 10,
              }}
            >
              {DAY_LABELS[day]}
            </div>
            {dayArtists.map((artist) => {
              const others = interestedOthers(artist.id);
              return (
                <div
                  key={artist.id}
                  style={{
                    background: "#13131a",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    padding: "14px 16px",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{artist.name}</div>
                    {others.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                        <AvatarStack members={others} maxShow={3} />
                        <span style={{ fontSize: 12, color: "rgba(240,240,245,0.4)" }}>
                          also going
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => togglePick(groupId, memberId, artist.id, true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(240,240,245,0.3)",
                      fontSize: 20,
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Crew Tab ──────────────────────────────────────────────────────────────────

function CrewTab({
  members,
  picks,
  currentMemberId,
}: {
  members: Member[];
  picks: ArtistPick[];
  currentMemberId: string;
}) {
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  // Group picks by artistId
  const byArtist: Record<string, Member[]> = {};
  for (const pick of picks) {
    if (!byArtist[pick.artist_id]) byArtist[pick.artist_id] = [];
    const m = memberMap[pick.member_id];
    if (m) byArtist[pick.artist_id].push(m);
  }

  // Artists with 2+ interested, sorted by count descending
  const shared = Object.entries(byArtist)
    .filter(([, ms]) => ms.length >= 2)
    .sort((a, b) => b[1].length - a[1].length);

  // Current member's picks
  const myPicked = new Set(
    picks.filter((p) => p.member_id === currentMemberId).map((p) => p.artist_id)
  );

  function artistName(id: string): string {
    return ARTISTS.find((a) => a.id === id)?.name ?? id;
  }

  function artistDay(id: string): Day | undefined {
    return ARTISTS.find((a) => a.id === id)?.day;
  }

  if (shared.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          textAlign: "center",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 48 }}>👥</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>No matches yet</div>
        <div style={{ fontSize: 14, color: "rgba(240,240,245,0.45)" }}>
          Overlaps appear when 2+ crew members pick the same artist
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
      <div style={{ fontSize: 13, color: "rgba(240,240,245,0.45)", marginBottom: 16 }}>
        Artists your crew wants to see together
      </div>
      {shared.map(([artistId, interested]) => {
        const day = artistDay(artistId);
        const iMine = myPicked.has(artistId);
        return (
          <div
            key={artistId}
            style={{
              background: iMine ? "rgba(247,37,133,0.08)" : "#13131a",
              border: `1px solid ${iMine ? "rgba(247,37,133,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 18,
              padding: "16px",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                  {artistName(artistId)}
                </div>
                {day && (
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: dayBgColor(day),
                      color: dayColor(day),
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {DAY_LABELS[day]}
                  </div>
                )}
              </div>
              <div
                style={{
                  background: dayGradient(day ?? "fri"),
                  borderRadius: 12,
                  padding: "4px 10px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {interested.length}
              </div>
            </div>

            {/* Member list with tap-to-text */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {interested.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar member={m} size={32} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</span>
                  </div>
                  {m.phone && m.id !== currentMemberId && (
                    <a
                      href={`sms:${m.phone}`}
                      style={{
                        fontSize: 12,
                        color: "var(--accent-cyan)",
                        textDecoration: "none",
                        background: "rgba(76,201,240,0.1)",
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontWeight: 600,
                      }}
                    >
                      Text
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────

type Tab = "lineup" | "picks" | "crew";

function BottomNav({
  active,
  onChange,
  myPickCount,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  myPickCount: number;
}) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "lineup", label: "Lineup", icon: "🎵" },
    { id: "picks", label: "My Picks", icon: "♥" },
    { id: "crew", label: "Crew", icon: "👥" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
        zIndex: 100,
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            padding: "6px 0",
            position: "relative",
          }}
        >
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            {t.id === "picks" && myPickCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  right: -8,
                  background: "#f72585",
                  color: "#fff",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  minWidth: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 3px",
                }}
              >
                {myPickCount}
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: active === t.id ? 700 : 500,
              color: active === t.id ? "#f72585" : "rgba(240,240,245,0.4)",
            }}
          >
            {t.label}
          </span>
          {active === t.id && (
            <div
              style={{
                position: "absolute",
                bottom: -8,
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#f72585",
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Top header ────────────────────────────────────────────────────────────────

function Header({
  group,
  members,
  currentMember,
  onShareInvite,
}: {
  group: Group;
  members: Member[];
  currentMember: Member | undefined;
  onShareInvite: () => void;
}) {
  return (
    <div
      style={{
        padding: "16px 16px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#0a0a0f",
      }}
    >
      <div>
        <div className="gradient-text" style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>
          Festivibe
        </div>
        <div style={{ fontSize: 13, color: "rgba(240,240,245,0.45)", marginTop: 1 }}>
          {group.name} · {members.length} crew
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={onShareInvite}
          style={{
            background: "rgba(247,37,133,0.15)",
            border: "1px solid rgba(247,37,133,0.3)",
            borderRadius: 999,
            color: "#f72585",
            fontSize: 12,
            fontWeight: 700,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          + Invite
        </button>
        {currentMember && <Avatar member={currentMember} size={34} />}
      </div>
    </div>
  );
}

// ── Main GroupApp ─────────────────────────────────────────────────────────────

export default function GroupApp({ groupId }: { groupId: string }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [picks, setPicks] = useState<ArtistPick[]>([]);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("lineup");
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load group
  useEffect(() => {
    getGroup(groupId).then((g) => {
      if (!g) setNotFound(true);
      else setGroup(g);
      setLoading(false);
    });
  }, [groupId]);

  // Check localStorage for membership
  useEffect(() => {
    const stored = localStorage.getItem(`festivibe_member_${groupId}`);
    if (stored) setMemberId(stored);
  }, [groupId]);

  // Subscribe to members + picks once group is confirmed
  useEffect(() => {
    if (!group) return;
    const unsub1 = subscribeMembers(groupId, setMembers);
    const unsub2 = subscribePicks(groupId, setPicks);
    return () => { unsub1(); unsub2(); };
  }, [group, groupId]);

  const handleJoin = useCallback((id: string) => {
    setMemberId(id);
  }, []);

  function handleShareInvite() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <div style={{ color: "rgba(240,240,245,0.4)", fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0a0f", gap: 12, padding: 24 }}>
        <div style={{ fontSize: 48 }}>🌵</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Group not found</div>
        <div style={{ fontSize: 14, color: "rgba(240,240,245,0.45)", textAlign: "center" }}>
          This invite link may be invalid or expired.
        </div>
        <a href="/" style={{ color: "#f72585", fontSize: 14, fontWeight: 600 }}>Create a new group</a>
      </div>
    );
  }

  if (!group) return null;

  if (!memberId) {
    return <JoinForm group={group} onJoin={handleJoin} />;
  }

  const currentMember = members.find((m) => m.id === memberId);
  const myPickCount = picks.filter((p) => p.member_id === memberId).length;

  async function handleToggle(artistId: string) {
    const pickId = `${memberId}_${artistId}`;
    const isCurrentlyPicked = picks.some(
      (p) => p.member_id === memberId && p.artist_id === artistId
    );
    // Optimistically update local state immediately
    if (isCurrentlyPicked) {
      setPicks((prev) => prev.filter((p) => p.id !== pickId));
    } else {
      setPicks((prev) => [
        ...prev,
        { id: pickId, group_id: groupId, member_id: memberId!, artist_id: artistId, created_at: new Date().toISOString() },
      ]);
    }
    // Sync to server (real-time will reconcile other members' views)
    try {
      await togglePick(groupId, memberId!, artistId, isCurrentlyPicked);
    } catch {
      // Revert on server error
      setPicks((prev) =>
        isCurrentlyPicked
          ? [...prev, { id: pickId, group_id: groupId, member_id: memberId!, artist_id: artistId, created_at: new Date().toISOString() }]
          : prev.filter((p) => p.id !== pickId)
      );
    }
  }

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#0a0a0f", overflow: "hidden" }}>
      {copied && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#06d6a0",
            color: "#0a0a0f",
            borderRadius: 999,
            padding: "8px 20px",
            fontSize: 13,
            fontWeight: 700,
            zIndex: 999,
          }}
        >
          Invite link copied!
        </div>
      )}

      <Header
        group={group}
        members={members}
        currentMember={currentMember}
        onShareInvite={handleShareInvite}
      />

      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {activeTab === "lineup" && (
          <LineupTab
            memberId={memberId}
            members={members}
            picks={picks}
            onToggle={handleToggle}
          />
        )}
        {activeTab === "picks" && (
          <PicksTab
            groupId={groupId}
            memberId={memberId}
            members={members}
            picks={picks}
          />
        )}
        {activeTab === "crew" && (
          <CrewTab
            members={members}
            picks={picks}
            currentMemberId={memberId}
          />
        )}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} myPickCount={myPickCount} />
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#f0f0f5",
  fontSize: 15,
  padding: "12px 14px",
  outline: "none",
  width: "100%",
};

function primaryBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? "rgba(247,37,133,0.3)" : "linear-gradient(135deg, #f72585, #7b2fff)",
    border: "none",
    borderRadius: 14,
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    padding: "14px",
    cursor: disabled ? "not-allowed" : "pointer",
    width: "100%",
    marginTop: 4,
  };
}

function dayColor(day: Day): string {
  return { fri: "#f72585", sat: "#fb8500", sun: "#a78bfa" }[day];
}

function dayBgColor(day: Day): string {
  return {
    fri: "rgba(247,37,133,0.12)",
    sat: "rgba(251,133,0,0.12)",
    sun: "rgba(123,47,255,0.12)",
  }[day];
}

function dayGradient(day: Day): string {
  return {
    fri: "linear-gradient(135deg, #f72585, #c9184a)",
    sat: "linear-gradient(135deg, #fb8500, #f4a261)",
    sun: "linear-gradient(135deg, #7b2fff, #4cc9f0)",
  }[day];
}
