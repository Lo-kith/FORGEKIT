# create-forgekit

**Build Bold. Ship Fast.**

A modern full-stack project scaffolding CLI. Forgekit creates a ready-to-customize React + Vite + TypeScript frontend and Express + TypeScript API, with optional MongoDB connectivity.

## Requirements

- Node.js 20 or newer
- npm

## Create a project

```sh
npx create-forgekit my-app
cd my-app
npm run dev
```

Add `--install` to install dependencies during generation, or `--no-install` to defer installation:

```sh
npx create-forgekit my-app --install
npx create-forgekit my-app --no-install
```

With no project name, Forgekit opens an interactive prompt in a terminal:

```sh
npx create-forgekit
```

For unattended usage, provide a name and `--yes`. This accepts defaults (including installing dependencies) and permits using an existing **empty** destination directory. Non-empty directories are never overwritten.

## Features

- Branded, interactive CLI with graceful color handling
- React + Vite + TypeScript frontend and Express + TypeScript API workspaces
- MongoDB connection support that does not prevent the API from starting when the database is unavailable
- `/api/health` endpoint with database connection status
- Safe `.env.example` files; no credentials are generated
- Dependency installation with actionable failure output
- npm package templates included in the published tarball

## Commands and options

| Command | Description |
| --- | --- |
| `npx create-forgekit [project-directory]` | Generate a project |
| `npx create-forgekit my-app --install` | Generate and install dependencies |
| `npx create-forgekit my-app --no-install` | Generate without installing dependencies |
| `npx create-forgekit --help` | Show help |
| `npx create-forgekit --version` | Show the package version |

Options: `-i, --install`, `--no-install`, `-y, --yes`, `-v, --version`, `-h, --help`.

## Screenshots

<!-- TODO: Add CLI startup and generated-app screenshots before publishing. -->

## Local development

```sh
npm install
npm run typecheck
npm test
npm pack --dry-run
```

## Publishing

Review the dry-run package contents and verify the npm account before publishing:

```sh
npm pack --dry-run
npm login
npm publish --access public
```

Publishing is intentionally not automated by this package.

## Project URLs

The completion screen shows a documentation URL only when `FORGEKIT_DOCS_URL` is set or `config.forgekit.docsUrl` is configured in `package.json`. A GitHub URL is shown only when the package's repository metadata points to GitHub.
