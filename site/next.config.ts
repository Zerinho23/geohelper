import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const nextConfig: NextConfig = {output:"export",outputFileTracingRoot:dirname(fileURLToPath(import.meta.url)),images:{unoptimized:true}};
export default nextConfig;
