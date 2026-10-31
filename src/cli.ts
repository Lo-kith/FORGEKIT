#!/usr/bin/env node
import { confirm, isCancel, text } from "@clack/prompts";
import boxen from "boxen";
import pc from "picocolors";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import { cp, lstat, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import ora from "ora";
import { parseArgs } from "./args.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const templateRoot = join(packageRoot, "templates");
const banner = [
  "███████╗ ██████╗ ██████╗  ██████╗ ███████╗",
  "██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝",
  "█████╗  ██║   ██║██████╔╝██║  ███╗█████╗",
  "██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝",
  "██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗",
  "╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝",
].join("\n");

interface PackageMetadata {
  name: string;
  version: string;
  repository?: string | { url?: string };
  config?: { forgekit?: { docsUrl?: string } };
}

let activeInstall: ChildProcess | undefined;
let activeSpinner: ReturnType<typeof ora> | undefined;
let activeDestination: { path: string; created: boolean } | undefined;
let interrupted = false;

function showBanner(): void {
  console.log(pc.bold(pc.cyan(banner)));
  console.log(pc.bold("FORGEKIT"));
  console.log(pc.yellow("Build Bold. Ship Fast."));
  console.log(pc.dim("A modern full-stack project scaffolding CLI."));
  console.log(pc.dim("Crafted for developers who build.\n"));
}

function showHelp(): void {
  console.log(`Usage: create-forgekit [project-directory] [options]

Create a full-stack React + Vite + Express + TypeScript project.

Options:
  -i, --install     Install dependencies after generating the project
      --no-install  Skip dependency installation
  -y, --yes         Use defaults and confirm an empty destination directory
  -v, --version     Show the package version
  -h, --help        Show this help

Examples:
  npx create-forgekit my-app
  npx create-forgekit my-app --install
  npx create-forgekit my-app --no-install
  npx create-forgekit`);
}

const packageJsonContent = await readFile(join(packageRoot, "package.json"), "utf8");
function readMetadata(): PackageMetadata {
  return JSON.parse(packageJsonContent) as PackageMetadata;
}

function getRepositoryUrl(repository: PackageMetadata["repository"]): string | undefined {
  const url = typeof repository === "string" ? repository : repository?.url;
  if (!url) return undefined;
  const normalized = url.replace(/^git\+/, "").replace(/\.git$/, "");
  return /^https?:\/\/github\.com\/[^/]+\/[^/]+$/i.test(normalized) ? normalized : undefined;
}

function isValidProjectName(name: string): boolean {
  return /^[a-z0-9][a-z0-9._-]*$/.test(name) && !name.endsWith(".");
}

async function destinationIsEmpty(path: string): Promise<boolean> {
  try {
    return (await readdir(path)).length === 0;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return true;
    throw error;
  }
}

async function prepareDestination(
  destination: string,
  allowConfirm: boolean,
  autoConfirm: boolean,
): Promise<{ accepted: boolean; created: boolean }> {
  try {
    const stats = await lstat(destination);
    if (!stats.isDirectory()) {
      throw new Error(`The destination exists and is not a directory: ${destination}`);
    }
    if (!(await destinationIsEmpty(destination))) {
      throw new Error(`The destination is not empty; refusing to overwrite: ${destination}`);
    }
    if (!autoConfirm) {
      if (!allowConfirm) return { accepted: false, created: false };
      const accepted = await confirm({
        message: `The directory ${destination} is empty. Use it for this project?`,
        initialValue: false,
      });
      if (isCancel(accepted) || !accepted) return { accepted: false, created: false };
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    await mkdir(dirname(destination), { recursive: true });
    await mkdir(destination);
    return { accepted: true, created: true };
  }
  return { accepted: true, created: false };
}

async function replaceProjectName(root: string, projectName: string): Promise<void> {
  async function visit(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(path);
      } else if (entry.isFile()) {
        const content = await readFile(path, "utf8");
        await writeFile(path, content.replaceAll("__PROJECT_NAME__", projectName));
      }
    }
  }
  await visit(root);
}

async function installDependencies(destination: string): Promise<void> {
  await new Promise<void>((resolveInstall, rejectInstall) => {
    const command = process.platform === "win32" ? process.env.ComSpec ?? "cmd.exe" : "npm";
    const args = process.platform === "win32" ? ["/d", "/s", "/c", "npm install"] : ["install"];
    activeInstall = spawn(command, args, {
      cwd: destination,
      stdio: "inherit",
    });
    activeInstall.once("error", rejectInstall);
    activeInstall.once("exit", (code, signal) => {
      activeInstall = undefined;
      if (signal) {
        rejectInstall(new Error(`npm install was interrupted by ${signal}.`));
      } else if (code !== 0) {
        rejectInstall(new Error(`npm install exited with code ${code ?? "unknown"}.`));
      } else {
        resolveInstall();
      }
    });
  });
}

function showSuccess(projectName: string, metadata: PackageMetadata): void {
  const repository = getRepositoryUrl(metadata.repository);
  const documentationUrl =
    process.env.FORGEKIT_DOCS_URL ?? metadata.config?.forgekit?.docsUrl;
  const lines = [
    pc.bold(pc.cyan("FORGEKIT")),
    pc.yellow("BUILD BOLD. SHIP FAST."),
    "",
    "Your next big idea starts here.",
    "",
    `Project: ${projectName}`,
    "Frontend: React + Vite + TypeScript",
    "Backend: Express + TypeScript",
    "Database: MongoDB",
    "",
    `cd ${projectName}`,
    "npm run dev",
    "",
    `npm package: ${metadata.name}`,
    ...(documentationUrl ? [`Documentation: ${documentationUrl}`] : []),
    ...(repository ? [`GitHub: ${repository}`] : []),
    "",
    "Happy building!",
  ];
  console.log(pc.green("\n✔ Project created successfully!\n"));
  console.log(
    boxen(lines.join("\n"), {
      borderColor: "cyan",
      borderStyle: "round",
      padding: 1,
      margin: 0,
    }),
  );
}

async function main(): Promise<void> {
  showBanner();
  const options = parseArgs(process.argv.slice(2));
  const metadata = readMetadata();
  if (options.help) {
    showHelp();
    return;
  }
  if (options.version) {
    console.log(metadata.version);
    return;
  }

  let projectName = options.projectName;
  if (!projectName) {
    if (!process.stdin.isTTY) {
      throw new Error("Provide a project directory in non-interactive mode (for example: create-forgekit my-app).");
    }
    const answer = await text({
      message: "What should your project directory be called?",
      placeholder: "my-forgekit-app",
      defaultValue: "my-forgekit-app",
      validate(value) {
        return isValidProjectName(value) ? undefined : "Enter a valid directory name.";
      },
    });
    if (isCancel(answer)) return;
    projectName = answer.trim();
  }

  if (!isValidProjectName(projectName)) {
    throw new Error("Enter a valid project directory name.");
  }

  const destination = resolve(process.cwd(), projectName);
  const destinationState = await prepareDestination(
    destination,
    Boolean(process.stdin.isTTY),
    options.yes,
  );
  if (!destinationState.accepted) {
    if (process.stdin.isTTY) {
      console.log(pc.yellow("Project generation cancelled."));
    } else {
      console.error(pc.red("The destination already exists. Use an empty directory or choose another name."));
      process.exitCode = 1;
    }
    return;
  }

  try {
    activeDestination = { path: destination, created: destinationState.created };
    await cp(templateRoot, destination, { recursive: true });
    await replaceProjectName(destination, projectName);
  } catch (error) {
    if (destinationState.created) {
      await rm(destination, { recursive: true, force: true });
    }
    activeDestination = undefined;
    throw error;
  }
  if (interrupted) {
    if (destinationState.created) {
      await rm(destination, { recursive: true, force: true });
    }
    activeDestination = undefined;
    process.exitCode = 130;
    return;
  }
  activeDestination = undefined;

  let shouldInstall = options.install;
  if (shouldInstall === undefined && options.yes) shouldInstall = true;
  if (shouldInstall === undefined && process.stdin.isTTY) {
    const answer = await confirm({
      message: "Install project dependencies now?",
      initialValue: true,
    });
    shouldInstall = !isCancel(answer) && answer;
  }
  shouldInstall ??= false;

  if (shouldInstall) {
    activeSpinner = process.stdout.isTTY ? ora("Installing project dependencies...").start() : undefined;
    try {
      await installDependencies(destination);
      activeSpinner?.succeed("Dependencies installed.");
    } catch (error) {
      activeSpinner?.fail("Dependency installation failed.");
      if (interrupted) {
        process.exitCode = 130;
        return;
      }
      const message = error instanceof Error ? error.message : String(error);
      console.error(pc.red(`${message}\nThe project was generated. Run "npm install" from ${destination} to retry.`));
      process.exitCode = 1;
      return;
    } finally {
      activeSpinner = undefined;
    }
  } else {
    console.log(pc.dim("Skipped dependency installation. Run npm install in your project directory to continue."));
  }

  showSuccess(projectName, metadata);
}

process.once("SIGINT", () => {
  interrupted = true;
  activeSpinner?.stop();
  activeInstall?.kill("SIGINT");
  console.log(pc.yellow("\nCancelled."));
  if (!activeInstall && !activeDestination) process.exitCode = 130;
});

try {
  await main();
} catch (error) {
  if (interrupted) {
    process.exitCode = 130;
  } else {
    const message = error instanceof Error ? error.message : String(error);
    console.error(pc.red(`\nError: ${message}`));
    process.exitCode = 1;
  }
}
