import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

/** Page frame shown after login: top bar + the current page. */
export default function Layout() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 py-5">
        <Outlet />
      </main>
    </div>
  );
}

