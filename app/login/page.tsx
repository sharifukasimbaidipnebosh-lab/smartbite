"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // EMAIL LOGIN
  async function login() {
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // refresh auth session
    await supabase.auth.refreshSession();

    router.push("/dashboard");

    router.refresh();
  }

  // GOOGLE LOGIN
  async function loginWithGoogle() {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo:"${window.location.origin}/auth/callback",
        },
      });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold">
            🍔 SmartBite
          </h1>

          <p className="text-gray-500 mt-2">
            AI Food Delivery Platform
          </p>

        </div>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Company Email or Personal Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-black"
        />

        {/* PASSWORD INPUT */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-black"
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* DIVIDER */}
        <div className="flex items-center my-6">

          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="px-3 text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-300"></div>

        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={loginWithGoogle}
          className="w-full border border-gray-300 p-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition"
        >

          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />

          <span className="font-medium">
            Continue with Google
          </span>

        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Secure login powered by Supabase
        </p>

      </div>

    </div>
  );
}