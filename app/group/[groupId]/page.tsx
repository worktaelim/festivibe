import { type Metadata } from "next";
import GroupApp from "@/components/GroupApp";
import AuthGate from "@/components/AuthGate";
import { getGroup } from "@/lib/db";

export async function generateMetadata(props: PageProps<"/group/[groupId]">): Promise<Metadata> {
  const { groupId } = await props.params;
  const group = await getGroup(groupId);
  if (!group) return { title: "Festivibe" };

  const title = `${group.name} · Festivibe`;
  const week = group.week ?? 2;
  const weekDates = week === 1 ? "Apr 10–12" : "Apr 17–19";
  const description = `You're invited to join ${group.name} and plan Coachella 2026 Week ${week} (${weekDates}) together! Pick your artists and see who's going.`;
  const hasRealImage = group.cover_url && !group.cover_url.startsWith("data:");
  const images = hasRealImage ? [{ url: group.cover_url, width: 800 }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title,
      description,
      ...(images.length && { images: [group.cover_url] }),
    },
  };
}

export default async function GroupPage(props: PageProps<"/group/[groupId]">) {
  const { groupId } = await props.params;
  return (
    <AuthGate>
      <GroupApp groupId={groupId} />
    </AuthGate>
  );
}
