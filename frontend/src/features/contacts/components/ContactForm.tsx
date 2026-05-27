import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "../../../components/ui/button";
import { Input, Textarea } from "../../../components/ui/input";
import { api } from "../../../lib/api";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus(null);
    await api.createContactMessage(form);
    setForm({ name: "", email: "", message: "" });
    setStatus("Message sent.");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Input
        required
        placeholder="Name"
        value={form.name}
        onChange={(event) =>
          setForm((current) => ({ ...current, name: event.target.value }))
        }
      />
      <Input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(event) =>
          setForm((current) => ({ ...current, email: event.target.value }))
        }
      />
      <Textarea
        required
        placeholder="Message"
        value={form.message}
        onChange={(event) =>
          setForm((current) => ({ ...current, message: event.target.value }))
        }
      />
      <Button type="submit">
        <Send size={16} />
        Send
      </Button>
      {status && <p className="text-sm text-moss">{status}</p>}
    </form>
  );
}
