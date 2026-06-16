const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

function printUsage() {
  console.log([
    "Usage:",
    "  npm run admin:set -- user@email.com",
    "  npm run admin:set -- user@email.com student",
    "  npm run admin:set -- user@email.com admin --key path/to/serviceAccountKey.json",
    "",
    "Notes:",
    "  - The first argument can be an email address or a Firebase Auth UID.",
    "  - If you pass --key, it must point to a Firebase service account JSON file.",
    "  - Alternatively, set GOOGLE_APPLICATION_CREDENTIALS before running the script.",
  ].join("\n"));
}

function parseArgs(argv) {
  const args = [...argv];
  const target = args[0];
  const roleArg = args[1];
  let keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "";

  const keyIndex = args.indexOf("--key");
  if (keyIndex >= 0 && args[keyIndex + 1]) {
    keyPath = path.resolve(process.cwd(), args[keyIndex + 1]);
  }

  return {
    target: target ? target.trim() : "",
    role: roleArg === "student" ? "student" : "admin",
    keyPath,
  };
}

function findDefaultKeyPath() {
  const candidates = [
    path.resolve(process.cwd(), "serviceAccountKey.json"),
    path.resolve(process.cwd(), "functions", "serviceAccountKey.json"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

async function resolveUser(identifier) {
  if (identifier.includes("@")) {
    try {
      return await admin.auth().getUserByEmail(identifier);
    } catch (error) {
      if (error?.code !== "auth/user-not-found") {
        throw error;
      }
      throw new Error(`No Firebase Auth user found for email: ${identifier}`);
    }
  }

  return admin.auth().getUser(identifier);
}

async function main() {
  const { target, role, keyPath } = parseArgs(process.argv.slice(2));

  if (!target) {
    printUsage();
    process.exit(1);
  }

  if (keyPath) {
    const resolvedKeyPath = path.resolve(keyPath);
    if (!fs.existsSync(resolvedKeyPath)) {
      throw new Error(`Service account file not found: ${resolvedKeyPath}`);
    }

    process.env.GOOGLE_APPLICATION_CREDENTIALS = resolvedKeyPath;
  } else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const defaultKeyPath = findDefaultKeyPath();
    if (defaultKeyPath) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = defaultKeyPath;
    }
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      "Missing service account credentials. Add GOOGLE_APPLICATION_CREDENTIALS or pass --key path/to/serviceAccountKey.json.",
    );
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  const user = await resolveUser(target);
  const nextRole = role === "admin" ? "admin" : "student";

  await admin.auth().setCustomUserClaims(user.uid, { role: nextRole });
  await admin.firestore().collection("users").doc(user.uid).set(
    {
      name: user.displayName || user.email?.split("@")[0] || "Usuario",
      email: user.email ? user.email.trim().toLowerCase() : "",
      avatar:
        user.photoURL ||
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
      role: nextRole,
      favorites: [],
      history: [],
      progress: {},
      entitlements: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`Updated role to "${nextRole}" for ${user.email || user.uid} (${user.uid})`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
