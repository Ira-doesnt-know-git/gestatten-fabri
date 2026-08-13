import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const plaintextPath = resolve(root, "src/pages/heiratet-joeran.astro");
const encryptedPath = resolve(root, "protected/heiratet-joeran.astro.enc");
const localEnvironmentPath = resolve(root, ".env.protected.local");
const associatedData = Buffer.from("gestatten-fabri:heiratet-joeran:v1");

function sourceKey() {
  const encoded = process.env.PROTECTED_SOURCE_KEY?.trim();

  if (!encoded) {
    throw new Error("PROTECTED_SOURCE_KEY is required.");
  }

  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32 || key.toString("base64") !== encoded) {
    throw new Error("PROTECTED_SOURCE_KEY must be a canonical base64-encoded 32-byte key.");
  }

  return key;
}

async function encryptSource() {
  const plaintext = await readFile(plaintextPath);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", sourceKey(), iv);
  cipher.setAAD(associatedData);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  const envelope = {
    version: 1,
    algorithm: "aes-256-gcm",
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };

  await mkdir(dirname(encryptedPath), { recursive: true });
  await writeFile(encryptedPath, `${JSON.stringify(envelope)}\n`, { mode: 0o600 });
  console.log("Encrypted protected page source.");
}

function validateEnvelope(envelope) {
  if (
    envelope?.version !== 1 ||
    envelope?.algorithm !== "aes-256-gcm" ||
    typeof envelope.iv !== "string" ||
    typeof envelope.authTag !== "string" ||
    typeof envelope.ciphertext !== "string" ||
    Buffer.from(envelope.iv, "base64").length !== 12 ||
    Buffer.from(envelope.authTag, "base64").length !== 16 ||
    Buffer.from(envelope.ciphertext, "base64").length === 0
  ) {
    throw new Error("The encrypted protected-page source is invalid.");
  }
}

async function readEnvelope() {
  const envelope = JSON.parse(await readFile(encryptedPath, "utf8"));
  validateEnvelope(envelope);
  return envelope;
}

async function decryptSource() {
  const envelope = await readEnvelope();
  const decipher = createDecipheriv(
    "aes-256-gcm",
    sourceKey(),
    Buffer.from(envelope.iv, "base64"),
  );
  decipher.setAAD(associatedData);
  decipher.setAuthTag(Buffer.from(envelope.authTag, "base64"));

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(envelope.ciphertext, "base64")),
    decipher.final(),
  ]);

  await mkdir(dirname(plaintextPath), { recursive: true });
  await writeFile(plaintextPath, plaintext, { mode: 0o600 });
  console.log("Decrypted protected page source.");
}

async function validateEncryptedSource() {
  await readEnvelope();
  console.log("Encrypted protected page source is structurally valid.");
}

async function initializeLocalEnvironment() {
  const password = process.env.STATICRYPT_PASSWORD;
  if (!password) {
    throw new Error("Set STATICRYPT_PASSWORD when initializing the local environment.");
  }

  const contents = [
    `PROTECTED_SOURCE_KEY=${randomBytes(32).toString("base64")}`,
    `STATICRYPT_PASSWORD=${password}`,
    "",
  ].join("\n");

  await writeFile(localEnvironmentPath, contents, { flag: "wx", mode: 0o600 });
  console.log("Created .env.protected.local.");
}

const commands = {
  "decrypt-source": decryptSource,
  "encrypt-source": encryptSource,
  "init-local": initializeLocalEnvironment,
  validate: validateEncryptedSource,
};

const command = process.argv[2];
if (!(command in commands)) {
  throw new Error(`Unknown command: ${command ?? "(missing)"}`);
}

await commands[command]();
