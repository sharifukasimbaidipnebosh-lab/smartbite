"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [restaurants, setRestaurants] =
    useState<any[]>([]);

  const [orders, setOrders] =
    useState<any[]>([]);

  const loadData = async () => {

    const { data: restaurantData } =
      await supabase
        .from("restaurants")
        .select("*");

    const { data: orderData } =
      await supabase
        .from("orders")
        .select("*");

    setRestaurants(
      restaurantData || []
    );

    setOrders(orderData || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue =
    orders.reduce(
      (sum, o) =>
        sum + (o.total || 0),
      0
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        🚀 SmartBite SaaS Admin
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white p-4 rounded shadow">
          <p>Restaurants</p>
          <p className="text-2xl font-bold">
            {restaurants.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Orders</p>
          <p className="text-2xl font-bold">
            {orders.length}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Revenue</p>
          <p className="text-2xl font-bold">
            ${totalRevenue}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Platform Status</p>
          <p className="text-2xl font-bold">
            Live
          </p>
        </div>

      </div>

      <div className="space-y-3">

        {restaurants.map(
          (restaurant) => (
            <div
              key={
                restaurant.id
              }
              className="bg-white p-4 rounded shadow"
            >

              <p className="font-bold">
                {
                  restaurant.name
                }
              </p>

              <p className="text-sm">
                ID:
                {
                  restaurant.id
                }
              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
}