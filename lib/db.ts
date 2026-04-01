import { supabase } from "./supabase";

export interface Group {
  id: string;
  code: string;
  name: string;
  cover_url: string;
  website_url: string;
  week: 1 | 2;
  created_at: string;
}

function generateCode(len = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(len)))
    .map((b) => chars[b % chars.length])
    .join("");
}

export interface Member {
  id: string;
  group_id: string;
  name: string;
  phone: string;
  photo_url: string;
  color: string;
  joined_at: string;
}

export interface ArtistPick {
  id: string;
  group_id: string;
  member_id: string;
  artist_id: string;
  created_at: string;
}

const MEMBER_COLORS = [
  "#f72585", "#fb8500", "#7b2fff", "#4cc9f0",
  "#06d6a0", "#ffd166", "#ef476f", "#118ab2",
];

export function randomColor(): string {
  return MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];
}

// ── Groups ────────────────────────────────────────────────────────────────────

export async function createGroup(
  name: string,
  cover_url = "",
  website_url = "",
  week: 1 | 2 = 2
): Promise<{ id: string; code: string }> {
  const code = generateCode();
  const { data, error } = await supabase
    .from("groups")
    .insert({ name, cover_url, website_url, code, week })
    .select("id, code")
    .single();
  if (error) throw error;
  return { id: data.id, code: data.code };
}

export async function getGroup(idOrCode: string): Promise<Group | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(idOrCode);
  const { data } = await supabase
    .from("groups")
    .select("*")
    .eq(isUuid ? "id" : "code", idOrCode)
    .single();
  return data ?? null;
}

// ── Members ───────────────────────────────────────────────────────────────────

export async function addMember(
  groupId: string,
  member: { name: string; phone: string; photo_url: string; color: string }
): Promise<string> {
  const { data, error } = await supabase
    .from("members")
    .insert({ group_id: groupId, ...member })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export function subscribeMembers(
  groupId: string,
  cb: (members: Member[]) => void
): () => void {
  // Initial fetch
  supabase
    .from("members")
    .select("*")
    .eq("group_id", groupId)
    .then(({ data }) => cb((data as Member[]) ?? []));

  // Real-time updates
  const channel = supabase
    .channel(`members:${groupId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "members", filter: `group_id=eq.${groupId}` },
      () => {
        supabase
          .from("members")
          .select("*")
          .eq("group_id", groupId)
          .then(({ data }) => cb((data as Member[]) ?? []));
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

// ── Picks ─────────────────────────────────────────────────────────────────────

export function subscribePicks(
  groupId: string,
  cb: (picks: ArtistPick[]) => void
): () => void {
  // Initial fetch
  supabase
    .from("picks")
    .select("*")
    .eq("group_id", groupId)
    .then(({ data }) => cb((data as ArtistPick[]) ?? []));

  // Real-time updates
  const channel = supabase
    .channel(`picks:${groupId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "picks", filter: `group_id=eq.${groupId}` },
      () => {
        supabase
          .from("picks")
          .select("*")
          .eq("group_id", groupId)
          .then(({ data }) => cb((data as ArtistPick[]) ?? []));
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

export async function togglePick(
  groupId: string,
  memberId: string,
  artistId: string,
  isCurrentlyPicked: boolean
): Promise<void> {
  const pickId = `${memberId}_${artistId}`;
  if (isCurrentlyPicked) {
    const { error } = await supabase.from("picks").delete().eq("id", pickId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("picks")
      .insert({ id: pickId, group_id: groupId, member_id: memberId, artist_id: artistId });
    if (error) throw error;
  }
}

export async function updateMember(
  memberId: string,
  updates: { name?: string; photo_url?: string; phone?: string }
): Promise<void> {
  const { error } = await supabase.from("members").update(updates).eq("id", memberId);
  if (error) throw error;
}

// ── Image ─────────────────────────────────────────────────────────────────────

export async function uploadCoverImage(file: File): Promise<string> {
  const compressed = await compressImage(file, 800);
  const res = await fetch(compressed);
  const blob = await res.blob();
  const ext = blob.type.split("/")[1] || "jpg";
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from("covers")
    .upload(fileName, blob, { contentType: blob.type, upsert: false });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from("covers").getPublicUrl(data.path);
  return publicUrl;
}

export function compressImage(file: File, maxSize = 128): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        if (maxSize === 128) {
          // Square crop for avatars
          canvas.width = 128;
          canvas.height = 128;
          const ctx = canvas.getContext("2d")!;
          const min = Math.min(img.width, img.height);
          const sx = (img.width - min) / 2;
          const sy = (img.height - min) / 2;
          ctx.drawImage(img, sx, sy, min, min, 0, 0, 128, 128);
        } else {
          // Proportional resize for cover photos
          const ratio = Math.min(maxSize / img.width, (maxSize * 0.6) / img.height);
          canvas.width = Math.round(img.width * ratio);
          canvas.height = Math.round(img.height * ratio);
          canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}
