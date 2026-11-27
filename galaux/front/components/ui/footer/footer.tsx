import Link from 'next/link';

export function Footer() {
  return (
    <footer className="glass border-x-0 border-b-0">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row">
        <span className="font-display tracking-wider text-ice">GALAUX</span>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-neon">
            О проекте
          </Link>
          <Link href="/rules" className="hover:text-neon">
            Правила
          </Link>
          <Link href="/support" className="hover:text-neon">
            Поддержка
          </Link>
          <Link href="/api" className="hover:text-neon">
            API
          </Link>
        </div>
        <span>© 2026 Galaux. Все права защищены.</span>
      </div>
    </footer>
  );
}