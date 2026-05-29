import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminPage() {
  const { data, error } = await supabase
    .from("orders")
    .select("*");

  if (error) {
    console.error(error);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}