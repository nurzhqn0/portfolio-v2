import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-ink/10 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-graphite/60 focus:border-clay/60 focus:ring-4 focus:ring-clay/10",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-graphite/60 focus:border-clay/60 focus:ring-4 focus:ring-clay/10",
        className,
      )}
      {...props}
    />
  );
}
