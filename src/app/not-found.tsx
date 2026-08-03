import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-[var(--color-offwhite)] flex items-center justify-center">
      <div className="container-site text-center py-20">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-[8rem] lg:text-[12rem] font-bold text-[var(--color-ink)] font-[var(--font-display)] leading-none tracking-tighter">
            4
          </span>
          <span className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-[var(--color-yellow)] inline-block" />
          <span className="text-[8rem] lg:text-[12rem] font-bold text-[var(--color-ink)] font-[var(--font-display)] leading-none tracking-tighter">
            4
          </span>
        </div>
        <p className="text-lg text-[var(--color-mute)] mb-8 max-w-md mx-auto">
          This page doesn&rsquo;t exist. It might have been moved or you may
          have mistyped the URL.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 bg-[var(--color-yellow)] text-[var(--color-ink)] font-medium rounded-[var(--radius-full)] hover:opacity-90 transition-opacity text-sm"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
