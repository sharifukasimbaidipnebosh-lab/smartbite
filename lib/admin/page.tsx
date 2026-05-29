export default async function AdminPage() {
  const { data } = await supabase.from("orders").select("*");

  return <div>Admin</div>;
}