"use client";
import { AppProvider } from "../../context/AppContext";
import BackofficeLoginPage from "../../components/auth/BackofficeLogin";

export default function LoginPage() {
  return (
    <AppProvider>
      <BackofficeLoginPage />
    </AppProvider>
  );
}
