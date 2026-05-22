"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Billing() {
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    setLoading(true);

    const { data: user } = await supabase.auth.getUser();

    const res = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify({
        restaurantId: "demo",
      }),
    });

    const data = await res.json();

    window.location.href = data.url;
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Upgrade to Pro 💳</h1>

      <button
        onClick={subscribe}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Start Subscription"}
      </button>
    </div>
  );
}