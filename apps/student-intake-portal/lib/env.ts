import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The studio keeps one .env.local at the repo root rather than one per app, so Next's
 * built-in loading (which only looks at the app folder) does not find it. This reads
 * the root file once, into process.env, without ever logging a value.
 */

let loaded = false;

function load(): void {
  if (loaded) return;
  loaded = true;

  const path = join(process.cwd(), "..", "..", ".env.local");
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return; // absent is fine; required_env below produces the friendly error
  }

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

export class SetupError extends Error {}

export function required_env(name: string): string {
  load();
  const value = process.env[name];
  if (!value) {
    throw new SetupError(
      `${name} is not set. Add it to .env.local at the top of the studio folder.`
    );
  }
  return value;
}

export function optional_env(name: string, fallback: string): string {
  load();
  return process.env[name] || fallback;
}
