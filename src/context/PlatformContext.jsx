import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updateProfile as updateFirebaseProfile,
  verifyPasswordResetCode,
} from "firebase/auth";
import { demoCredentials, seedUsers, productCatalog } from "../data/platformData";
import { firebaseAuth, firebaseEnabled } from "../lib/firebase";

const STORAGE_KEYS = {
  theme: "vbm-theme",
  users: "vbm-users",
  session: "vbm-session",
  products: "vbm-products",
  entitlements: "vbm-entitlements",
  progress: "vbm-progress",
  favorites: "vbm-favorites",
  history: "vbm-history",
  resetTokens: "vbm-reset-tokens",
};

const PlatformContext = createContext(null);

function readJSON(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function createDefaultEntitlements(users = seedUsers, products = productCatalog) {
  const fallbackProductIds = products.filter((product) => product.access !== "locked").map((product) => product.id);

  return users.reduce((acc, user) => {
    acc[user.id] = user.role === "admin" ? products.map((product) => product.id) : fallbackProductIds.slice(0, 4);
    return acc;
  }, {});
}

function createDefaultProgress(users = seedUsers) {
  return users.reduce((acc, user) => {
    acc[user.id] = {};
    return acc;
  }, {});
}

function createDefaultFavorites(users = seedUsers) {
  return users.reduce((acc, user) => {
    acc[user.id] = [];
    return acc;
  }, {});
}

function createDefaultHistory(users = seedUsers) {
  return users.reduce((acc, user) => {
    acc[user.id] = [];
    return acc;
  }, {});
}

function createDefaultResetTokens() {
  return {};
}

function getAdminEmails() {
  const fallback = ["admin@vbmdevs.com"];
  const envValue = import.meta.env.VITE_FIREBASE_ADMIN_EMAILS;

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

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80";

function isAdminEmail(email) {
  if (!email) {
    return false;
  }

  return getAdminEmails().has(email.trim().toLowerCase());
}

function getSeedUserByEmail(email) {
  if (!email) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  return seedUsers.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
}

function createProfileFromAuthUser(authUser) {
  const seedUser = getSeedUserByEmail(authUser.email);
  const email = authUser.email || seedUser?.email || "";

  return {
    id: authUser.uid,
    name: authUser.displayName || seedUser?.name || email.split("@")[0] || "Usuario",
    email,
    role: seedUser?.role || (isAdminEmail(email) ? "admin" : "student"),
    avatar: authUser.photoURL || seedUser?.avatar || DEFAULT_AVATAR,
  };
}

function mergeProfileLists(current, profile) {
  const next = current.filter((entry) => entry.id !== profile.id);
  next.push(profile);
  return next;
}

function getSeedUsers() {
  return seedUsers;
}

function getSeedProducts() {
  return productCatalog;
}

export function PlatformProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const storedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [users, setUsers] = useState(() => readJSON(STORAGE_KEYS.users, getSeedUsers()));
  const [session, setSession] = useState(() => readJSON(STORAGE_KEYS.session, { userId: null }));
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authReady, setAuthReady] = useState(!firebaseEnabled);
  const [products, setProducts] = useState(() => readJSON(STORAGE_KEYS.products, getSeedProducts()));
  const [entitlements, setEntitlements] = useState(() =>
    readJSON(STORAGE_KEYS.entitlements, createDefaultEntitlements())
  );
  const [progress, setProgress] = useState(() => readJSON(STORAGE_KEYS.progress, createDefaultProgress()));
  const [favorites, setFavorites] = useState(() => readJSON(STORAGE_KEYS.favorites, createDefaultFavorites()));
  const [history, setHistory] = useState(() => readJSON(STORAGE_KEYS.history, createDefaultHistory()));
  const [resetTokens, setResetTokens] = useState(() => readJSON(STORAGE_KEYS.resetTokens, createDefaultResetTokens()));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.users, users);
  }, [users]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.session, session);
  }, [session]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.products, products);
  }, [products]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.entitlements, entitlements);
  }, [entitlements]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.progress, progress);
  }, [progress]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.history, history);
  }, [history]);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.resetTokens, resetTokens);
  }, [resetTokens]);

  useEffect(() => {
    if (!firebaseEnabled || !firebaseAuth) {
      setAuthReady(true);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseUser(user);
      setAuthReady(true);

      if (!user) {
        return;
      }

      const profile = createProfileFromAuthUser(user);
      setUsers((current) => mergeProfileLists(current, profile));
      setEntitlements((current) => {
        if (current[profile.id]) {
          return current;
        }

        const fallbackProductIds = products.filter((product) => product.access !== "locked").map((product) => product.id);
        return {
          ...current,
          [profile.id]: profile.role === "admin" ? products.map((product) => product.id) : fallbackProductIds.slice(0, 4),
        };
      });
      setProgress((current) => (current[profile.id] ? current : { ...current, [profile.id]: {} }));
      setFavorites((current) => (current[profile.id] ? current : { ...current, [profile.id]: [] }));
      setHistory((current) => (current[profile.id] ? current : { ...current, [profile.id]: [] }));
    });

    return () => unsubscribe();
  }, [products]);

  const currentUser = useMemo(() => {
    if (firebaseEnabled && firebaseUser) {
      const firebaseProfile = users.find((user) => user.id === firebaseUser.uid);
      const seedUser = getSeedUserByEmail(firebaseUser.email);
      return (
        firebaseProfile || {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || seedUser?.name || firebaseUser.email?.split("@")[0] || "Usuario",
          email: firebaseUser.email || seedUser?.email || "",
          role: seedUser?.role || (isAdminEmail(firebaseUser.email) ? "admin" : "student"),
          avatar: firebaseUser.photoURL || seedUser?.avatar || DEFAULT_AVATAR,
        }
      );
    }

    if (firebaseEnabled) {
      return null;
    }

    return users.find((user) => user.id === session.userId) || null;
  }, [firebaseUser, session.userId, users]);

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

  const login = async ({ email, password }) => {
    if (firebaseEnabled && firebaseAuth) {
      const result = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      return result.user;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(
      (entry) => entry.email.toLowerCase() === normalizedEmail && entry.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    setSession({ userId: user.id });
    return user;
  };

  const logout = async () => {
    if (firebaseEnabled && firebaseAuth) {
      await signOut(firebaseAuth);
      setSession({ userId: null });
      return;
    }

    setSession({ userId: null });
  };

  const register = async ({ name, email, password }) => {
    if (firebaseEnabled && firebaseAuth) {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      await updateFirebaseProfile(result.user, { displayName: name.trim() });

      const profile = {
        ...createProfileFromAuthUser({
          ...result.user,
          displayName: name.trim(),
        }),
        id: result.user.uid,
        name: name.trim(),
        email: result.user.email || email.trim().toLowerCase(),
        avatar: DEFAULT_AVATAR,
      };

      setUsers((current) => mergeProfileLists(current, profile));
      setEntitlements((current) => {
        if (current[profile.id]) {
          return current;
        }

        const fallbackProductIds = products.filter((product) => product.access !== "locked").map((product) => product.id);
        return {
          ...current,
          [profile.id]: profile.role === "admin" ? products.map((product) => product.id) : fallbackProductIds.slice(0, 4),
        };
      });
      setProgress((current) => ({ ...current, [profile.id]: current[profile.id] || {} }));
      setFavorites((current) => ({ ...current, [profile.id]: current[profile.id] || [] }));
      setHistory((current) => ({ ...current, [profile.id]: current[profile.id] || [] }));
      return result.user;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      throw new Error("Email already in use.");
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "student",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    };

    setUsers((current) => [...current, newUser]);
    setEntitlements((current) => ({
      ...current,
      [newUser.id]: products.filter((product) => product.access !== "locked").map((product) => product.id),
    }));
    setProgress((current) => ({ ...current, [newUser.id]: {} }));
    setFavorites((current) => ({ ...current, [newUser.id]: [] }));
    setHistory((current) => ({ ...current, [newUser.id]: [] }));
    setSession({ userId: newUser.id });
    return newUser;
  };

  const requestPasswordReset = async (email) => {
    if (firebaseEnabled && firebaseAuth) {
      await sendPasswordResetEmail(firebaseAuth, email.trim(), {
        url: `${window.location.origin}/reset-password`,
      });
      return { email: email.trim(), firebase: true };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((entry) => entry.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new Error("We could not find that email.");
    }

    const token = `reset-${user.id}-${Date.now()}`;
    setResetTokens((current) => ({ ...current, [token]: { userId: user.id, createdAt: Date.now() } }));
    return token;
  };

  const verifyResetEmail = async (oobCode) => {
    if (firebaseEnabled && firebaseAuth) {
      return verifyPasswordResetCode(firebaseAuth, oobCode);
    }

    return null;
  };

  const resetPassword = async ({ token, oobCode, password }) => {
    if (firebaseEnabled && firebaseAuth) {
      await confirmPasswordReset(firebaseAuth, oobCode || token, password);
      return true;
    }

    const entry = resetTokens[token];
    if (!entry) {
      throw new Error("Invalid or expired reset token.");
    }

    setUsers((current) =>
      current.map((user) => (user.id === entry.userId ? { ...user, password } : user)),
    );
    setResetTokens((current) => {
      const next = { ...current };
      delete next[token];
      return next;
    });
  };

  const updateProfile = (patch) => {
    if (!currentUser) {
      throw new Error("Not authenticated.");
    }

    if (firebaseEnabled && firebaseAuth?.currentUser) {
      const nextName = typeof patch.name === "string" ? patch.name.trim() : currentUser.name;
      const nextEmail = typeof patch.email === "string" ? patch.email.trim().toLowerCase() : currentUser.email;

      const tasks = [];
      if (nextName && nextName !== firebaseAuth.currentUser.displayName) {
        tasks.push(updateFirebaseProfile(firebaseAuth.currentUser, { displayName: nextName }));
      }
      if (nextEmail && nextEmail !== firebaseAuth.currentUser.email) {
        tasks.push(updateEmail(firebaseAuth.currentUser, nextEmail));
      }

      return Promise.all(tasks)
        .then(() => {
          setUsers((current) =>
            current.map((user) =>
              user.id === currentUser.id ? { ...user, ...patch, id: currentUser.id } : user,
            ),
          );
        })
        .catch((error) => {
          throw error;
        });
    }

    setUsers((current) =>
      current.map((user) => (user.id === currentUser.id ? { ...user, ...patch } : user)),
    );
  };

  const grantAccess = (userId, productId) => {
    setEntitlements((current) => {
      const userAccess = new Set(current[userId] || []);
      userAccess.add(productId);
      return { ...current, [userId]: Array.from(userAccess) };
    });
  };

  const revokeAccess = (userId, productId) => {
    setEntitlements((current) => {
      const userAccess = new Set(current[userId] || []);
      userAccess.delete(productId);
      return { ...current, [userId]: Array.from(userAccess) };
    });
  };

  const upsertProduct = (product) => {
    setProducts((current) => {
      const exists = current.some((entry) => entry.id === product.id);
      if (exists) {
        return current.map((entry) => (entry.id === product.id ? product : entry));
      }

      return [product, ...current];
    });
  };

  const archiveProduct = (productId) => {
    setProducts((current) => current.map((entry) => (entry.id === productId ? { ...entry, archived: true } : entry)));
  };

  const ensureProgressBucket = (userId) => {
    if (!progress[userId]) {
      setProgress((current) => ({ ...current, [userId]: {} }));
    }
  };

  const trackProductVisit = (productId) => {
    if (!currentUser) {
      return;
    }

    ensureProgressBucket(currentUser.id);
    setHistory((current) => {
      const existing = current[currentUser.id] || [];
      const next = [productId, ...existing.filter((id) => id !== productId)].slice(0, 12);
      return { ...current, [currentUser.id]: next };
    });
  };

  const toggleFavorite = (productId) => {
    if (!currentUser) {
      return;
    }

    setFavorites((current) => {
      const userFavorites = new Set(current[currentUser.id] || []);
      if (userFavorites.has(productId)) {
        userFavorites.delete(productId);
      } else {
        userFavorites.add(productId);
      }

      return { ...current, [currentUser.id]: Array.from(userFavorites) };
    });
  };

  const setLessonProgress = ({ productId, lessonId, progressValue, completed }) => {
    if (!currentUser) {
      throw new Error("Not authenticated.");
    }

    setProgress((current) => {
      const userBucket = current[currentUser.id] || {};
      const previous = userBucket[productId] || {
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

      return {
        ...current,
        [currentUser.id]: {
          ...userBucket,
          [productId]: {
            ...previous,
            progress: typeof progressValue === "number" ? progressValue : previous.progress,
            lastLessonId: lessonId || previous.lastLessonId,
            completedLessonIds: Array.from(completedLessonIds),
            lastAccessedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

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
    resetTokens,
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
    demoCredentials,
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
