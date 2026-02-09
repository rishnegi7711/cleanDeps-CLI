# CleanDeps CLI 🧼

I got tired of doing the same “fix” every time a Node project randomly decided to misbehave:

> delete `node_modules` → reinstall → pray 🙃

So I’m building **CleanDeps CLI** — a tiny command-line tool that turns that routine into **one safe, repeatable command**.

This repo is also me learning how to build a proper CLI (step-by-step, commit-by-commit).

---

## What it does (right now)

- ✅ Verifies you’re inside a Node project (checks for `package.json`)
- ✅ Detects whether `node_modules` exists (and treats it safely)
- 🛠️ Next: delete `node_modules` + reinstall dependencies (coming in the next commits)

---

## Why not just `rm -rf node_modules && npm i`?

You totally can. This just makes it:
- **cross-platform friendly** (macOS / Linux / Windows)
- **safer** (guardrails so you don’t delete the wrong folder)
- **repeatable** (same steps every time, easy to share with teammates)
- **a real tool** (flags like `--dry-run`, modes like `--hard`, etc. soon)

---

## Usage

### Run locally while developing
This project uses `npm link` so I can test the command globally on my machine without publishing anything.

```bash
npm link
cleandeps
