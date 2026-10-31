export function logError(message: string, error: unknown): void {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`${message} ${detail}`);
}
