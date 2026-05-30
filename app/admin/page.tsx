export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // User must be logged in
  if (!user) {
    redirect("/login");
  }

  // Allowed admin emails
  const allowedAdmins = [
    "admin@smartbite.ae",
    "sharifu@nexa.com",
  ];

  // Block non-admin users
  if (!allowedAdmins.includes(user.email || "")) {
    redirect("/");
  }

  // Fetch orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">
          Admin Dashboard Error
        </h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        SmartBite Admin Dashboard
      </h1>

      <div className="mb-6">
        <p>
          Logged in as: <strong>{user.email}</strong>
        </p>
      </div>

      <div className="overflow-auto">
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(orders, null, 2)}
        </pre>
      </div>
    </div>
  );
}