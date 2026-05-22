"use client";

import { useState } from "react";
import AIChat from "./AIChat";

const menu = [
  { id: 1, name: "Zinger Burger", price: 12 },
  { id: 2, name: "Spicy Wings", price: 10 },
  { id: 3, name: "Fries", price: 5 },
  { id: 4, name: "Pepsi", price: 3 },
];

export default function Menu() {
  const [cart, setCart] = useState<any[]>([]);

  // ✅ Add single item manually
  const addToCart = (item: any) => {
    setCart((prev) => [...prev, item]);
  };

  // ✅ AI will call this to push multiple items
  const addAIItems = (items: any[]) => {
    items.forEach((aiItem) => {
      const found = menu.find(
        (m) =>
          m.name.toLowerCase() === aiItem.name.toLowerCase()
      );

      if (found) {
        for (let i = 0; i < aiItem.qty; i++) {
          setCart((prev) => [...prev, found]);
        }
      }
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <div className="w-full max-w-2xl mt-8">

      {/* 🍗 AI CASHIER */}
      <AIChat onItems={addAIItems} />

      <h2 className="text-2xl font-bold mb-4 mt-6">
        Menu 🍔
      </h2>

      {/* 🍔 MENU ITEMS */}
      <div className="grid gap-3">
        {menu.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >
            <div>
              <p className="font-bold">{item.name}</p>
              <p>${item.price}</p>
            </div>

            <button
              onClick={() => addToCart(item)}
              className="bg-red-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* 🛒 CART */}
      <div className="mt-8 bg-yellow-100 p-4 rounded-xl">
        <h3 className="font-bold">Cart 🛒</h3>

        {cart.length === 0 ? (
          <p>No items yet</p>
        ) : (
          cart.map((item, index) => (
            <p key={index}>
              {item.name} - ${item.price}
            </p>
          ))
        )}

        <p className="mt-3 font-bold">
          Total: ${total}
        </p>
      </div>
    </div>
  );
}