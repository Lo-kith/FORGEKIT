# create-forgekit

**Build Bold. Ship Fast.**

A modern full-stack project scaffolding CLI by Lokith M. Generate a React + Vite + TypeScript frontend and an Express + TypeScript API, with optional MongoDB connectivity.

## Requirements

- Node.js 20 or newer
- npm

## Installation and usage

Create a project with `npx`:

```sh
npx create-forgekit my-app
cd my-app
npm run dev
```

By default, the CLI asks whether to install dependencies when run in a terminal. Choose the install behavior explicitly with `--install` or `--no-install`:

```sh
npx create-forgekit my-app --install
npx create-forgekit my-app --no-install
```

Run without a project name in an interactive terminal to choose one at the prompt:

```sh
npx create-forgekit
```

For non-interactive use, provide a project name. `--yes` accepts defaults (including installing dependencies) and permits using an existing empty destination directory. Non-empty destinations are never overwritten.

## Features

- Interactive prompts with non-interactive command-line flags
- Branded terminal output with color-aware fallbacks
- React, Vite, and TypeScript frontend in `web/`
- Express and TypeScript API in `api/`
- MongoDB through Mongoose; the API still starts if MongoDB is unavailable
- `GET /api/health` reports API and database status
- Safe `.env.example` files without generated credentials
- Optional dependency installation with actionable failure output

The generated project does not include Tailwind CSS, shadcn, Axios, authentication, or other integrations unless you add them yourself.

## CLI options

| Option | Alias | Description |
| --- | --- | --- |
| `--install` | `-i` | Install dependencies after generation |
| `--no-install` | — | Skip dependency installation |
| `--yes` | `-y` | Use defaults and accept an empty destination directory |
| `--version` | `-v` | Display the CLI version |
| `--help` | `-h` | Display help |

Examples:

```sh
npx create-forgekit my-app --install
npx create-forgekit my-app --no-install
npx create-forgekit --help
npx create-forgekit --version
```

## Generated project

```text
my-app/
├── api/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
├── web/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
├── package.json
├── .gitignore
└── README.md
```

## Generated project commands

Run these commands from the generated project root:

| Command | Description |
| --- | --- |
| `npm install` | Install workspace dependencies |
| `npm run dev` | Start the API and frontend |
| `npm run build` | Build both workspaces for production |
| `npm run typecheck` | Type-check both workspaces |
| `npm run dev --workspace api` | Start only the API |
| `npm run dev --workspace web` | Start only the frontend |

The frontend is served at `http://localhost:5173`; the API health endpoint is `http://localhost:3001/api/health`.

To enable MongoDB, copy `api/.env.example` to `api/.env` and set `MONGODB_URI`. The API does not require MongoDB to start. To change the frontend's API base URL, configure `VITE_API_URL` in `web/.env`. Do not commit credentials.

## Screenshots

<!-- TODO: Add CLI startup and generated-app screenshots before publishing. -->

## Local development and package verification

```sh
npm install
npm run typecheck
npm test
npm pack --dry-run
```

## Publish manually

Review the tarball contents, sign in to npm, and publish when ready:

```sh
npm pack --dry-run
npm login
npm publish --access public
```

Publishing is not automated.

## Project URLs

The completion screen shows a documentation URL only when `FORGEKIT_DOCS_URL` is set or `config.forgekit.docsUrl` is configured in the package metadata. It shows a GitHub URL only when repository metadata points to GitHub.

## License

MIT
