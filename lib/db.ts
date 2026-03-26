import { supabase } from "./supabase";

export interface Group {
  id: string;
  name: string;
  created_at: string;
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

export async function createGroup(name: string): Promise<string> {
  const { data, error } = await supabase
    .from("groups")
    .insert({ name })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function getGroup(id: string): Promise<Group | null> {
  const { data } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
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

// ── Image ─────────────────────────────────────────────────────────────────────

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 128;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}
