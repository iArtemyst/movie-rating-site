import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "development" ? undefined : "export",
  distDir: process.env.NODE_ENV === "development" ? undefined : "docs",
  basePath: "/movie-rating-site", /* TODO Remove */
};

export default nextConfig;
