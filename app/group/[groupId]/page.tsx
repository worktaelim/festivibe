import GroupApp from "@/components/GroupApp";

export default async function GroupPage(props: PageProps<"/group/[groupId]">) {
  const { groupId } = await props.params;
  return <GroupApp groupId={groupId} />;
}
