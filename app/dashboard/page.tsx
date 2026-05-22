"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  items: any[];
  total: number;
  status: string;
  restaurant_id: string;
};

type Restaurant = {
  id: string;
  name: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] =
    useState("all");

  const [filter, setFilter] = useState("all");

  const [subscription, setSubscription] =
    useState<any>(null);

  // 🔐 USER STATE
  const [userEmail, setUserEmail] =
    useState("");

  const [userRole, setUserRole] =
    useState("customer");

  // 🔐 GET CURRENT USER
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

      // OPTIONAL ROLE SYSTEM
      // Reads role from Supabase metadata
      const role =
        user.user_metadata?.role || "customer";

      setUserRole(role);
    };

    getCurrentUser();
  }, []);

  // 💳 CHECK SUBSCRIPTION
  const checkSubscription = async (
    restaurantId: string
  ) => {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("status", "active")
      .single();

    return data;
  };

  // 💳 BILLING REDIRECT
  useEffect(() => {
    if (
      selectedRestaurantId &&
      selectedRestaurantId !== "all"
    ) {
      (async () => {
        const sub =
          await checkSubscription(
            selectedRestaurantId
          );

        setSubscription(sub);

        if (!sub) {
          router.push("/billing");
        }
      })();
    }
  }, [selectedRestaurantId]);

  // 🏪 FETCH RESTAURANTS
  const fetchRestaurants = async () => {
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .order("name");

    if (data) {
      setRestaurants(data);
    }
  };

  // 📦 FETCH ORDERS
  const fetchOrders = async () => {
    let query =
      supabase.from("orders").select("*");

    if (selectedRestaurantId !== "all") {
      query = query.eq(
        "restaurant_id",
        selectedRestaurantId
      );
    }

    const { data } = await query.order(
      "created_at",
      {
        ascending: false,
      }
    );

    setOrders(data || []);
  };

  // 🚀 INITIAL LOAD
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 🔄 REALTIME ORDERS
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel(
        `orders-${selectedRestaurantId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRestaurantId]);

  // 📦 UPDATE ORDER STATUS
  const updateStatus = async (
    id: string,
    status: string
  ) => {
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
  };

  // 💳 STRIPE UPGRADE
  const handleUpgrade = async () => {
    const res = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify({
        restaurantId:
          selectedRestaurantId,
      }),
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
  };

  // 🔍 FILTERED ORDERS
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(
          (o) => o.status === filter
        );

  // 📊 STATS
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.total || 0),
    0
  );

  const pendingOrders = orders.filter(
    (o) => o.status === "pending"
  ).length;

  const readyOrders = orders.filter(
    (o) => o.status === "ready"
  ).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">

        <div>
          <h1 className="text-2xl font-bold">
            🍽️ SmartBite SaaS Dashboard
          </h1>

          <p className="text-sm text-gray-600">
            Logged in as:
            {" "}
            <strong>{userEmail}</strong>
          </p>

          <p className="text-sm text-gray-600">
            Role:
            {" "}
            <strong>{userRole}</strong>
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={handleUpgrade}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Upgrade Plan 💳
          </button>

          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>

      </div>

      <p className="text-sm text-gray-500 mb-4">
        🔐 Protected by Supabase Auth
      </p>

      {/* RESTAURANT SELECTOR */}
      <select
        value={selectedRestaurantId}
        onChange={(e) =>
          setSelectedRestaurantId(
            e.target.value
          )
        }
        className="mb-6 border p-2 rounded bg-white"
      >
        <option value="all">
          All Restaurants
        </option>

        {restaurants.map((r) => (
          <option
            key={r.id}
            value={r.id}
          >
            {r.name}
          </option>
        ))}
      </select>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <p>Total Orders</p>

          <p className="text-xl font-bold">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Revenue</p>

          <p className="text-xl font-bold">
            ${totalRevenue}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Pending</p>

          <p className="text-xl font-bold">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Ready</p>

          <p className="text-xl font-bold">
            {readyOrders}
          </p>
        </div>

      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-4 flex-wrap">

        {[
          "all",
          "pending",
          "preparing",
          "ready",
          "delivered",
        ].map((status) => (
          <button
            key={status}
            onClick={() =>
              setFilter(status)
            }
            className={`px-3 py-1 rounded ${
              filter === status
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {status}
          </button>
        ))}

      </div>

      {/* ORDERS */}
      <div className="space-y-3">

        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded shadow"
          >

            <div className="flex justify-between">

              <p className="font-bold">
                Order #
                {order.id.slice(0, 6)}
              </p>

              <span className="px-2 py-1 text-sm bg-gray-200 rounded">
                {order.status}
              </span>

            </div>

            <div className="mt-2 text-sm">

              {Array.isArray(order.items) &&
                order.items.map(
                  (item, i) => (
                    <p key={i}>
                      🍔 {item.name} ×{" "}
                      {item.qty}
                    </p>
                  )
                )}

            </div>

            <p className="font-bold mt-2">
              Total: ${order.total}
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">

              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    "preparing"
                  )
                }
                className="bg-yellow-500 px-3 py-1 rounded text-white"
              >
                Preparing
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    "ready"
                  )
                }
                className="bg-green-600 px-3 py-1 rounded text-white"
              >
                Ready
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order.id,
                    "delivered"
                  )
                }
                className="bg-blue-600 px-3 py-1 rounded text-white"
              >
                Delivered
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}