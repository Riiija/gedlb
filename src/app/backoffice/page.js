"use client";
import { AppProvider } from "../../context/AppContext";
import { AppShell }   from "../../components/layout/AppShell";
export default function BackofficePage() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
