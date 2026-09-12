import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/** The key drop. One file on this machine, owner-only, never in the repo: show/keys.env, NAME=value per line. */
export const KEYS_PATH = "show/keys.env";
const NAME = /^[A-Z][A-Z0-9_]*$/;

export function readKeys(path = KEYS_PATH): Record<string, string> {
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const i = raw.indexOf("=");
    if (i > 0) out[raw.slice(0, i).trim()] = raw.slice(i + 1).trim();
  }
  return out;
}

/** Set or clear one key. An empty value removes it. */
export function writeKey(name: string, value: string, path = KEYS_PATH): Record<string, string> {
  if (!NAME.test(name)) throw new Error(`key name ${JSON.stringify(name)}: capitals, digits and underscores only`);
  const keys = readKeys(path);
  if (value.trim()) keys[name] = value.trim();
  else delete keys[name];
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, Object.entries(keys).map(([k, v]) => `${k}=${v}\n`).join(""), { mode: 0o600 });
  chmodSync(path, 0o600);
  return keys;
}

/** What the floor may see: which keys exist and their last four characters. Never the key. */
export const maskKeys = (keys: Record<string, string>) =>
  Object.fromEntries(Object.entries(keys).map(([k, v]) => [k, v.length > 4 ? `••••${v.slice(-4)}` : "••••"]));
