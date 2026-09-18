import { Link, useLocation } from "@tanstack/react-router";
import { Home, MessageCircle, PlusCircle, Search, UserRound } from "lucide-react";
import type { ReactNode } from "react";

const items = [
  { label: "Início", icon: Home, to: "/" as const, enabled: true },
  { label: "Buscar", icon: Search, to: "/buscar" as const, enabled: true },
  { label: "Anunciar", icon: PlusCircle, to: "/anunciar" as const, enabled: true },
  { label: "Conversas", icon: MessageCircle, to: "/conversas" as const, enabled: true },
  { label: "Perfil", icon: UserRound, to: "/perfil" as const, enabled: true },
];

export function Brand() {
  return (
    <Link to="/" aria-label="Repassa — início" className="inline-flex items-center gap-2">
      <img src="/logo-mark.png" alt="" className="size-9 rounded-md" aria-hidden="true" />
      <span className="font-heading text-xl font-bold text-brand-dark">Repassa</span>
    </Link>
  );
}

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Brand />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
            {items.map((item) => {
              const Icon = item.icon;
              const active = item.enabled && isActive(pathname, item.to);
              return item.enabled ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={active ? "nav-item nav-item-active" : "nav-item"}
                >
                  <Icon aria-hidden="true" /> {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className="nav-item cursor-not-allowed opacity-45"
                  aria-disabled="true"
                  title="Disponível em uma próxima fase"
                >
                  <Icon aria-hidden="true" /> {item.label}
                </span>
              );
            })}
          </nav>
        </div>
      </header>

      {children}

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card md:hidden"
        aria-label="Navegação principal"
      >
        <div className="mx-auto grid h-18 max-w-lg grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.enabled && isActive(pathname, item.to);
            return item.enabled ? (
              <Link
                key={item.label}
                to={item.to}
                className={active ? "mobile-nav-item mobile-nav-item-active" : "mobile-nav-item"}
              >
                <Icon aria-hidden="true" /> <span>{item.label}</span>
              </Link>
            ) : (
              <span key={item.label} className="mobile-nav-item opacity-40" aria-disabled="true">
                <Icon aria-hidden="true" /> <span>{item.label}</span>
              </span>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
