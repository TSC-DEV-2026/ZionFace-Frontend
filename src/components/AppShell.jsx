import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppShell() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-void text-white">
      <Navbar />

      {/* pt precisa acompanhar a altura real do header em mobile */}
      <main className="w-full overflow-x-hidden pt-[52px] sm:pt-10">
        <Outlet />
      </main>
    </div>
  );
}