"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createGroup, addMember, getGroup, randomColor, compressImage, uploadCoverImage } from "@/lib/db";
import { CactusIcon, CameraIcon, LightningIcon } from "@/components/Icons";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabase";

const PRESET_AVATARS = [
  { id: "van",    src: "/avatars/van.png",    label: "Van" },
  { id: "palms",  src: "/avatars/palms.png",  label: "Palms" },
  { id: "tshirt", src: "/avatars/tshirt.png", label: "T-Shirt" },
  { id: "tent",   src: "/avatars/tent.png",   label: "Tent" },
];

type Step = "home" | "join" | "week" | "cover" | "group-info" | "your-info";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("home");
  const [week, setWeek] = useState<1 | 2 | null>(null);
  const [groupName, setGroupName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [error, setError] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [userName, setUserName] = useState("");

  // On mount: load user profile from auth + redirect if already in a group
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata ?? {};
      const fullName = meta.full_name ?? meta.name ?? "";
      const first = fullName.split(" ")[0];
      if (first) setUserName(first);
      // Pre-fill from auth profile so we can skip "your-info" step
      if (fullName) setName(fullName);
      if (meta.phone) setPhone(meta.phone);
      if (meta.photo_url ?? meta.avatar_url) setPhotoUrl(meta.photo_url ?? meta.avatar_url ?? "");
    });
    const lastGroup = localStorage.getItem("festivibe_last_group");
    if (lastGroup) {
      router.replace(`/group/${lastGroup}`);
    }
  }, [router]);

  async function handleJoin() {
    if (joinCode.length < 6) return;
    setLoading(true);
    setJoinError("");
    try {
      const group = await getGroup(joinCode);
      if (!group) { setJoinError("Group not found. Check the code and try again."); return; }
      localStorage.setItem("festivibe_last_group", group.code);
      router.push(`/group/${group.code}`);
    } catch {
      setJoinError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCoverPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const url = await uploadCoverImage(file);
      setCoverUrl(url);
    } catch {
      const url = await compressImage(file, 800);
      setCoverUrl(url);
    } finally {
      setCoverUploading(false);
    }
  }

  async function handleProfilePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await compressImage(file);
    setPhotoUrl(url);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !groupName.trim() || !week) return;
    setLoading(true);
    setError("");
    try {
      const { id: groupId, code: groupCode } = await createGroup(groupName.trim(), coverUrl, websiteUrl.trim(), week);
      const memberId = await addMember(groupId, {
        name: name.trim(),
        phone: phone.trim(),
        photo_url: photoUrl,
        color: randomColor(),
        is_host: true,
      });
      localStorage.setItem(`festivibe_member_${groupId}`, memberId);
      localStorage.setItem("festivibe_last_group", groupCode);
      router.push(`/group/${groupCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : (typeof err === "object" && err !== null && "message" in err) ? String((err as {message: unknown}).message) : JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  const weekLabel = week === 1 ? "Week 1 · Apr 10–12" : week === 2 ? "Week 2 · Apr 17–19" : null;

  return (
    <AuthGate>
    <div style={{
      minHeight: "100vh",
      background: "#f0ebe0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48, zIndex: 1 }}>
        <div style={{ marginBottom: 8 }}><CactusIcon size={64} /></div>
        <div style={{ fontSize: 48, fontFamily: "'Permanent Marker', cursive", color: "#1c1410", lineHeight: 1 }}>
          Festivibe
        </div>
        <div style={{ color: "rgba(28,20,16,0.55)", fontSize: 13, marginTop: 10, fontFamily: "'Space Mono', monospace" }}>
          Plan Coachella with your crew
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, background: "rgba(224,48,48,0.08)", border: "2px solid #e03030", borderRadius: 999, padding: "4px 12px", fontSize: 12, color: "#e03030", fontWeight: 700, fontFamily: "'Space Mono', monospace", boxShadow: "2px 2px 0 #1c1410" }}>
          <LightningIcon size={13} /> {weekLabel ?? "Apr 10–12 & Apr 17–19"}
        </div>
      </div>

      {/* Card */}
      <div style={{ background: "#faf7ed", border: "2px solid #1c1410", borderRadius: 10, padding: "28px 24px", width: "100%", maxWidth: 380, zIndex: 1, boxShadow: "3px 3px 0 #1c1410" }}>

        {/* ── Home ── */}
        {step === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {userName && (
              <div style={{ fontSize: 18, fontFamily: "'Space Mono', monospace", color: "rgba(28,20,16,0.6)", marginBottom: 4, textAlign: "center" }}>
                Hi <strong style={{ color: "#1c1410" }}>{userName}</strong>! 👋
              </div>
            )}
            <button onClick={() => setStep("week")} style={gradientBtn}>
              Create a group
            </button>
            <div style={{ textAlign: "center", color: "rgba(28,20,16,0.35)", fontSize: 12, margin: "4px 0", fontFamily: "'Space Mono', monospace" }}>— or —</div>
            <button onClick={() => setStep("join")} style={{ background: "#faf7ed", border: "2px solid #1c1410", borderRadius: 10, color: "#1c1410", fontSize: 16, fontWeight: 700, padding: "16px", cursor: "pointer", boxShadow: "3px 3px 0 #1c1410", width: "100%", fontFamily: "'Space Mono', monospace" }}>
              Join a group
            </button>
          </div>
        )}

        {/* ── Join ── */}
        {step === "join" && (
          <div>
            <BackBtn onClick={() => { setStep("home"); setJoinCode(""); setJoinError(""); }} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Mono', monospace", color: "#1c1410" }}>Enter invite code</div>
            <div style={{ fontSize: 13, color: "rgba(28,20,16,0.5)", marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>
              Ask your crew for the 6-character code
            </div>
            <input
              placeholder="abc123"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              maxLength={6}
              autoFocus
              style={{ ...inputStyle, fontSize: 24, textAlign: "center", letterSpacing: 6, marginBottom: 12 }}
            />
            {joinError && (
              <div style={{ marginBottom: 12, padding: "10px 14px", background: "rgba(224,48,48,0.08)", border: "2px solid #e03030", borderRadius: 10, fontSize: 13, color: "#e03030", fontFamily: "'Space Mono', monospace" }}>
                {joinError}
              </div>
            )}
            <button onClick={handleJoin} disabled={loading || joinCode.length < 6} style={primaryBtn(loading || joinCode.length < 6)}>
              {loading ? "Looking up..." : "Join →"}
            </button>
          </div>
        )}

        {/* ── Week picker ── */}
        {step === "week" && (
          <div>
            <BackBtn onClick={() => setStep("home")} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Mono', monospace", color: "#1c1410" }}>Which weekend?</div>
            <div style={{ fontSize: 13, color: "rgba(28,20,16,0.5)", marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>
              Pick the weekend your crew is going
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {([1, 2] as const).map((w) => {
                const label = w === 1 ? "Week 1" : "Week 2";
                const dates = w === 1 ? "Apr 10 – 12" : "Apr 17 – 19";
                const selected = week === w;
                return (
                  <button
                    key={w}
                    onClick={() => { setWeek(w); setStep("cover"); }}
                    style={{
                      background: selected ? "#e03030" : "#faf7ed",
                      border: `2px solid #1c1410`,
                      borderRadius: 10,
                      padding: "18px 20px",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: selected ? "3px 3px 0 #1c1410" : "2px 2px 0 #1c1410",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: selected ? "#fff" : "#1c1410", marginBottom: 2, fontFamily: "'Space Mono', monospace" }}>{label}</div>
                      <div style={{ fontSize: 13, color: selected ? "rgba(255,255,255,0.8)" : "rgba(28,20,16,0.5)", fontFamily: "'Space Mono', monospace" }}>{dates}</div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      border: `2px solid ${selected ? "#fff" : "#1c1410"}`,
                      background: selected ? "#fff" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {selected && <span style={{ fontSize: 11, color: "#e03030", fontWeight: 800 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Cover photo ── */}
        {step === "cover" && (
          <div>
            <BackBtn onClick={() => setStep("week")} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Mono', monospace", color: "#1c1410" }}>Add a cover photo</div>
            <div style={{ fontSize: 13, color: "rgba(28,20,16,0.5)", marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>
              Sets the vibe — like a Partiful poster
            </div>
            <label style={{ display: "block", cursor: "pointer" }}>
              <div style={{
                width: "100%", height: 160, borderRadius: 10,
                background: coverUrl ? "transparent" : "#faf7ed",
                border: coverUrl ? "none" : "2px dashed #1c1410",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                overflow: "hidden", marginBottom: 16,
                boxShadow: coverUrl ? "none" : "2px 2px 0 #1c1410",
              }}>
                {coverUploading ? (
                  <div style={{ fontSize: 13, color: "rgba(28,20,16,0.5)", fontFamily: "'Space Mono', monospace" }}>Uploading...</div>
                ) : coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <>
                    <CameraIcon size={36} />
                    <div style={{ fontSize: 13, color: "rgba(28,20,16,0.5)", marginTop: 10, fontFamily: "'Space Mono', monospace" }}>Tap to upload</div>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleCoverPhoto} style={{ display: "none" }} />
            </label>
            <button onClick={() => setStep("group-info")} disabled={coverUploading} style={primaryBtn(coverUploading)}>
              {coverUploading ? "Uploading..." : coverUrl ? "Looks good" : "Skip for now"}
            </button>
          </div>
        )}

        {/* ── Group info ── */}
        {step === "group-info" && (
          <div>
            <BackBtn onClick={() => setStep("cover")} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Mono', monospace", color: "#1c1410" }}>Name your crew</div>
            <div style={{ fontSize: 13, color: "rgba(28,20,16,0.5)", marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>
              Your friends will see this
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                placeholder="e.g. Desert Squad, The Coachella Gang..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                style={inputStyle}
                autoFocus
              />
              <input
                placeholder="Event website (optional)"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                type="url"
                style={inputStyle}
              />
            </div>
            <button
              disabled={!groupName.trim()}
              onClick={async () => {
                // If we already have name+phone from auth, skip "your-info" and create directly
                if (name.trim() && phone.trim()) {
                  if (!week) return;
                  setLoading(true);
                  setError("");
                  try {
                    const { id: groupId, code: groupCode } = await createGroup(groupName.trim(), coverUrl, websiteUrl.trim(), week);
                    const memberId = await addMember(groupId, { name: name.trim(), phone: phone.trim(), photo_url: photoUrl, color: randomColor(), is_host: true });
                    localStorage.setItem(`festivibe_member_${groupId}`, memberId);
                    localStorage.setItem("festivibe_last_group", groupCode);
                    router.push(`/group/${groupCode}`);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : JSON.stringify(err));
                    setStep("your-info");
                  } finally {
                    setLoading(false);
                  }
                } else {
                  setStep("your-info");
                }
              }}
              style={primaryBtn(!groupName.trim() || loading)}
            >
              {loading ? "Creating..." : "Next"}
            </button>
            {error && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(224,48,48,0.08)", border: "2px solid #e03030", borderRadius: 10, fontSize: 13, color: "#e03030", fontFamily: "'Space Mono', monospace" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── Your info ── */}
        {step === "your-info" && (
          <form onSubmit={handleCreate}>
            <BackBtn onClick={() => setStep("group-info")} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Mono', monospace", color: "#1c1410" }}>Your info</div>
            <div style={{ fontSize: 13, color: "rgba(28,20,16,0.5)", marginBottom: 20, fontFamily: "'Space Mono', monospace" }}>
              Your crew will see your name and photo
            </div>

            {/* Preset avatar grid */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(28,20,16,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "'Space Mono', monospace" }}>
                Pick your vibe
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 10 }}>
                {PRESET_AVATARS.map((preset) => {
                  const selected = photoUrl === preset.src;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setPhotoUrl(selected ? "" : preset.src)}
                      style={{
                        position: "relative", borderRadius: 10, aspectRatio: "1",
                        border: selected ? "2.5px solid #e03030" : "2px solid #1c1410",
                        background: "#f8d377",
                        padding: 5, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                        boxShadow: selected ? "2px 2px 0 #1c1410" : "1px 1px 0 #1c1410",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preset.src} alt={preset.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      {selected && (
                        <div style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: "50%", background: "#e03030", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 800 }}>✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, background: "#faf7ed", border: "2px solid #1c1410", borderRadius: 10, padding: "8px 12px", cursor: "pointer", boxShadow: "2px 2px 0 #1c1410" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: "rgba(224,48,48,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {photoUrl && !PRESET_AVATARS.some((a) => a.src === photoUrl)
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <CameraIcon size={20} />
                  }
                </div>
                <span style={{ fontSize: 13, color: "#e03030", fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
                  {photoUrl && !PRESET_AVATARS.some((a) => a.src === photoUrl) ? "Custom photo" : "Upload your own"}
                </span>
                <input type="file" accept="image/*" onChange={handleProfilePhoto} style={{ display: "none" }} />
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
              <input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading || !name.trim()} style={primaryBtn(loading || !name.trim())}>
              {loading ? "Creating..." : "Create group"}
            </button>
            {error && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(224,48,48,0.08)", border: "2px solid #e03030", borderRadius: 10, fontSize: 13, color: "#e03030", fontFamily: "'Space Mono', monospace" }}>
                {error}
              </div>
            )}
          </form>
        )}
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: "rgba(28,20,16,0.35)", zIndex: 1, fontFamily: "'Space Mono', monospace" }}>
        Share the link · Pick your artists · See who&apos;s in
      </div>

      {/* Sign out */}
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          localStorage.removeItem("festivibe_last_group");
        }}
        style={{ marginTop: 12, background: "none", border: "none", color: "rgba(28,20,16,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "'Space Mono', monospace", zIndex: 1 }}
      >
        Sign out
      </button>
    </div>
    </AuthGate>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", color: "rgba(28,20,16,0.55)", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
      ← Back
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#fff",
  border: "2px solid #1c1410",
  borderRadius: 10,
  color: "#1c1410",
  fontSize: 15,
  padding: "12px 14px",
  outline: "none",
  width: "100%",
  fontFamily: "'Space Mono', monospace",
  boxShadow: "2px 2px 0 #1c1410",
};

const gradientBtn: React.CSSProperties = {
  background: "#e03030",
  border: "2px solid #1c1410",
  borderRadius: 10,
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  padding: "16px",
  cursor: "pointer",
  boxShadow: "3px 3px 0 #1c1410",
  width: "100%",
  fontFamily: "'Space Mono', monospace",
};

function primaryBtn(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? "rgba(224,48,48,0.35)" : "#e03030",
    border: "2px solid #1c1410",
    borderRadius: 10,
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    padding: "14px",
    cursor: disabled ? "not-allowed" : "pointer",
    width: "100%",
    marginTop: 14,
    boxShadow: disabled ? "none" : "3px 3px 0 #1c1410",
    fontFamily: "'Space Mono', monospace",
    opacity: disabled ? 0.6 : 1,
  };
}
