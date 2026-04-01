"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  CactusIcon, CameraIcon, HeartIcon, HeartEmptyLarge,
  CrewIcon, MusicIconLarge, HeartNavIcon, CrewNavIcon,
  LightningIcon, CloseIcon,
} from "./Icons";
import {
  getGroup,
  addMember,
  updateMember,
  subscribeMembers,
  subscribePicks,
  togglePick,
  randomColor,
  compressImage,
  type Group,
  type Member,
  type ArtistPick,
} from "@/lib/db";
import { ARTISTS, getDayLabels, STAGES, timeToMinutes, type Day, type Artist } from "@/lib/artists";
import { supabase } from "@/lib/supabase";

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

const PRESET_AVATARS = [
  { id: "van",    src: "/avatars/van.png",    label: "Van" },
  { id: "palms",  src: "/avatars/palms.png",  label: "Palms" },
  { id: "tshirt", src: "/avatars/tshirt.png", label: "T-Shirt" },
  { id: "tent",   src: "/avatars/tent.png",   label: "Tent" },
];

function JoinForm({
  group,
  onJoin,
}: {
  group: Group;
  onJoin: (memberId: string) => void;
}) {
  const savedProfile = typeof window !== "undefined"
    ? (() => { try { return JSON.parse(localStorage.getItem("festivibe_user") ?? "{}"); } catch { return {}; } })()
    : {};

  const [name, setName] = useState<string>(savedProfile.name ?? "");
  const [phone, setPhone] = useState<string>(savedProfile.phone ?? "");
  const [photoUrl, setPhotoUrl] = useState<string>(savedProfile.photo_url ?? "");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await compressImage(file);
    setPhotoUrl(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    if (!name.trim()) { setNameError("Name is required"); valid = false; }
    else setNameError("");
    if (!phone.trim()) { setPhoneError("Phone number is required"); valid = false; }
    else setPhoneError("");
    if (!valid) return;

    setLoading(true);
    try {
      const id = await addMember(group.id, {
        name: name.trim(),
        phone: phone.trim(),
        photo_url: photoUrl,
        color: randomColor(),
      });
      localStorage.setItem(`festivibe_member_${group.id}`, id);
      localStorage.setItem("festivibe_user", JSON.stringify({ name: name.trim(), phone: phone.trim(), photo_url: photoUrl }));
      onJoin(id);
    } finally {
      setLoading(false);
    }
  }

  const isPreset = PRESET_AVATARS.some((a) => a.src === photoUrl);

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
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ marginBottom: 8 }}><CactusIcon size={48} /></div>
        <div className="gradient-text" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>
          Festivibe
        </div>
        <div style={{ color: "rgba(240,240,245,0.5)", fontSize: 14, marginTop: 6 }}>
          Coachella 2026 · Week {group.week ?? 2}
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Avatar section */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(240,240,245,0.45)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Pick your vibe
            </div>

            {/* Preset grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
              {PRESET_AVATARS.map((preset) => {
                const selected = photoUrl === preset.src;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPhotoUrl(selected ? "" : preset.src)}
                    style={{
                      position: "relative",
                      borderRadius: 16,
                      border: selected
                        ? "2.5px solid #f72585"
                        : "2px solid rgba(255,255,255,0.08)",
                      background: selected
                        ? "rgba(247,37,133,0.12)"
                        : "rgba(255,255,255,0.04)",
                      padding: 6,
                      cursor: "pointer",
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.src}
                      alt={preset.label}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                    {selected && (
                      <div style={{
                        position: "absolute", top: 4, right: 4,
                        width: 16, height: 16, borderRadius: "50%",
                        background: "#f72585",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: "#fff", fontWeight: 800,
                      }}>
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Upload own photo */}
            <label style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.04)",
              border: `1.5px solid ${!isPreset && photoUrl ? "rgba(247,37,133,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 14, padding: "10px 14px",
              cursor: "pointer",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: !isPreset && photoUrl ? "transparent" : "rgba(247,37,133,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", flexShrink: 0,
              }}>
                {!isPreset && photoUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <CameraIcon size={22} />
                }
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: !isPreset && photoUrl ? "#f72585" : "rgba(240,240,245,0.7)" }}>
                  {!isPreset && photoUrl ? "Custom photo selected" : "Upload your own photo"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(240,240,245,0.35)", marginTop: 1 }}>optional</div>
              </div>
              {!isPreset && photoUrl && (
                <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: "#f72585", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 800 }}>
                  ✓
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
            </label>
          </div>

          {/* Name */}
          <div>
            <input
              placeholder="Your name *"
              value={name}
              onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setNameError(""); }}
              style={{ ...inputStyle, borderColor: nameError ? "rgba(247,37,133,0.6)" : "rgba(255,255,255,0.1)" }}
              autoFocus
            />
            {nameError && <div style={{ fontSize: 12, color: "#f72585", marginTop: 4, paddingLeft: 4 }}>{nameError}</div>}
          </div>

          {/* Phone */}
          <div>
            <input
              placeholder="Phone number *"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); if (e.target.value.trim()) setPhoneError(""); }}
              type="tel"
              style={{ ...inputStyle, borderColor: phoneError ? "rgba(247,37,133,0.6)" : "rgba(255,255,255,0.1)" }}
            />
            {phoneError && <div style={{ fontSize: 12, color: "#f72585", marginTop: 4, paddingLeft: 4 }}>{phoneError}</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={primaryBtnStyle(loading)}
          >
            {loading ? "Joining..." : "Join the crew"}
          </button>
        </form>
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
  onArtistTap,
  dayLabels,
}: {
  memberId: string;
  members: Member[];
  picks: ArtistPick[];
  onToggle: (artistId: string) => void;
  onArtistTap: (artist: Artist) => void;
  dayLabels: Record<Day, string>;
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
            {dayLabels[d].split(" ")[0]}
            <br />
            <span style={{ fontSize: 10, fontWeight: 500 }}>
              {dayLabels[d].split(" ").slice(1).join(" ")}
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
                <div
                  onClick={() => onArtistTap(artist)}
                  style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, lineHeight: 1.2, cursor: "pointer" }}
                >
                  {artist.name}
                </div>
                {(artist.stage || artist.startTime) && (
                  <div style={{ fontSize: 11, color: "rgba(240,240,245,0.38)", marginBottom: 3 }}>
                    {[artist.stage, artist.startTime && artist.endTime ? `${fmtTime(artist.startTime)}–${fmtTime(artist.endTime)}` : null].filter(Boolean).join(" · ")}
                  </div>
                )}
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
                <HeartIcon size={20} filled={isPicked} />
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
  memberId,
  members,
  picks,
  onToggle,
  dayLabels,
}: {
  memberId: string;
  members: Member[];
  picks: ArtistPick[];
  onToggle: (artistId: string) => void;
  dayLabels: Record<Day, string>;
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
        <HeartEmptyLarge size={56} />
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
              {dayLabels[day]}
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
                    {(artist.stage || artist.startTime) && (
                      <div style={{ fontSize: 11, color: "rgba(240,240,245,0.38)", marginTop: 2 }}>
                        {[artist.stage, artist.startTime && artist.endTime ? `${fmtTime(artist.startTime)}–${fmtTime(artist.endTime)}` : null].filter(Boolean).join(" · ")}
                      </div>
                    )}
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
                    onClick={() => onToggle(artist.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(240,240,245,0.3)",
                      fontSize: 20,
                      cursor: "pointer",
                    }}
                  >
                    <CloseIcon size={18} />
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
  dayLabels,
}: {
  members: Member[];
  picks: ArtistPick[];
  currentMemberId: string;
  dayLabels: Record<Day, string>;
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
        <CrewIcon size={56} />
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
                    {dayLabels[day]}
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

// ── Timetable Tab ─────────────────────────────────────────────────────────────

const STAGE_COLORS: Record<string, string> = {
  "Coachella Stage": "#f72585",
  "Outdoor Theater": "#fb8500",
  "Sahara":          "#4cc9f0",
  "Gobi":            "#06d6a0",
  "Mojave":          "#ffd166",
  "Sonora":          "#a78bfa",
  "Yuma":            "#f4a261",
  "Quasar":          "#e9c46a",
};

const TT_PX_PER_MIN = 1.5;
const TT_SCHED_START = 13 * 60;
const TT_SCHED_END   = 25 * 60;
const TT_TOTAL_H     = (TT_SCHED_END - TT_SCHED_START) * TT_PX_PER_MIN; // 1080px
const TT_TIME_W      = 40;  // left time-label column width
const TT_STAGE_W     = 82;  // each stage column width
const TT_HEADER_H    = 46;  // sticky stage-name header height

function TimetableTab({
  memberId,
  members,
  picks,
  onToggle,
  onArtistTap,
  dayLabels,
}: {
  memberId: string;
  members: Member[];
  picks: ArtistPick[];
  onToggle: (artistId: string) => void;
  onArtistTap: (artist: Artist) => void;
  dayLabels: Record<Day, string>;
}) {
  const [activeDay, setActiveDay] = useState<Day>("fri");
  const [myOnly, setMyOnly] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const days: Day[] = ["fri", "sat", "sun"];

  const myPickSet = new Set(
    picks.filter((p) => p.member_id === memberId).map((p) => p.artist_id)
  );
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  function pickersForArtist(artistId: string): Member[] {
    return picks
      .filter((p) => p.artist_id === artistId)
      .map((p) => memberMap[p.member_id])
      .filter(Boolean) as Member[];
  }

  const dayArtists = ARTISTS.filter(
    (a) => a.day === activeDay && a.stage && a.startTime && a.endTime
  );
  const visibleArtists = myOnly
    ? dayArtists.filter((a) => myPickSet.has(a.id))
    : dayArtists;

  const activeStages = STAGES.filter((s) =>
    visibleArtists.some((a) => a.stage === s)
  );

  // Expand columns to fill available width on wide screens
  const stageW = activeStages.length > 0 && containerW > TT_TIME_W + activeStages.length * TT_STAGE_W
    ? Math.floor((containerW - TT_TIME_W) / activeStages.length)
    : TT_STAGE_W;

  const hourMarks: number[] = [];
  for (let h = 13; h <= 25; h++) hourMarks.push(h);

  function yPos(time: string): number {
    return (timeToMinutes(time) - TT_SCHED_START) * TT_PX_PER_MIN;
  }
  function blkH(start: string, end: string): number {
    return Math.max((timeToMinutes(end) - timeToMinutes(start)) * TT_PX_PER_MIN, 36);
  }
  function formatHour(h: number): string {
    if (h === 24) return "12a";
    if (h === 25) return "1a";
    return `${h - 12}p`;
  }

  // Stage label abbreviation
  function stageLabel(s: string): string {
    return s.replace(" Stage", "").replace("Outdoor Theater", "Outdoor\nTheater");
  }

  const myPickCount = myPickSet.size;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Day tabs */}
      <div style={{ display: "flex", padding: "12px 16px 0", gap: 8, background: "#0a0a0f", flexShrink: 0 }}>
        {days.map((d) => (
          <button key={d} onClick={() => setActiveDay(d)} style={{
            flex: 1, padding: "8px 0", borderRadius: 12, border: "none",
            background: activeDay === d ? dayGradient(d) : "rgba(255,255,255,0.06)",
            color: activeDay === d ? "#fff" : "rgba(240,240,245,0.5)",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            textTransform: "uppercase", letterSpacing: 0.5,
          }}>
            {dayLabels[d].split(" ")[0]}
            <br />
            <span style={{ fontSize: 10, fontWeight: 500 }}>
              {dayLabels[d].split(" ").slice(1).join(" ")}
            </span>
          </button>
        ))}
      </div>

      {/* Toggle: All / My Schedule */}
      <div style={{ display: "flex", padding: "10px 16px 8px", gap: 8, background: "#0a0a0f", flexShrink: 0, alignItems: "center" }}>
        {[false, true].map((v) => (
          <button key={String(v)} onClick={() => setMyOnly(v)} style={{
            padding: "6px 14px", borderRadius: 999, border: "none", cursor: "pointer",
            background: myOnly === v ? "rgba(247,37,133,0.2)" : "rgba(255,255,255,0.06)",
            color: myOnly === v ? "#f72585" : "rgba(240,240,245,0.5)",
            fontSize: 12, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {v ? "My schedule" : "All artists"}
            {v && myPickCount > 0 && (
              <span style={{
                background: "#f72585", color: "#fff", borderRadius: 999,
                fontSize: 10, fontWeight: 700, minWidth: 16, height: 16,
                display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
              }}>{myPickCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {activeStages.length === 0 && myOnly && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "rgba(240,240,245,0.45)" }}>No picks on {dayLabels[activeDay]} yet</div>
          <div style={{ fontSize: 13, color: "rgba(240,240,245,0.3)" }}>Heart artists in the Lineup tab</div>
        </div>
      )}

      {/* Grid: single container scrolls both axes */}
      {activeStages.length > 0 && (
        <div ref={scrollRef} style={{ flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"] }}>
          <div style={{ minWidth: TT_TIME_W + activeStages.length * stageW, display: "flex", flexDirection: "column" }}>

            {/* Sticky stage-name header row */}
            <div style={{
              position: "sticky", top: 0, zIndex: 20,
              display: "flex", background: "#0a0a0f",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}>
              {/* Corner cell — sticky left too */}
              <div style={{
                width: TT_TIME_W, flexShrink: 0, height: TT_HEADER_H,
                position: "sticky", left: 0, zIndex: 22, background: "#0a0a0f",
              }} />
              {/* Stage name cells */}
              {activeStages.map((stage) => (
                <div key={stage} style={{
                  width: stageW, flexShrink: 0, height: TT_HEADER_H,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderLeft: "1px solid rgba(255,255,255,0.05)",
                  padding: "0 4px",
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 800,
                    color: STAGE_COLORS[stage] ?? "rgba(240,240,245,0.5)",
                    textTransform: "uppercase", letterSpacing: 0.5,
                    textAlign: "center", lineHeight: 1.35,
                    whiteSpace: "pre-line",
                  }}>
                    {stageLabel(stage)}
                  </span>
                </div>
              ))}
            </div>

            {/* Body: time labels + stage columns */}
            <div style={{ display: "flex", height: TT_TOTAL_H + 110, position: "relative" }}>

              {/* Sticky-left time labels */}
              <div style={{
                width: TT_TIME_W, flexShrink: 0,
                position: "sticky", left: 0, zIndex: 10,
                background: "#0a0a0f",
              }}>
                {hourMarks.map((h) => (
                  <div key={h} style={{
                    position: "absolute",
                    top: (h * 60 - TT_SCHED_START) * TT_PX_PER_MIN - 7,
                    right: 6, left: 0,
                    textAlign: "right",
                    fontSize: 10, fontWeight: 600,
                    color: "rgba(240,240,245,0.3)",
                    whiteSpace: "nowrap",
                  }}>
                    {formatHour(h)}
                  </div>
                ))}
              </div>

              {/* Stage columns */}
              {activeStages.map((stage) => {
                const stageArtists = visibleArtists.filter((a) => a.stage === stage);
                const stageColor = STAGE_COLORS[stage] ?? "#f72585";
                return (
                  <div key={stage} style={{
                    width: stageW, flexShrink: 0,
                    position: "relative",
                    borderLeft: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    {/* Hour grid lines */}
                    {hourMarks.map((h) => (
                      <div key={h} style={{
                        position: "absolute",
                        top: (h * 60 - TT_SCHED_START) * TT_PX_PER_MIN,
                        left: 0, right: 0, height: 1,
                        background: h % 2 === 0
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(255,255,255,0.03)",
                      }} />
                    ))}

                    {/* Artist blocks */}
                    {stageArtists.map((artist) => {
                      const top    = yPos(artist.startTime!);
                      const height = blkH(artist.startTime!, artist.endTime!);
                      const isPicked = myPickSet.has(artist.id);
                      const pickers = pickersForArtist(artist.id);
                      return (
                        <div
                          key={artist.id}
                          style={{
                            position: "absolute",
                            top: top + 2, left: 3, right: 3,
                            height: height - 4,
                            borderRadius: 8,
                            border: `1.5px solid ${isPicked ? "#f72585" : pickers.length > 0 ? stageColor + "88" : stageColor + "44"}`,
                            background: isPicked
                              ? "rgba(247,37,133,0.28)"
                              : pickers.length > 0 ? `${stageColor}28` : `${stageColor}12`,
                            display: "flex", flexDirection: "column",
                            alignItems: "flex-start", justifyContent: "flex-start",
                            padding: "4px 5px", overflow: "hidden",
                            textAlign: "left", gap: 2,
                          }}
                        >
                          {/* Like button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); onToggle(artist.id); }}
                            style={{
                              position: "absolute", top: 3, right: 3,
                              width: 18, height: 18, borderRadius: "50%",
                              border: "none",
                              background: isPicked ? "rgba(247,37,133,0.4)" : "rgba(255,255,255,0.12)",
                              cursor: "pointer", padding: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <HeartIcon size={10} filled={isPicked} />
                          </button>
                          {/* Tap rest to open sheet */}
                          <div onClick={() => onArtistTap(artist)} style={{ width: "100%", cursor: "pointer", display: "flex", flexDirection: "column", gap: 2, paddingRight: 18 }}>
                          <span style={{
                            fontSize: 10,
                            fontWeight: isPicked || pickers.length > 0 ? 700 : 500,
                            color: isPicked ? "#fff" : pickers.length > 0 ? "rgba(240,240,245,0.95)" : "rgba(240,240,245,0.7)",
                            lineHeight: 1.25,
                            overflow: "hidden",
                            display: "block",
                            whiteSpace: height < 54 ? "nowrap" : "normal",
                            textOverflow: height < 54 ? "ellipsis" : "clip",
                            width: "100%",
                          }}>
                            {artist.name}
                          </span>
                          {/* Always show pickers if any */}
                          {pickers.length > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "nowrap", overflow: "hidden" }}>
                              {pickers.slice(0, 5).map((m) => (
                                <div key={m.id} style={{
                                  width: 14, height: 14, borderRadius: "50%",
                                  background: m.color, flexShrink: 0,
                                  border: m.id === memberId ? "1.5px solid #f72585" : "1px solid rgba(0,0,0,0.5)",
                                  overflow: "hidden",
                                  position: "relative",
                                }}>
                                  {m.photo_url
                                    // eslint-disable-next-line @next/next/no-img-element
                                    ? <img src={m.photo_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, color: "#fff" }}>{m.name[0].toUpperCase()}</span>
                                  }
                                </div>
                              ))}
                              {pickers.length > 5 && (
                                <span style={{ fontSize: 8, color: "rgba(240,240,245,0.5)", fontWeight: 600 }}>+{pickers.length - 5}</span>
                              )}
                            </div>
                          )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────

type Tab = "lineup" | "picks" | "crew" | "schedule";

function BottomNav({
  active,
  onChange,
  myPickCount,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  myPickCount: number;
}) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "lineup", label: "Lineup" },
    { id: "schedule", label: "Timetable" },
    { id: "picks", label: "My Picks" },
    { id: "crew", label: "Crew" },
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
            {t.id === "lineup" && <MusicIconLarge size={22} active={active === "lineup"} />}
            {t.id === "schedule" && <ScheduleNavIcon size={22} active={active === "schedule"} />}
            {t.id === "picks" && <HeartNavIcon size={22} active={active === "picks"} />}
            {t.id === "crew" && <CrewNavIcon size={22} active={active === "crew"} />}
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
  onEditProfile,
}: {
  group: Group;
  members: Member[];
  currentMember: Member | undefined;
  onShareInvite: () => void;
  onEditProfile: () => void;
}) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {/* Cover photo hero */}
      {group.cover_url ? (
        <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={group.cover_url} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.3) 60%, transparent 100%)" }} />
          {/* Overlay row */}
          <div style={{ position: "absolute", bottom: 12, left: 16, right: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>{group.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                {members.length} crew · Week {group.week ?? 2}
                {group.website_url && (
                  <a href={group.website_url} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#4cc9f0", marginLeft: 8, textDecoration: "none", fontWeight: 600 }}>
                    Official site ↗
                  </a>
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={onShareInvite} style={inviteBtn}>+ Invite</button>
              {currentMember && (
              <button onClick={onEditProfile} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", borderRadius: "50%" }}>
                <Avatar member={currentMember} size={34} />
              </button>
            )}
            </div>
          </div>
        </div>
      ) : (
        /* No cover — compact bar */
        <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0a0a0f" }}>
          <div>
            <div className="gradient-text" style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>
              {group.name}
            </div>
            <div style={{ fontSize: 12, color: "rgba(240,240,245,0.4)", marginTop: 1 }}>
              {members.length} crew · Week {group.week ?? 2}
              {group.website_url && (
                <a href={group.website_url} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#4cc9f0", marginLeft: 8, textDecoration: "none", fontWeight: 600 }}>
                  Official site ↗
                </a>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={onShareInvite} style={inviteBtn}>+ Invite</button>
            {currentMember && (
              <button onClick={onEditProfile} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", borderRadius: "50%" }}>
                <Avatar member={currentMember} size={34} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleNavIcon({ size = 22, active = false }: { size?: number; active?: boolean }) {
  const c = active ? "#f72585" : "rgba(240,240,245,0.4)";
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="3" y="4" width="16" height="15" rx="3" stroke={c} strokeWidth="1.6" />
      <line x1="7" y1="2" x2="7" y2="6" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="15" y1="2" x2="15" y2="6" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="3" y1="9" x2="19" y2="9" stroke={c} strokeWidth="1.2" />
      <rect x="6" y="12" width="3" height="3" rx="1" fill={c} />
      <rect x="11" y="12" width="3" height="3" rx="1" fill={c} opacity="0.6" />
    </svg>
  );
}

// ── Artist link sheet ─────────────────────────────────────────────────────────

function ArtistSheet({ artist, onClose, dayLabels, isPicked, onToggle }: { artist: import("@/lib/artists").Artist; onClose: () => void; dayLabels: Record<Day, string>; isPicked: boolean; onToggle: () => void; }) {
  const q = encodeURIComponent(artist.name);
  const handle = artist.name.toLowerCase().replace(/\s+&\s+/g, "").replace(/[^a-z0-9]/g, "");

  const links = [
    {
      label: "Open on Spotify",
      url: `https://open.spotify.com/search/${q}`,
      bg: "rgba(30,215,96,0.12)",
      color: "#1ed760",
      icon: "🎧",
    },
    {
      label: "Search on YouTube",
      url: `https://www.youtube.com/results?search_query=${q}`,
      bg: "rgba(255,0,0,0.1)",
      color: "#ff4444",
      icon: "▶",
    },
    {
      label: "Find on Instagram",
      url: `https://www.instagram.com/${handle}/`,
      bg: "rgba(247,37,133,0.1)",
      color: "#f72585",
      icon: "◎",
    },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 300 }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#13131a",
        borderRadius: "24px 24px 0 0",
        padding: "8px 20px max(28px, env(safe-area-inset-bottom))",
        zIndex: 301,
        boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
      }}>
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "8px auto 20px" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{artist.name}</div>
          <button
            onClick={onToggle}
            style={{
              width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer", flexShrink: 0,
              background: isPicked ? "rgba(247,37,133,0.2)" : "rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
          >
            <HeartIcon size={22} filled={isPicked} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{
            display: "inline-block", fontSize: 11, fontWeight: 600,
            padding: "3px 10px", borderRadius: 999,
            background: dayBgColor(artist.day), color: dayColor(artist.day),
            textTransform: "uppercase", letterSpacing: 0.5,
          }}>
            {dayLabels[artist.day]}
          </div>
          {artist.stage && (
            <div style={{
              display: "inline-block", fontSize: 11, fontWeight: 600,
              padding: "3px 10px", borderRadius: 999,
              background: "rgba(255,255,255,0.08)", color: "rgba(240,240,245,0.7)",
            }}>
              {artist.stage}
            </div>
          )}
          {artist.startTime && artist.endTime && (
            <div style={{
              display: "inline-block", fontSize: 11, fontWeight: 600,
              padding: "3px 10px", borderRadius: 999,
              background: "rgba(255,255,255,0.08)", color: "rgba(240,240,245,0.7)",
            }}>
              {fmtTime(artist.startTime)} – {fmtTime(artist.endTime)}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {links.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 12,
                background: l.bg, border: `1px solid ${l.color}33`,
                borderRadius: 14, padding: "14px 16px",
                textDecoration: "none", color: l.color,
                fontSize: 15, fontWeight: 600,
              }}>
              <span style={{ fontSize: 20 }}>{l.icon}</span>
              {l.label}
              <span style={{ marginLeft: "auto", opacity: 0.5, fontSize: 16 }}>↗</span>
            </a>
          ))}
        </div>
        <button onClick={onClose} style={{ width: "100%", marginTop: 14, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 14, color: "rgba(240,240,245,0.5)", fontSize: 15, fontWeight: 600, padding: "13px", cursor: "pointer" }}>
          Close
        </button>
      </div>
    </>
  );
}

// ── Edit Profile Sheet ────────────────────────────────────────────────────────

function EditProfileSheet({
  member,
  onSave,
  onClose,
}: {
  member: Member;
  onSave: (updates: { name: string; photo_url: string; phone: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [photoUrl, setPhotoUrl] = useState(member.photo_url);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await compressImage(file);
    setPhotoUrl(url);
  }

  async function handleSave() {
    if (!name.trim()) { setNameError("Name is required"); return; }
    setSaving(true);
    try {
      await onSave({ name: name.trim(), photo_url: photoUrl, phone: phone.trim() });
      try {
        const raw = localStorage.getItem("festivibe_user");
        const existing = raw ? JSON.parse(raw) : {};
        localStorage.setItem("festivibe_user", JSON.stringify({ ...existing, name: name.trim(), photo_url: photoUrl, phone: phone.trim() }));
      } catch { /* ignore */ }
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  const initials = member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 300 }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#13131a", borderRadius: "24px 24px 0 0",
        padding: "8px 20px max(32px, env(safe-area-inset-bottom))",
        zIndex: 301, boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
        overflowY: "auto", maxHeight: "90dvh",
      }}>
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "8px auto 20px" }} />

        {!editing ? (
          /* ── View mode ── */
          <>
            {/* Big avatar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", background: member.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid rgba(255,255,255,0.1)" }}>
                {member.photo_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={member.photo_url} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{initials}</span>
                }
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{member.name}</div>
                {member.phone && (
                  <div style={{ fontSize: 14, color: "rgba(240,240,245,0.45)", marginTop: 4 }}>{member.phone}</div>
                )}
              </div>
            </div>

            <button onClick={() => setEditing(true)} style={primaryBtnStyle(false)}>
              Edit profile
            </button>
            <button onClick={onClose} style={{ width: "100%", marginTop: 8, background: "none", border: "none", borderRadius: 14, color: "rgba(240,240,245,0.4)", fontSize: 15, fontWeight: 600, padding: "13px", cursor: "pointer" }}>
              Close
            </button>
          </>
        ) : (
          /* ── Edit mode ── */
          <>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Edit profile</div>

            {/* Photo with pencil overlay */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ position: "relative", width: 88, height: 88 }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", background: member.color, border: "3px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {photoUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: photoUrl.startsWith("/avatars") ? "contain" : "cover" }} />
                    : <span style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{initials}</span>
                  }
                </div>
                {/* Pencil button */}
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker((v) => !v)}
                  style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#f72585", border: "2px solid #13131a",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M9.5 1.5L11.5 3.5L4.5 10.5H2.5V8.5L9.5 1.5Z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Photo picker (collapsible) */}
            {showPhotoPicker && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px", marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 10 }}>
                  {PRESET_AVATARS.map((preset) => {
                    const selected = photoUrl === preset.src;
                    return (
                      <button key={preset.id} type="button"
                        onClick={() => { setPhotoUrl(selected ? "" : preset.src); setShowPhotoPicker(false); }}
                        style={{
                          position: "relative", borderRadius: 14, aspectRatio: "1",
                          border: selected ? "2.5px solid #f72585" : "2px solid rgba(255,255,255,0.08)",
                          background: selected ? "rgba(247,37,133,0.12)" : "rgba(255,255,255,0.04)",
                          padding: 5, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                        }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preset.src} alt={preset.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        {selected && <div style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: "50%", background: "#f72585", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 800 }}>✓</div>}
                      </button>
                    );
                  })}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 12px", cursor: "pointer" }}>
                  <CameraIcon size={20} />
                  <span style={{ fontSize: 13, color: "#f72585", fontWeight: 600 }}>Upload your own photo</span>
                  <input type="file" accept="image/*" onChange={(e) => { handlePhoto(e); setShowPhotoPicker(false); }} style={{ display: "none" }} />
                </label>
              </div>
            )}

            {/* Name */}
            <div style={{ marginBottom: 10 }}>
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setNameError(""); }}
                style={{ ...inputStyle, borderColor: nameError ? "rgba(247,37,133,0.6)" : "rgba(255,255,255,0.1)" }}
              />
              {nameError && <div style={{ fontSize: 12, color: "#f72585", marginTop: 4, paddingLeft: 4 }}>{nameError}</div>}
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 16 }}>
              <input
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                style={inputStyle}
              />
            </div>

            <button onClick={handleSave} disabled={saving} style={primaryBtnStyle(saving)}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button onClick={() => { setEditing(false); setShowPhotoPicker(false); }} style={{ width: "100%", marginTop: 8, background: "none", border: "none", borderRadius: 14, color: "rgba(240,240,245,0.4)", fontSize: 15, fontWeight: 600, padding: "13px", cursor: "pointer" }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
}

const inviteBtn: React.CSSProperties = {
  background: "rgba(247,37,133,0.15)",
  border: "1px solid rgba(247,37,133,0.3)",
  borderRadius: 999,
  color: "#f72585",
  fontSize: 12,
  fontWeight: 700,
  padding: "6px 12px",
  cursor: "pointer",
};

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
  const [selectedArtist, setSelectedArtist] = useState<import("@/lib/artists").Artist | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const touchStartY = useRef(0);

  // Load group
  useEffect(() => {
    getGroup(groupId).then((g) => {
      if (!g) setNotFound(true);
      else setGroup(g);
      setLoading(false);
    });
  }, [groupId]);

  // Check localStorage for membership (keyed by stable UUID, loaded after group)
  useEffect(() => {
    if (!group) return;
    const stored = localStorage.getItem(`festivibe_member_${group.id}`);
    if (stored) setMemberId(stored);
  }, [group]);

  // Subscribe to members + picks once group is confirmed
  useEffect(() => {
    if (!group) return;
    const unsub1 = subscribeMembers(group.id, setMembers);
    const unsub2 = subscribePicks(group.id, setPicks);
    return () => { unsub1(); unsub2(); };
  }, [group]);

  const handleJoin = useCallback((id: string) => {
    setMemberId(id);
  }, []);

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
        <CactusIcon size={56} />
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
  const dayLabels = getDayLabels((group.week ?? 2) as 1 | 2);

  function handleShareInvite() {
    const url = window.location.href;
    const myName = currentMember?.name ?? "Someone";
    const text = `${myName} invites you to ${group!.name}! Come pick your artists and plan Coachella 2026 Week ${group!.week ?? 2} together 🎪\n${url}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleSaveProfile(updates: { name: string; photo_url: string; phone: string }) {
    await updateMember(memberId!, updates);
    setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, ...updates } : m));
  }

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
        { id: pickId, group_id: group!.id, member_id: memberId!, artist_id: artistId, created_at: new Date().toISOString() },
      ]);
    }
    // Sync to server (real-time will reconcile other members' views)
    try {
      await togglePick(group!.id, memberId!, artistId, isCurrentlyPicked);
    } catch {
      // Revert on server error
      setPicks((prev) =>
        isCurrentlyPicked
          ? [...prev, { id: pickId, group_id: group!.id, member_id: memberId!, artist_id: artistId, created_at: new Date().toISOString() }]
          : prev.filter((p) => p.id !== pickId)
      );
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([
      supabase.from("members").select("*").eq("group_id", group!.id).then(({ data }) => { if (data) setMembers(data as Member[]); }),
      supabase.from("picks").select("*").eq("group_id", group!.id).then(({ data }) => { if (data) setPicks(data as ArtistPick[]); }),
    ]);
    setTimeout(() => setRefreshing(false), 400);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    if (diff > 70) handleRefresh();
  }

  return (
    <div
      style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#0a0a0f", overflow: "hidden" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Toasts */}
      {copied && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#06d6a0", color: "#0a0a0f", borderRadius: 999, padding: "8px 20px", fontSize: 13, fontWeight: 700, zIndex: 999 }}>
          Invite link copied!
        </div>
      )}
      {refreshing && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", color: "#f0f0f5", borderRadius: 999, padding: "8px 20px", fontSize: 13, fontWeight: 600, zIndex: 999, border: "1px solid rgba(255,255,255,0.12)" }}>
          Refreshing...
        </div>
      )}

      {/* Artist link sheet */}
      {selectedArtist && (
        <ArtistSheet
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
          dayLabels={dayLabels}
          isPicked={picks.some((p) => p.member_id === memberId && p.artist_id === selectedArtist.id)}
          onToggle={() => handleToggle(selectedArtist.id)}
        />
      )}

      {/* Edit profile sheet */}
      {showEditProfile && currentMember && (
        <EditProfileSheet
          member={currentMember}
          onSave={handleSaveProfile}
          onClose={() => setShowEditProfile(false)}
        />
      )}

      <Header
        group={group}
        members={members}
        currentMember={currentMember}
        onShareInvite={handleShareInvite}
        onEditProfile={() => setShowEditProfile(true)}
      />

      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {activeTab === "lineup" && (
          <LineupTab
            memberId={memberId}
            members={members}
            picks={picks}
            onToggle={handleToggle}
            onArtistTap={setSelectedArtist}
            dayLabels={dayLabels}
          />
        )}
        {activeTab === "schedule" && (
          <TimetableTab
            memberId={memberId}
            members={members}
            picks={picks}
            onToggle={handleToggle}
            onArtistTap={setSelectedArtist}
            dayLabels={dayLabels}
          />
        )}
        {activeTab === "picks" && (
          <PicksTab
            memberId={memberId}
            members={members}
            picks={picks}
            onToggle={handleToggle}
            dayLabels={dayLabels}
          />
        )}
        {activeTab === "crew" && (
          <CrewTab
            members={members}
            picks={picks}
            currentMemberId={memberId}
            dayLabels={dayLabels}
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

function fmtTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const realH = h >= 24 ? h - 24 : h;
  const ampm = h >= 24 ? "am" : h >= 12 ? "pm" : "am";
  const disp = realH === 0 ? 12 : realH > 12 ? realH - 12 : realH;
  return m === 0 ? `${disp}${ampm}` : `${disp}:${String(m).padStart(2, "0")}${ampm}`;
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
