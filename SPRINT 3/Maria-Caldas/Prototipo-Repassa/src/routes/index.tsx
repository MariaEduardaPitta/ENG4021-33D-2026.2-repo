import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  FlaskConical,
  PlusCircle,
  Ruler,
  Search,
  Shirt,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { AppShell } from "@/components/app-shell";
import { MaterialCard } from "@/components/material-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/materials";
import { useAppData } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Repassa — materiais acadêmicos entre universitários" },
      {
        name: "description",
        content:
          "Encontre livros, calculadoras, jalecos e materiais acadêmicos usados na sua comunidade universitária.",
      },
      { property: "og:title", content: "Repassa — materiais acadêmicos entre universitários" },
      {
        property: "og:description",
        content: "Economize e faça bons materiais circularem na universidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { materials } = useAppData();

  function submit(event: FormEvent) {
    event.preventDefault();
    void navigate({ to: "/buscar", search: { q: term || undefined, categoria: undefined } });
  }

  const categoryIcons = [Search, Calculator, Shirt, Ruler, FlaskConical];

  return (
    <AppShell>
      <main>
        <section className="border-b border-border bg-soft">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <img src="/logo-mark.png" alt="Repassa" className="mb-4 size-14 rounded-xl" />
            <p className="mb-2 text-sm font-semibold uppercase text-primary">
              Materiais que continuam histórias
            </p>
            <h1 className="max-w-2xl text-3xl font-bold leading-tight text-brand-dark sm:text-4xl">
              O material que você precisa pode estar a poucos corredores.
            </h1>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              Compre, venda, troque ou doe itens acadêmicos dentro da comunidade universitária.
            </p>
            <form
              onSubmit={submit}
              className="mt-7 flex max-w-2xl gap-2 rounded-lg bg-card p-2 shadow-card"
              role="search"
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  className="border-0 pl-10 shadow-none focus-visible:ring-0"
                  placeholder="Jaleco, livro de cálculo, calculadora..."
                  aria-label="Pesquisar materiais"
                />
              </div>
              <Button type="submit" size="icon" aria-label="Buscar">
                <ArrowRight />
              </Button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Explore rápido</p>
              <h2 className="text-2xl font-semibold">Categorias</h2>
            </div>
            <Button variant="link" className="hidden px-0 sm:inline-flex" asChild>
              <a href="/buscar">
                Ver todas <ArrowRight />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category, index) => {
              const Icon = categoryIcons[index];
              return (
                <Button
                  key={category.nome}
                  variant="outline"
                  type="button"
                  onClick={() =>
                    void navigate({
                      to: "/buscar",
                      search: { categoria: category.nome, q: undefined },
                    })
                  }
                  className="h-24 flex-col items-start justify-between whitespace-normal border-border bg-card p-4 text-left text-foreground shadow-card hover:border-primary hover:bg-soft"
                >
                  {Icon ? (
                    <Icon className="size-6 text-primary" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{category.simbolo}</span>
                  )}
                  <span className="font-semibold">{category.nome}</span>
                </Button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Boas oportunidades</p>
              <h2 className="text-2xl font-semibold">Destaques perto de você</h2>
            </div>
            <Button variant="outline" className="hidden sm:inline-flex" asChild>
              <a href="/buscar">
                Ver materiais <ArrowRight />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 lg:grid-cols-4">
            {materials
              .filter((material) => material.destaque)
              .map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-lg bg-soft p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-xl font-semibold text-brand-dark">Tem material sobrando?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Anuncie grátis e ajude outro estudante a economizar.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/anunciar">
                <PlusCircle /> Anunciar grátis
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
