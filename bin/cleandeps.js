#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

const cwd = process.cwd();
const pkgPath = path.join(cwd, "package.json");
const packageManagers = [
  { name: "npm", lockFile: "package-lock.json", installCommand: "npm install" },
  { name: "bun", lockFile: "bun.lockb", installCommand: "bun install" },
  { name: "yarn", lockFile: "yarn.lock", installCommand: "yarn install" },
];

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

if (!fileExists(pkgPath)) {
  console.error("❌ CleanDeps: No package.json found in this folder");
  console.error(
    "➡️ Run this command inside a Node project(where package.json exists).",
  );
  process.exit(1);
}

console.log("✅ Found package.json");
console.log(`📁 Project: ${cwd}`);

const packageManager = detectPackageManager(cwd);
removeNodeModules(cwd);
installDependencies(packageManager);

function detectPackageManager(dirPath) {
  const packageManager = packageManagers.find((pm) => {
    const lockFilePath = path.join(dirPath, pm.lockFile);
    return fileExists(lockFilePath);
  });
  if (packageManager === undefined) {
    console.error("❌ CleanDeps: No package manager found in this folder");
    console.error(
      "➡️ Run this command inside a Node project where a lock file exists).",
    );
    process.exit(1);
  }

  return packageManager;
}

function removeNodeModules(dirPath) {
  const nodeModulesPath = path.join(dirPath, "node_modules");

  if (!fs.existsSync(nodeModulesPath)) {
    console.log("❗️ No Node modules folder found,skipping cleaning");
    return;
  }
  console.log("🗑️ Removing node_modules...");
  try {
    fs.rmSync(nodeModulesPath, {
      recursive: true,
      force: true,
    });
    console.log("✅ node_modules removed");
  } catch (error) {
    console.error("❌ Failed to remove node_modules");
    process.exit(1);
  }
}

function installDependencies(packageManager) {
  console.log("📦 Installing dependencies...");
  try {
    execSync(packageManager.installCommand, { stdio: "inherit" });
    console.log("✅ Dependencies installed");
  } catch (error) {
    console.error("❌ Failed to install dependencies");
    process.exit(1);
  }
}
