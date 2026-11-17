const DEFAULT_DEMO_PASSWORD = "Campiko@123";
const STORAGE_PREFIX = "askCampiko.demoCredential.";
const HASH_ITERATIONS = 150000;

function getStorageKey(accountId) {
  return `${STORAGE_PREFIX}${accountId}`;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(value) {
  if (!/^(?:[0-9a-f]{2})+$/i.test(value)) {
    throw new Error("Saved demo credential is invalid.");
  }

  return Uint8Array.from(
    value.match(/.{2}/g),
    (byte) => Number.parseInt(byte, 16)
  );
}

async function deriveHash(password, salt) {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.subtle) {
    throw new Error("Secure password hashing is unavailable in this browser.");
  }

  const key = await cryptoApi.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await cryptoApi.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: HASH_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256
  );

  return new Uint8Array(hash);
}

function readCredential(accountId) {
  const serialized = window.localStorage.getItem(getStorageKey(accountId));
  if (!serialized) {
    return null;
  }

  const credential = JSON.parse(serialized);
  if (
    typeof credential?.salt !== "string" ||
    typeof credential?.hash !== "string"
  ) {
    throw new Error("Saved demo credential is invalid.");
  }

  return {
    salt: hexToBytes(credential.salt),
    hash: hexToBytes(credential.hash),
  };
}

export async function verifyDemoPassword(accountId, password) {
  const credential = readCredential(accountId);
  if (!credential) {
    return password === DEFAULT_DEMO_PASSWORD;
  }

  const candidateHash = await deriveHash(password, credential.salt);
  return bytesToHex(candidateHash) === bytesToHex(credential.hash);
}

export async function changeDemoPassword(accountId, currentPassword, nextPassword) {
  if (!(await verifyDemoPassword(accountId, currentPassword))) {
    return false;
  }

  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) {
    throw new Error("Secure password storage is unavailable in this browser.");
  }

  const salt = cryptoApi.getRandomValues(new Uint8Array(16));
  const hash = await deriveHash(nextPassword, salt);
  window.localStorage.setItem(
    getStorageKey(accountId),
    JSON.stringify({
      salt: bytesToHex(salt),
      hash: bytesToHex(hash),
    })
  );

  return true;
}
