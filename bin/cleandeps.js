#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { parseArgs } = require("util");
const pkg = require("../package.json");

const cwd = process.cwd();
const pkgPath = path.join(cwd, "package.json");

const packageManagers = [
  {
    name: "npm",
    lockFile: "package-lock.json",
    install: "npm install",
    clearCache: "npm cache clean --force",
  },
  {
    name: "bun",
    lockFile: "bun.lock",
    install: "bun install",
    clearCache: "bun pm cache rm",
  },
  {
    name: "bun",
    lockFile: "bun.lockb",
    install: "bun install",
    clearCache: "bun pm cache rm",
  },
  {
    name: "yarn",
    lockFile: "yarn.lock",
    install: "yarn install",
    clearCache: "yarn cache clean",
  },
];

let options;
try {
  ({ values: options } = parseArgs({
    options: {
      lock: { type: "boolean", short: "l" },
      cache: { type: "boolean", short: "c" },
      run: { type: "string", short: "r" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
  }));
} catch (error) {
  console.error(`❌ ${error.message}`);
  console.error("➡️ Run cleandeps --help to see the available options.");
  process.exit(1);
}

if (options.help) {
  console.log(`CleanDeps removes node_modules and reinstalls your dependencies.

Usage: cleandeps [options]

Options:
  -l, --lock          also delete the lockfile, so versions are resolved fresh
  -c, --cache         clear the package manager's cache before installing
  -r, --run <script>  run a package.json script when done (e.g. --run dev)
  -v, --version       show the version
  -h, --help          show this help`);
  process.exit(0);
}

if (options.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (!fs.existsSync(pkgPath)) {
  console.error("❌ CleanDeps: No package.json found in this folder");
  console.error(
    "➡️ Run this command inside a Node project (where package.json exists).",
  );
  process.exit(1);
}

let projectPkg;
try {
  projectPkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
} catch {
  console.error("❌ CleanDeps: package.json isn't valid JSON");
  process.exit(1);
}

if (options.run && !projectPkg.scripts?.[options.run]) {
  console.error(`❌ CleanDeps: No "${options.run}" script in package.json`);
  process.exit(1);
}

console.log("✅ Found package.json");
console.log(`📁 Project: ${cwd}`);

const packageManager = detectPackageManager(cwd);

removePath(path.join(cwd, "node_modules"), "node_modules");

if (options.lock) {
  console.log(
    `⚠️ Removing ${packageManager.lockFile}: versions will be re-resolved and may change.`,
  );
  removePath(path.join(cwd, packageManager.lockFile), packageManager.lockFile);
}

if (options.cache) {
  console.log(`🧹 Clearing ${packageManager.name} cache...`);
  runCommand(packageManager.clearCache, "Failed to clear the cache");
  console.log("✅ Cache cleared");
}

console.log("📦 Installing dependencies...");
runCommand(packageManager.install, "Failed to install dependencies");
console.log("✅ Dependencies installed");

if (options.run) {
  console.log(`▶️ Running "${options.run}"...`);
  runCommand(
    `${packageManager.name} run ${options.run}`,
    `"${options.run}" exited with an error`,
  );
}

function detectPackageManager(dirPath) {
  const found = packageManagers.find((pm) =>
    fs.existsSync(path.join(dirPath, pm.lockFile)),
  );
  if (!found) {
    console.error(
      "❌ CleanDeps: No lockfile found, so the package manager can't be detected",
    );
    console.error(
      "➡️ Run your package manager's install once to create a lockfile.",
    );
    process.exit(1);
  }
  return found;
}

function removePath(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    console.log(`❗️ No ${label} found, skipping`);
    return;
  }
  console.log(`🗑️ Removing ${label}...`);
  try {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log(`✅ ${label} removed`);
  } catch {
    console.error(`❌ Failed to remove ${label}`);
    process.exit(1);
  }
}

function runCommand(command, failMessage) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch {
    console.error(`❌ ${failMessage}`);
    process.exit(1);
  }
}
