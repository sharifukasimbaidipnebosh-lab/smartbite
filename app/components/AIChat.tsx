"use client";

import { useState } from "react";

export default function AIChat({ onItems }: any) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/ai-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        "You: " + message,
        "AI: " + data.reply,
      ]);

      onItems(data.items || []);
      setMessage("");
    } catch (error) {
      setChat((prev) => [
        ...prev,
        "AI: Sorry, something went wrong.",
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <h3 className="font-bold mb-2">🍗 AI Cashier</h3>

      <div className="h-28 overflow-auto border p-2 mb-2 text-sm">
        {chat.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={message}
          placeholder="e.g. I want 2 wings and a Pepsi"
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-red-600 text-white px-3 rounded"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}