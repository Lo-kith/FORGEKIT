export interface CliOptions {
  projectName?: string;
  install: boolean | undefined;
  yes: boolean;
  help: boolean;
  version: boolean;
}

export function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    install: undefined,
    yes: false,
    help: false,
    version: false,
  };
  const positional: string[] = [];

  for (const arg of args) {
    switch (arg) {
      case "--install":
      case "-i":
        if (options.install === false) {
          throw new Error("--install and --no-install cannot be used together.");
        }
        options.install = true;
        break;
      case "--no-install":
        if (options.install === true) {
          throw new Error("--install and --no-install cannot be used together.");
        }
        options.install = false;
        break;
      case "--yes":
      case "-y":
        options.yes = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      case "--version":
      case "-v":
        options.version = true;
        break;
      default:
        if (arg.startsWith("-")) {
          throw new Error(`Unknown option: ${arg}`);
        }
        positional.push(arg);
    }
  }

  if (positional.length > 1) {
    throw new Error("Please provide only one project directory.");
  }

  options.projectName = positional[0];
  return options;
}
