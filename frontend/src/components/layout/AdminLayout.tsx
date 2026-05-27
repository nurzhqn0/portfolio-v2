import { LogOut } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { clearToken } from "../../lib/auth";

export function AdminLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f1eb] text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink/45">
              Admin
            </p>
            <h1 className="font-display text-2xl italic">Portfolio Studio</h1>
          </div>
          <Button variant="ghost" onClick={logout}>
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
