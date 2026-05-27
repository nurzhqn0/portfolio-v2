export function Footer() {
  return (
    <footer className="relative z-10 mx-auto max-w-7xl px-5 py-10 text-sm text-graphite">
      <div className="flex items-center justify-center border-t border-ink/10 pt-6">
        <span className="transition-colors duration-200 hover:text-clay hover:underline">
          © {new Date().getFullYear()}{" "}
          <a href="https://github.com/nurzhqn0" target="_blank">
            nurzhqn0
          </a>
        </span>
      </div>
    </footer>
  );
}
