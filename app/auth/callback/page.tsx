"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handle() {
      const code = searchParams.get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      } else {
        // Hash-based (implicit flow fallback)
        await supabase.auth.getSession();
      }
      const next = searchParams.get("next") ?? "/";
      router.replace(next);
    }
    handle();
  }, [router, searchParams]);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#f0ebe0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ fontFamily: "'Space Mono', monospace", color: "#1c1410", fontSize: 14 }}>
        Signing in...
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100dvh", background: "#f0ebe0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", color: "#1c1410", fontSize: 14 }}>Signing in...</div>
      </div>
    }>
      <CallbackInner />
    </Suspense>
  );
}
