# Plastikaweb

Portfolio of Carlos Matheu, senior freelance Angular/TypeScript developer. Static site built with Astro 7, content from headless WordPress (planned), in Catalan, Spanish and English.

The full README (badges, quality checks, deploy and content rebuild) arrives with T-24 in [`TASKS.md`](TASKS.md). Requirements: [`docs/requirements.md`](docs/requirements.md).

## Requirements

- Node 24 LTS, pinned in [`.nvmrc`](.nvmrc) and `package.json` `engines`. With nvm: `nvm use`.
- npm (ships with Node 24).

## Commands

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `npm ci`          | Install the exact dependencies from the lock |
| `npm run dev`     | Dev server at `http://localhost:4321`        |
| `npm run build`   | Production build to `./dist/`                |
| `npm run preview` | Serve the build locally                      |
| `npm run format`  | Format with Prettier                         |
