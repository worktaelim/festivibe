"use client";

import { useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { CactusIcon, LightningIcon } from "./Icons";

// ── Provider button styles ────────────────────────────────────────────────────

function ProviderBtn({
  onClick,
  disabled,
  icon,
  label,
  bg,
  color,
  border,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  bg: string;
  color: string;
  border: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "13px 16px",
        background: disabled ? "rgba(28,20,16,0.08)" : bg,
        border: `2px solid ${border}`,
        borderRadius: 10,
        color: disabled ? "rgba(28,20,16,0.4)" : color,
        fontSize: 15,
        fontWeight: 700,
        fontFamily: "'Space Mono', monospace",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : `3px 3px 0 #1c1410`,
        opacity: disabled ? 0.6 : 1,
        transition: "opacity 0.15s",
      }}
    >
      <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ── SVG icons for providers ───────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#3A1D1D" d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.56 5.07 3.94 6.53L4.9 21l4.35-2.33C10.04 18.87 11 19 12 19c5.523 0 10-3.477 10-8S17.523 3 12 3z"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

// ── LoginScreen ───────────────────────────────────────────────────────────────

function LoginScreen() {
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const redirectTo = typeof window !== "undefined"
    ? window.location.origin + "/auth/callback"
    : "/auth/callback";

  async function signInWith(provider: "google" | "kakao") {
    setError("");
    setLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  async function sendMagicLink() {
    if (!email.trim()) return;
    setError("");
    setLoading("email");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#f0ebe0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ marginBottom: 8 }}><CactusIcon size={64} /></div>
        <div style={{ fontSize: 48, fontFamily: "'Permanent Marker', cursive", color: "#1c1410", lineHeight: 1 }}>
          Festivibe
        </div>
        <div style={{ color: "rgba(28,20,16,0.55)", fontSize: 13, marginTop: 10, fontFamily: "'Space Mono', monospace" }}>
          Plan Coachella with your crew
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, background: "rgba(224,48,48,0.08)", border: "2px solid #e03030", borderRadius: 999, padding: "4px 12px", fontSize: 12, color: "#e03030", fontWeight: 700, fontFamily: "'Space Mono', monospace", boxShadow: "2px 2px 0 #1c1410" }}>
          <LightningIcon size={13} /> Apr 10–12 & Apr 17–19
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: "#faf7ed",
        border: "2px solid #1c1410",
        borderRadius: 10,
        padding: "28px 24px",
        width: "100%",
        maxWidth: 380,
        boxShadow: "3px 3px 0 #1c1410",
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Mono', monospace", color: "#1c1410" }}>
          Sign in to continue
        </div>
        <div style={{ fontSize: 13, color: "rgba(28,20,16,0.5)", marginBottom: 24, fontFamily: "'Space Mono', monospace" }}>
          Pick your artists and plan with your crew
        </div>

        {emailMode ? (
          emailSent ? (
            /* ── Magic link sent ── */
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: "#1c1410", marginBottom: 8 }}>
                Check your email
              </div>
              <div style={{ fontSize: 13, color: "rgba(28,20,16,0.55)", fontFamily: "'Space Mono', monospace", lineHeight: 1.6, marginBottom: 24 }}>
                We sent a magic link to<br />
                <strong style={{ color: "#1c1410" }}>{email}</strong>
              </div>
              <button
                onClick={() => { setEmailMode(false); setEmailSent(false); setEmail(""); }}
                style={{ background: "none", border: "none", color: "#e03030", fontSize: 13, fontWeight: 700, fontFamily: "'Space Mono', monospace", cursor: "pointer", textDecoration: "underline" }}
              >
                ← Back to sign in
              </button>
            </div>
          ) : (
            /* ── Email input ── */
            <>
              <button
                onClick={() => setEmailMode(false)}
                style={{ background: "none", border: "none", color: "rgba(28,20,16,0.55)", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}
              >
                ← Back
              </button>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, fontFamily: "'Space Mono', monospace", color: "#1c1410" }}>
                Sign in with email
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMagicLink()}
                autoFocus
                style={{
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
                  marginBottom: 12,
                  boxSizing: "border-box",
                }}
              />
              <ProviderBtn
                onClick={sendMagicLink}
                disabled={loading === "email" || !email.trim()}
                icon={<EmailIcon />}
                label={loading === "email" ? "Sending..." : "Send magic link"}
                bg="#e03030"
                color="#fff"
                border="#1c1410"
              />
            </>
          )
        ) : (
          /* ── Provider list ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ProviderBtn
              onClick={() => signInWith("google")}
              disabled={!!loading}
              icon={<GoogleIcon />}
              label={loading === "google" ? "Redirecting..." : "Continue with Google"}
              bg="#fff"
              color="#1c1410"
              border="#1c1410"
            />
            <ProviderBtn
              onClick={() => signInWith("kakao")}
              disabled={!!loading}
              icon={<KakaoIcon />}
              label={loading === "kakao" ? "Redirecting..." : "Continue with KakaoTalk"}
              bg="#FEE500"
              color="#3A1D1D"
              border="#1c1410"
            />

            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(28,20,16,0.15)" }} />
              <span style={{ fontSize: 11, color: "rgba(28,20,16,0.4)", fontFamily: "'Space Mono', monospace" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(28,20,16,0.15)" }} />
            </div>

            <ProviderBtn
              onClick={() => setEmailMode(true)}
              disabled={!!loading}
              icon={<EmailIcon />}
              label="Continue with email"
              bg="#faf7ed"
              color="#1c1410"
              border="#1c1410"
            />
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(224,48,48,0.08)", border: "2px solid #e03030", borderRadius: 10, fontSize: 13, color: "#e03030", fontFamily: "'Space Mono', monospace" }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: "rgba(28,20,16,0.3)", fontFamily: "'Space Mono', monospace", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
        By continuing you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
}

// ── AuthGate ──────────────────────────────────────────────────────────────────

export default function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading state — blank cream screen while we check
  if (session === undefined) {
    return (
      <div style={{ minHeight: "100dvh", background: "#f0ebe0" }} />
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
