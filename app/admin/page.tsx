import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const allowedAdmins = [
    "admin@smartbite.ae",
    "sharifu@nexa.com",
  ];

  if (!allowedAdmins.includes(user.email!)) {
    redirect("/");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <pre>
        {JSON.stringify(orders, null, 2)}
      </pre>
    </div>
  );
}