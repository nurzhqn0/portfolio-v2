export function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/20 bg-white/60 px-6 py-10 text-center text-sm text-ink/50">
      {title}
    </div>
  );
}

