import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.PAGES_BASE ?? "",
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
