# CleanDeps CLI 🧼

I got tired of doing the same “fix” every time a Node project randomly decided to misbehave:

> delete `node_modules` → reinstall → pray 🙃

So I built **CleanDeps CLI** — a tiny command-line tool that turns that routine into **one safe, repeatable command**.

This repo is also me learning how to build a proper CLI (step-by-step, commit-by-commit).

---

## What it does

- ✅ Verifies you’re inside a Node project (checks for `package.json`)
- ✅ Detects whether `node_modules` exists (and treats it safely)
- ✅ Delete `node_modules` + reinstall dependencies
- ✅ Skips cleaning if `node_modules` doesn't exist and installs directly
- ✅ Supported package managers : npm,bun and yarn

---

## Why not just `rm -rf node_modules && npm i`?

You totally can. This just makes it:
- **cross-platform friendly** (macOS / Linux / Windows)
- **safer** (guardrails so you don’t delete the wrong folder)
- **repeatable** (same steps every time, easy to share with teammates)
- **a real tool** (flags like `--dry-run`, modes like `--hard`, etc. coming soon)

---

## Usage

### Installation

```bash
npm install -g cleandeps-cli
```
### How to run

cd into your project and run:
```bash
cleandeps
```
Or run without installing:
```bash
npx cleandeps-cli
```

## Development

### Run locally while developing
This project uses `npm link` so I can test the command globally on my machine without publishing anything.

```bash
npm link
cleandeps
```
