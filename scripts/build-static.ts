import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const apiPath = path.join(__dirname, "src/app/api");
const tempDir = path.join(__dirname, "temp-build-backup");
const apiBackupPath = path.join(tempDir, "api");

// Helper function to recursively copy directory
function copyDir(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper function to remove directory recursively
function removeDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function buildStaticSite() {
  try {
    console.log("🚀 Starting static build process...");

    // Create temp directory and backup API routes
    if (fs.existsSync(apiPath)) {
      console.log("📁 Backing up API routes...");
      copyDir(apiPath, apiBackupPath);
      removeDir(apiPath);
      console.log("✅ API routes temporarily removed from src/app/api");
    } else {
      console.log("ℹ️  No API routes found, proceeding with build...");
    }

    // Clean any existing build artifacts
    const outDir = path.join(__dirname, "out");
    const nextDir = path.join(__dirname, ".next");

    if (fs.existsSync(outDir)) {
      removeDir(outDir);
      console.log("🧹 Cleaned previous build output");
    }

    // Build static version
    console.log("📦 Building static export...");
    execSync("next build", { stdio: "inherit" });
    console.log("✅ Static build completed successfully!");
    console.log("📂 Static files generated in ./out directory");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  } finally {
    // Restore API folder
    if (fs.existsSync(apiBackupPath)) {
      console.log("📁 Restoring API routes...");
      copyDir(apiBackupPath, apiPath);
      removeDir(tempDir);
      console.log("✅ API routes restored to src/app/api");
    }

    console.log("🎉 Build process completed!");
  }
}

buildStaticSite();
