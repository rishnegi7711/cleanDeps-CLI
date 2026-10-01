# CleanDeps

A small CLI that deletes `node_modules` and reinstalls your dependencies in one command.

I kept typing `rm -rf node_modules && npm i` whenever a project started acting up, so I turned it into a tool. It was also my excuse to learn how Node CLIs work.

## Install

```bash
npm install -g cleandeps-cli
```

Or run it once without installing:

```bash
npx cleandeps-cli
```

Requires Node 18.3 or later.

## Usage

Run it from your project's root folder:

```bash
cleandeps
```

By default it:

1. checks there's a `package.json` in the current folder, and stops if there isn't
2. works out your package manager from the lockfile
3. deletes `node_modules` (or skips this step if it doesn't exist)
4. runs a fresh install

## Options

| Flag | What it does |
| --- | --- |
| `-l, --lock` | Also deletes the lockfile, so dependency versions are resolved again. Versions may change. |
| `-c, --cache` | Clears the package manager's cache before installing. |
| `-r, --run <script>` | Runs a script from `package.json` once the install finishes, e.g. `--run dev`. |
| `-v, --version` | Prints the version. |
| `-h, --help` | Shows the options. |

A full reset that starts the dev server afterwards:

```bash
cleandeps --lock --cache --run dev
```

## How it works

- **Package manager detection.** It looks for `package-lock.json`, `bun.lock`, `bun.lockb` and `yarn.lock`, in that order, and uses the first one it finds. If a project has more than one lockfile, the first match wins. If there's no lockfile at all, it stops instead of guessing.
- **Checks before deleting.** Everything is validated first: `package.json` exists and is valid JSON, a lockfile exists, and the `--run` script is defined. If any check fails, nothing is touched.
- **Cache clearing** runs the package manager's own command: `npm cache clean --force`, `bun pm cache rm` or `yarn cache clean`.
- **Cross-platform.** Files are removed with Node's `fs` module rather than shell commands, so it behaves the same on macOS, Linux and Windows.

## Development

```bash
git clone https://github.com/rishnegi7711/cleandeps-cli.git
cd cleandeps-cli
npm link
```

`npm link` points the `cleandeps` command at your local copy, so you can test changes without publishing. Run `npm unlink -g cleandeps-cli` when you're done.

## License

MIT
