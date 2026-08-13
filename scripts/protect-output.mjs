import { spawnSync } from "node:child_process";
import { mkdir, readFile, rename, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const inputPath = resolve(root, "dist/heiratet-joeran/index.html");
const temporaryDirectory = resolve(root, "dist/.protected-output");
const encryptedPath = resolve(temporaryDirectory, "index.html");
const staticryptBinary = resolve(root, "node_modules/.bin/staticrypt");

if (!process.env.STATICRYPT_PASSWORD) {
  throw new Error("STATICRYPT_PASSWORD is required.");
}

await rm(temporaryDirectory, { recursive: true, force: true });
await mkdir(temporaryDirectory, { recursive: true });

const result = spawnSync(
  staticryptBinary,
  [
    inputPath,
    "--directory",
    temporaryDirectory,
    "--config",
    "false",
    "--short",
    "--remember",
    "30",
    "--template-title",
    "Hochzeit am Meer",
    "--template-instructions",
    "Dieser Inhalt ist passwortgeschützt.",
    "--template-button",
    "Anzeigen",
    "--template-placeholder",
    "Passwort",
    "--template-error",
    "Falsches Passwort.",
    "--template-remember",
    "Passwort merken",
    "--template-toggle-show",
    "Passwort anzeigen",
    "--template-toggle-hide",
    "Passwort ausblenden",
    "--template-color-primary",
    "#9dff20",
    "--template-color-secondary",
    "#ffffff",
  ],
  { env: process.env, encoding: "utf8" },
);

if (result.status !== 0) {
  throw new Error(result.stderr || result.stdout || "StatiCrypt failed.");
}

const encryptedHtml = await readFile(encryptedPath, "utf8");
if (!encryptedHtml.includes("staticrypt") || encryptedHtml.includes("wp-site-blocks")) {
  throw new Error("Protected output validation failed.");
}

await rename(encryptedPath, inputPath);
await rm(temporaryDirectory, { recursive: true, force: true });
console.log("Encrypted protected page output.");
