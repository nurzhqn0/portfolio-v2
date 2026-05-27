import { Lock } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useLogin } from "../features/auth/api";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });

  async function submit(event: FormEvent) {
    event.preventDefault();
    await login.mutateAsync(form);
    navigate("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
          <Lock size={20} />
        </div>
        <h1 className="font-display text-4xl italic">Admin login</h1>
        <form onSubmit={submit} className="mt-8 space-y-3">
          <Input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          <Input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
          />
          <Button className="w-full" type="submit" disabled={login.isPending}>
            Sign in
          </Button>
          {login.error && (
            <p className="text-sm text-red-600">{login.error.message}</p>
          )}
        </form>
      </Card>
    </main>
  );
}
