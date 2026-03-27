"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGroup, addMember, randomColor, compressImage, uploadCoverImage } from "@/lib/db";
import { CactusIcon, CameraIcon, LightningIcon } from "@/components/Icons";

type Step = "home" | "cover" | "group-info" | "your-info";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("home");
  const [groupName, setGroupName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  async function handleCoverPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const url = await uploadCoverImage(file);
      setCoverUrl(url);
    } catch {
      // Storage not set up yet — fall back to base64 (OG image won't work)
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
    if (!name.trim() || !groupName.trim()) return;
    setLoading(true);
    try {
      const groupId = await createGroup(groupName.trim(), coverUrl, websiteUrl.trim());
      const memberId = await addMember(groupId, {
        name: name.trim(),
        phone: phone.trim(),
        photo_url: photoUrl,
        color: randomColor(),
      });
      localStorage.setItem(`festivibe_member_${groupId}`, memberId);
      router.push(`/group/${groupId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glows */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(247,37,133,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,47,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48, zIndex: 1 }}>
        <div style={{ marginBottom: 8 }}><CactusIcon size={64} /></div>
        <div className="gradient-text" style={{ fontSize: 42, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>
          Festivibe
        </div>
        <div style={{ color: "rgba(240,240,245,0.45)", fontSize: 15, marginTop: 10 }}>
          Plan Coachella with your crew
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, background: "rgba(247,37,133,0.1)", border: "1px solid rgba(247,37,133,0.2)", borderRadius: 999, padding: "4px 12px", fontSize: 12, color: "#f72585", fontWeight: 600 }}>
          <LightningIcon size={13} /> Week 2 · Apr 17–19
        </div>
      </div>

      {/* Card */}
      <div style={{ background: "#13131a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "28px 24px", width: "100%", maxWidth: 380, zIndex: 1 }}>

        {/* ── Home ── */}
        {step === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={() => setStep("cover")} style={gradientBtn}>
              Create a group
            </button>
            <div style={{ textAlign: "center", color: "rgba(240,240,245,0.3)", fontSize: 12, margin: "4px 0" }}>— or —</div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px", textAlign: "center", fontSize: 14, color: "rgba(240,240,245,0.45)" }}>
              Got an invite link? Open it on your phone to join a group.
            </div>
          </div>
        )}

        {/* ── Cover photo ── */}
        {step === "cover" && (
          <div>
            <BackBtn onClick={() => setStep("home")} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Add a cover photo</div>
            <div style={{ fontSize: 13, color: "rgba(240,240,245,0.45)", marginBottom: 20 }}>
              Sets the vibe — like a Partiful poster
            </div>

            <label style={{ display: "block", cursor: "pointer" }}>
              <div style={{
                width: "100%",
                height: 160,
                borderRadius: 18,
                background: coverUrl ? "transparent" : "rgba(255,255,255,0.04)",
                border: coverUrl ? "none" : "2px dashed rgba(255,255,255,0.12)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                marginBottom: 16,
              }}>
                {coverUploading ? (
                  <div style={{ fontSize: 13, color: "rgba(240,240,245,0.4)" }}>Uploading...</div>
                ) : coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <>
                    <CameraIcon size={36} />
                    <div style={{ fontSize: 13, color: "rgba(240,240,245,0.4)", marginTop: 10 }}>Tap to upload</div>
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
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Name your crew</div>
            <div style={{ fontSize: 13, color: "rgba(240,240,245,0.45)", marginBottom: 20 }}>
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
              onClick={() => setStep("your-info")}
              style={primaryBtn(!groupName.trim())}
            >
              Next
            </button>
          </div>
        )}

        {/* ── Your info ── */}
        {step === "your-info" && (
          <form onSubmit={handleCreate}>
            <BackBtn onClick={() => setStep("group-info")} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Your info</div>
            <div style={{ fontSize: 13, color: "rgba(240,240,245,0.45)", marginBottom: 20 }}>
              Your crew will see your name and photo
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, cursor: "pointer" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: photoUrl ? "transparent" : "rgba(247,37,133,0.1)", border: photoUrl ? "none" : "2px dashed rgba(247,37,133,0.4)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {photoUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <CameraIcon size={28} />
                }
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f72585" }}>{photoUrl ? "Change photo" : "Add your photo"}</div>
                <div style={{ fontSize: 12, color: "rgba(240,240,245,0.4)" }}>Optional but fun</div>
              </div>
              <input type="file" accept="image/*" onChange={handleProfilePhoto} style={{ display: "none" }} />
            </label>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
              <input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading || !name.trim()} style={primaryBtn(loading || !name.trim())}>
              {loading ? "Creating..." : "Create group"}
            </button>
          </form>
        )}
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: "rgba(240,240,245,0.25)", zIndex: 1 }}>
        Share the link · Pick your artists · See who&apos;s in
      </div>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", color: "rgba(240,240,245,0.4)", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0 }}>
      ← Back
    </button>
  );
}

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

const gradientBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #f72585, #7b2fff)",
  border: "none",
  borderRadius: 16,
  color: "#fff",
  fontSize: 16,
  fontWeight: 700,
  padding: "16px",
  cursor: "pointer",
  boxShadow: "0 4px 24px rgba(247,37,133,0.3)",
  width: "100%",
};

function primaryBtn(disabled: boolean): React.CSSProperties {
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
    marginTop: 14,
    boxShadow: disabled ? "none" : "0 4px 20px rgba(247,37,133,0.25)",
  };
}
