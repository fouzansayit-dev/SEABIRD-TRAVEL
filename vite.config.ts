import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

// Auto-rename script to clean up filenames with spaces so they work on production servers
const renameFile = (oldPath: string, newPath: string) => {
  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Auto-renamed: ${oldPath} -> ${newPath}`);
    } catch (e) {
      console.error(`Failed to rename ${oldPath}:`, e);
    }
  }
};

// 1. Rename public/ banner & logo
renameFile("public/canada banner travel.png", "public/canada_banner_travel.png");
renameFile("public/dubai banner.png", "public/dubai_banner.png");
renameFile("public/canada banner.png", "public/canada_banner.png");
renameFile("public/seabird_logo (1).png", "public/seabird_logo.png");
renameFile("public/seabird travel banner.png", "public/seabird_travel_banner.png");

// 2. Rename bottom banners/ files
renameFile("bottom banners/seabird canada banner.png", "bottom banners/seabird_canada_banner.png");
renameFile("bottom banners/seabird dubai banner.png", "bottom banners/seabird_dubai_banner.png");
renameFile("bottom banners/seabird india banner.png", "bottom banners/seabird_india_banner.png");

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        entry: "src/server.ts",
      },
    }),
    react(),
    viteTsconfigPaths(),
    tailwindcss(),
  ],
});
