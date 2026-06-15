import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./App";
import { PlatformProvider } from "./context/PlatformContext";
import {
  AdminPage,
  ForgotPasswordPage,
  LegalPage,
  LibraryPage,
  LoginPage,
  NotFoundPage,
  PlayerPage,
  ProductPage,
  ProfilePage,
  RequireAuth,
  RequireRole,
  ResetPasswordPage,
  ShellNav,
  SignupPage,
} from "./pages/PlatformPages";

function AppRoutes() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route
            path="/library"
            element={
              <RequireAuth>
                <LibraryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/product/:slug"
            element={
              <RequireAuth>
                <>
                  <ShellNav />
                  <ProductPage />
                </>
              </RequireAuth>
            }
          />
          <Route
            path="/watch/:slug/:lessonId"
            element={
              <RequireAuth>
                <>
                  <ShellNav />
                  <PlayerPage />
                </>
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <>
                  <ShellNav />
                  <ProfilePage />
                </>
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <>
                  <ShellNav />
                  <AdminPage />
                </>
              </RequireRole>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </PlatformProvider>
  );
}

export default AppRoutes;
