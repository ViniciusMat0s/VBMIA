const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80";

function getAdminEmails() {
  const fallback = ["admin@vbmdevs.com"];
  const configValue = functions.config()?.vbm?.admin_emails;
  const envValue = process.env.FIREBASE_ADMIN_EMAILS || configValue;

  if (!envValue) {
    return new Set(fallback);
  }

  return new Set(
    envValue
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
      .concat(fallback),
  );
}

function isAdminEmail(email) {
  if (!email) {
    return false;
  }

  return getAdminEmails().has(email.trim().toLowerCase());
}

function normalizeRole(role) {
  return role === "admin" ? "admin" : "student";
}

exports.bootstrapAdminClaims = functions.auth.user().onCreate(async (user) => {
  if (!isAdminEmail(user.email)) {
    return null;
  }

  await admin.auth().setCustomUserClaims(user.uid, { role: "admin" });

  await admin.firestore().collection("users").doc(user.uid).set(
    {
      name: user.displayName || user.email?.split("@")[0] || "Usuario",
      email: user.email ? user.email.trim().toLowerCase() : "",
      avatar: user.photoURL || DEFAULT_AVATAR,
      role: "admin",
      favorites: [],
      history: [],
      progress: {},
      entitlements: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return null;
});

exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can change user roles.");
  }

  const uid = typeof data.uid === "string" ? data.uid.trim() : "";
  if (!uid) {
    throw new functions.https.HttpsError("invalid-argument", "Missing user id.");
  }

  const role = normalizeRole(data.role);

  await admin.auth().setCustomUserClaims(uid, { role });
  await admin.firestore().collection("users").doc(uid).set(
    {
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { uid, role };
});
