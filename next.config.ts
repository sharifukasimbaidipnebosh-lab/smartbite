import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // FIX: correct modern Next.js config
  serverExternalPackages: ["@supabase/supabase-js"],

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;