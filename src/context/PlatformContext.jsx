import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updateProfile as updateFirebaseProfile,
  verifyPasswordResetCode,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
  updateDoc,
} from "firebase/firestore";
import { productCatalog } from "../data/platformData";
import { firebaseAuth, firebaseDb, firebaseEnabled } from "../lib/firebase";

const STORAGE_KEYS = {
  theme: "vbm-theme",
};

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80";

const PlatformContext = createContext(null);

function readTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
  } catch {
    // Ignore storage issues and fall back to the system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry) => typeof entry === "string" && entry.trim());
}

function normalizeProgressMap(value) {
  return isRecord(value) ? value : {};
}

function normalizeNumber(value, fallback = 0) {
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function normalizeBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function getClaimRole(claims) {
  if (claims?.role === "admin" || claims?.admin === true) {
    return "admin";
  }

  return "student";
}

function getFirestoreUserRef(userId) {
  return doc(firebaseDb, "users", userId);
}

function getFirestoreProductRef(productId) {
  return doc(firebaseDb, "products", productId);
}

function normalizeUserDoc(userId, data = {}) {
  return {
    id: userId,
    name: normalizeString(data.name, normalizeString(data.email, "Usuario").split("@")[0] || "Usuario"),
    email: normalizeString(data.email),
    avatar: normalizeString(data.avatar, DEFAULT_AVATAR),
    role: getClaimRole(data),
    favorites: normalizeArray(data.favorites),
    history: normalizeArray(data.history),
    progress: normalizeProgressMap(data.progress),
    entitlements: normalizeArray(data.entitlements),
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
}

function normalizeProductDoc(productId, data = {}, fallback = {}) {
  return {
    id: productId,
    slug: normalizeString(data.slug, fallback.slug || productId),
    title: normalizeString(data.title, fallback.title || productId),
    type: normalizeString(data.type, fallback.type || "pack"),
    category: normalizeString(data.category, fallback.category || "packs"),
    access: normalizeString(data.access, fallback.access || "owned"),
    badge: normalizeString(data.badge, fallback.badge || "Nuevo"),
    featured: normalizeBoolean(data.featured, fallback.featured || false),
    locked: normalizeBoolean(data.locked, fallback.locked || false),
    archived: normalizeBoolean(data.archived, fallback.archived || false),
    duration: normalizeString(data.duration, fallback.duration || ""),
    itemCount: normalizeNumber(data.itemCount, normalizeNumber(fallback.itemCount, 0)),
    lessonsCount: normalizeNumber(data.lessonsCount, normalizeNumber(fallback.lessonsCount, 0)),
    author: normalizeString(data.author, fallback.author || "VBM Devs"),
    description: normalizeString(data.description, fallback.description || ""),
    cover: normalizeString(data.cover, fallback.cover || ""),
    tags: Array.isArray(data.tags) ? normalizeArray(data.tags) : normalizeArray(fallback.tags),
    progress: normalizeNumber(data.progress, normalizeNumber(fallback.progress, 0)),
    rating: normalizeNumber(data.rating, normalizeNumber(fallback.rating, 0)),
    modules: Array.isArray(data.modules) ? data.modules : Array.isArray(fallback.modules) ? fallback.modules : [],
    sortOrder: normalizeNumber(data.sortOrder, normalizeNumber(fallback.sortOrder, 0)),
    createdAt: data.createdAt || fallback.createdAt || null,
    updatedAt: data.updatedAt || fallback.updatedAt || null,
  };
}

function buildProductDocPayload(product, fallback = {}) {
  const normalized = normalizeProductDoc(product.id, product, fallback);

  return {
    ...normalized,
    updatedAt: serverTimestamp(),
    createdAt: normalized.createdAt || serverTimestamp(),
  };
}

function mergeProducts(baseProducts, overrides) {
  const baseIndex = baseProducts.reduce((acc, product, index) => {
    acc[product.id] = { ...product, sortOrder: index };
    return acc;
  }, {});

  const merged = baseProducts.map((product, index) =>
    normalizeProductDoc(product.id, overrides[product.id] || {}, baseIndex[product.id] || { ...product, sortOrder: index }),
  );

  Object.entries(overrides).forEach(([productId, override]) => {
    if (!baseIndex[productId]) {
      merged.push(normalizeProductDoc(productId, override, override));
    }
  });

  return merged.sort((a, b) => {
    const sortDelta = normalizeNumber(a.sortOrder, 0) - normalizeNumber(b.sortOrder, 0);
    if (sortDelta !== 0) {
      return sortDelta;
    }
    return a.title.localeCompare(b.title, "es");
  });
}

function buildUserDocPayload(authUser, claims, patch = {}) {
  const baseEmail = normalizeString(authUser.email).toLowerCase();
  const baseName = normalizeString(authUser.displayName, baseEmail.split("@")[0] || "Usuario");

  return {
    name: normalizeString(patch.name, baseName),
    email: normalizeString(patch.email, baseEmail),
    avatar: normalizeString(patch.avatar, authUser.photoURL || DEFAULT_AVATAR),
    role: getClaimRole(claims),
    favorites: Array.isArray(patch.favorites) ? patch.favorites : [],
    history: Array.isArray(patch.history) ? patch.history : [],
    progress: isRecord(patch.progress) ? patch.progress : {},
    entitlements: Array.isArray(patch.entitlements) ? patch.entitlements : [],
    createdAt: patch.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

async function ensureUserDocument(authUser, claims) {
  if (!firebaseDb) {
    return;
  }

  const ref = getFirestoreUserRef(authUser.uid);
  const snap = await getDoc(ref);
  const desiredRole = getClaimRole(claims);

  if (!snap.exists()) {
    await setDoc(ref, buildUserDocPayload(authUser, claims));
    return;
  }

  const current = normalizeUserDoc(authUser.uid, snap.data());
  const updates = {};

  if (!current.name) {
    updates.name = buildUserDocPayload(authUser, claims).name;
  }

  if (!current.email) {
    updates.email = buildUserDocPayload(authUser, claims).email;
  }

  if (!current.avatar) {
    updates.avatar = buildUserDocPayload(authUser, claims).avatar;
  }

  if (current.role !== desiredRole) {
    updates.role = desiredRole;
  }

  if (!Array.isArray(snap.data()?.favorites)) {
    updates.favorites = [];
  }

  if (!Array.isArray(snap.data()?.history)) {
    updates.history = [];
  }

  if (!isRecord(snap.data()?.progress)) {
    updates.progress = {};
  }

  if (!Array.isArray(snap.data()?.entitlements)) {
    updates.entitlements = [];
  }

  if (Object.keys(updates).length > 0) {
    updates.updatedAt = serverTimestamp();
    await updateDoc(ref, updates);
  }
}

function updateUserDoc(userId, patch) {
  if (!firebaseDb) {
    return Promise.resolve();
  }

  return setDoc(
    getFirestoreUserRef(userId),
    {
      ...patch,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

function readProductAccess(products, currentUserId, currentEntitlements, product) {
  if (!currentUserId) {
    return false;
  }

  if (product.access !== "locked") {
    return true;
  }

  const granted = currentEntitlements[currentUserId] || [];
  return granted.includes(product.id);
}

export function PlatformProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);
  const [productOverrides, setProductOverrides] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [currentProfileDoc, setCurrentProfileDoc] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firebaseClaims, setFirebaseClaims] = useState(null);
  const [authReady, setAuthReady] = useState(!firebaseEnabled);
  const seedingProductsRef = useRef(false);
  const currentRole = getClaimRole(firebaseClaims);
  const products = useMemo(() => mergeProducts(productCatalog, productOverrides), [productOverrides]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Keep the in-memory theme active when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    if (!firebaseEnabled || !firebaseAuth) {
      setAuthReady(true);
      return undefined;
    }

    let cancelled = false;

    const unsubscribe = onIdTokenChanged(firebaseAuth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setFirebaseClaims(null);
        setAuthReady(true);
        return;
      }

      try {
        const tokenResult = await getIdTokenResult(user);
        if (cancelled) {
          return;
        }

        setFirebaseClaims(tokenResult.claims || {});
        await ensureUserDocument(user, tokenResult.claims || {});
      } catch (error) {
        if (!cancelled) {
          console.error("Firebase auth sync failed:", error);
          setFirebaseClaims({});
        }
      } finally {
        if (!cancelled) {
          setAuthReady(true);
        }
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!firebaseEnabled || !firebaseDb || !firebaseUser) {
      setCurrentProfileDoc(null);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      getFirestoreUserRef(firebaseUser.uid),
      (snapshot) => {
        if (!snapshot.exists()) {
          setCurrentProfileDoc(null);
          return;
        }

        setCurrentProfileDoc(normalizeUserDoc(snapshot.id, snapshot.data()));
      },
      (error) => {
        console.error("Firestore current profile snapshot failed:", error);
        setCurrentProfileDoc(null);
      },
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  useEffect(() => {
    if (!firebaseEnabled || !firebaseDb) {
      setProductOverrides({});
      seedingProductsRef.current = false;
      setProfiles([]);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(firebaseDb, "products"),
      (snapshot) => {
        const nextOverrides = {};
        snapshot.docs.forEach((entry) => {
          nextOverrides[entry.id] = normalizeProductDoc(entry.id, entry.data());
        });
        setProductOverrides(nextOverrides);

        if (currentRole !== "admin" || seedingProductsRef.current) {
          return;
        }

        const missingProducts = productCatalog.filter((product) => !snapshot.docs.some((entry) => entry.id === product.id));
        if (missingProducts.length === 0) {
          return;
        }

        seedingProductsRef.current = true;

        void (async () => {
          try {
            const batch = writeBatch(firebaseDb);
            missingProducts.forEach((product, index) => {
              const seedProduct = { ...product, sortOrder: index };
              batch.set(
                getFirestoreProductRef(product.id),
                buildProductDocPayload(seedProduct, seedProduct),
                { merge: true },
              );
            });

            await batch.commit();
          } catch (error) {
            console.error("Firestore product seed failed:", error);
          } finally {
            seedingProductsRef.current = false;
          }
        })();
      },
      (error) => {
        console.error("Firestore products snapshot failed:", error);
        setProductOverrides({});
      },
    );

    return () => unsubscribe();
  }, [currentRole, firebaseDb, firebaseEnabled]);

  useEffect(() => {
    if (!firebaseEnabled || !firebaseDb) {
      return undefined;
    }

    if (currentRole !== "admin") {
      setProfiles(currentProfileDoc ? [currentProfileDoc] : []);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(firebaseDb, "users"),
      (snapshot) => {
        const nextProfiles = snapshot.docs
          .map((entry) => normalizeUserDoc(entry.id, entry.data()))
          .sort((a, b) => {
            const aLabel = a.name || a.email || a.id;
            const bLabel = b.name || b.email || b.id;
            return aLabel.localeCompare(bLabel, "es");
          });

        setProfiles(nextProfiles);
      },
      (error) => {
        console.error("Firestore user snapshot failed:", error);
        setProfiles([]);
      },
    );

    return () => unsubscribe();
  }, [currentProfileDoc, currentRole, firebaseDb, firebaseEnabled]);

  const currentUser = useMemo(() => {
    if (!firebaseUser) {
      return null;
    }

    const email = normalizeString(currentProfileDoc?.email, normalizeString(firebaseUser.email));
    const name =
      normalizeString(currentProfileDoc?.name) ||
      normalizeString(firebaseUser.displayName) ||
      (email ? email.split("@")[0] : "Usuario");

    return {
      id: firebaseUser.uid,
      name,
      email,
      role: currentRole,
      avatar: normalizeString(currentProfileDoc?.avatar, firebaseUser.photoURL || DEFAULT_AVATAR),
    };
  }, [currentProfileDoc, currentRole, firebaseUser]);

  const users = useMemo(
    () =>
      profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        role: profile.role,
      })),
    [profiles],
  );

  const entitlements = useMemo(() => {
    return profiles.reduce((acc, profile) => {
      acc[profile.id] = profile.entitlements || [];
      return acc;
    }, {});
  }, [profiles]);

  const progress = useMemo(() => {
    return profiles.reduce((acc, profile) => {
      acc[profile.id] = profile.progress || {};
      return acc;
    }, {});
  }, [profiles]);

  const favorites = useMemo(() => {
    return profiles.reduce((acc, profile) => {
      acc[profile.id] = profile.favorites || [];
      return acc;
    }, {});
  }, [profiles]);

  const history = useMemo(() => {
    return profiles.reduce((acc, profile) => {
      acc[profile.id] = profile.history || [];
      return acc;
    }, {});
  }, [profiles]);

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.role === "admin";

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });
      return;
    }

    setTheme(nextTheme);
  };

  const syncAuthenticatedUser = async (user) => {
    if (!firebaseEnabled || !firebaseAuth || !user) {
      throw new Error("Firebase authentication is not configured.");
    }

    const tokenResult = await getIdTokenResult(user);
    setFirebaseUser(user);
    setFirebaseClaims(tokenResult.claims || {});
    await ensureUserDocument(user, tokenResult.claims || {});
    setAuthReady(true);
    return user;
  };

  const login = async ({ email, password }) => {
    if (!firebaseEnabled || !firebaseAuth) {
      throw new Error("Firebase authentication is not configured.");
    }

    const result = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    return syncAuthenticatedUser(result.user);
  };

  const logout = async () => {
    if (!firebaseEnabled || !firebaseAuth) {
      throw new Error("Firebase authentication is not configured.");
    }

    await signOut(firebaseAuth);
    setFirebaseUser(null);
    setFirebaseClaims(null);
    setAuthReady(true);
  };

  const register = async ({ name, email, password }) => {
    if (!firebaseEnabled || !firebaseAuth) {
      throw new Error("Firebase authentication is not configured.");
    }

    const result = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
    await updateFirebaseProfile(result.user, { displayName: name.trim() });
    return syncAuthenticatedUser(firebaseAuth.currentUser || result.user);
  };

  const requestPasswordReset = async (email) => {
    if (!firebaseEnabled || !firebaseAuth) {
      throw new Error("Firebase authentication is not configured.");
    }

    await sendPasswordResetEmail(firebaseAuth, email.trim(), {
      url: `${window.location.origin}/reset-password`,
    });

    return { email: email.trim(), firebase: true };
  };

  const verifyResetEmail = async (oobCode) => {
    if (!firebaseEnabled || !firebaseAuth) {
      throw new Error("Firebase authentication is not configured.");
    }

    return verifyPasswordResetCode(firebaseAuth, oobCode);
  };

  const resetPassword = async ({ oobCode, password }) => {
    if (!firebaseEnabled || !firebaseAuth) {
      throw new Error("Firebase authentication is not configured.");
    }

    if (!oobCode) {
      throw new Error("Missing password reset code.");
    }

    await confirmPasswordReset(firebaseAuth, oobCode, password);
    return true;
  };

  const updateProfile = async (patch) => {
    if (!firebaseAuth?.currentUser || !currentUser) {
      throw new Error("Not authenticated.");
    }

    const nextName = normalizeString(patch.name, currentUser.name);
    const nextEmail = normalizeString(patch.email, currentUser.email).toLowerCase();
    const nextAvatar = normalizeString(patch.avatar, currentUser.avatar);

    const tasks = [];

    if (nextName && nextName !== firebaseAuth.currentUser.displayName) {
      tasks.push(updateFirebaseProfile(firebaseAuth.currentUser, { displayName: nextName }));
    }

    if (nextEmail && nextEmail !== firebaseAuth.currentUser.email) {
      tasks.push(updateEmail(firebaseAuth.currentUser, nextEmail));
    }

    await Promise.all(tasks);
    await updateUserDoc(currentUser.id, {
      name: nextName,
      email: nextEmail,
      avatar: nextAvatar,
    });

    return true;
  };

  const grantAccess = async (userId, productId) => {
    const currentAccess = entitlements[userId] || [];
    const nextAccess = Array.from(new Set([...currentAccess, productId]));
    await updateUserDoc(userId, { entitlements: nextAccess });
  };

  const revokeAccess = async (userId, productId) => {
    const currentAccess = entitlements[userId] || [];
    const nextAccess = currentAccess.filter((entry) => entry !== productId);
    await updateUserDoc(userId, { entitlements: nextAccess });
  };

  const upsertProduct = (product) => {
    const fallback = products.find((entry) => entry.id === product.id) || {};
    const nextProduct = normalizeProductDoc(product.id, product, fallback);

    setProductOverrides((current) => ({
      ...current,
      [product.id]: nextProduct,
    }));

    if (!firebaseDb) {
      return;
    }

    return setDoc(
      getFirestoreProductRef(product.id),
      buildProductDocPayload(nextProduct, fallback),
      { merge: true },
    );
  };

  const archiveProduct = (productId) => {
    const currentProduct = products.find((entry) => entry.id === productId);
    const nextProduct = normalizeProductDoc(productId, { archived: true }, currentProduct || {});

    setProductOverrides((current) => ({
      ...current,
      [productId]: nextProduct,
    }));

    if (!firebaseDb) {
      return;
    }

    return setDoc(
      getFirestoreProductRef(productId),
      {
        archived: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const trackProductVisit = async (productId) => {
    if (!currentUser) {
      return;
    }

    const currentHistory = history[currentUser.id] || [];
    const nextHistory = [productId, ...currentHistory.filter((entry) => entry !== productId)].slice(0, 12);
    await updateUserDoc(currentUser.id, { history: nextHistory });
  };

  const toggleFavorite = async (productId) => {
    if (!currentUser) {
      return;
    }

    const currentFavorites = favorites[currentUser.id] || [];
    const isFavorited = currentFavorites.includes(productId);
    const nextFavorites = isFavorited
      ? currentFavorites.filter((entry) => entry !== productId)
      : [...currentFavorites, productId];

    await updateUserDoc(currentUser.id, { favorites: nextFavorites });
  };

  const setLessonProgress = async ({ productId, lessonId, progressValue, completed }) => {
    if (!currentUser) {
      throw new Error("Not authenticated.");
    }

    const currentBucket = progress[currentUser.id] || {};
    const previous = currentBucket[productId] || {
      progress: 0,
      lastLessonId: null,
      completedLessonIds: [],
      lastAccessedAt: null,
      videoPosition: 0,
    };

    const completedLessonIds = new Set(previous.completedLessonIds || []);
    if (completed) {
      completedLessonIds.add(lessonId);
    }

    const nextProgress = {
      ...currentBucket,
      [productId]: {
        ...previous,
        progress: typeof progressValue === "number" ? progressValue : previous.progress,
        lastLessonId: lessonId || previous.lastLessonId,
        completedLessonIds: Array.from(completedLessonIds),
        lastAccessedAt: new Date().toISOString(),
      },
    };

    await updateUserDoc(currentUser.id, { progress: nextProgress });
  };

  const canAccessProduct = (product) => readProductAccess(products, currentUser?.id, entitlements, product);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    currentUser,
    isAuthenticated,
    isAdmin,
    users,
    products,
    entitlements,
    progress,
    favorites,
    history,
    authReady,
    firebaseEnabled,
    login,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    verifyResetEmail,
    updateProfile,
    grantAccess,
    revokeAccess,
    upsertProduct,
    archiveProduct,
    toggleFavorite,
    setLessonProgress,
    trackProductVisit,
    canAccessProduct,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const context = useContext(PlatformContext);

  if (!context) {
    throw new Error("usePlatform must be used inside PlatformProvider.");
  }

  return context;
}
