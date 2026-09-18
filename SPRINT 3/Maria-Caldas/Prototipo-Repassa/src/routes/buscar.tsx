import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

import { AppShell } from "@/components/app-shell";
import { MaterialCard } from "@/components/material-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { conditions, courses, materialCategories } from "@/data/materials";
import { useAppData } from "@/lib/store";

const searchSchema = z.object({
  q: z.string().optional().catch(undefined),
  categoria: z.string().optional().catch(undefined),
});
type Filters = { course: string; category: string; condition: string; maxPrice: string };
const emptyFilters: Filters = { course: "", category: "", condition: "", maxPrice: "" };

export const Route = createFileRoute("/buscar")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Buscar materiais — Repassa" },
      {
        name: "description",
        content:
          "Busque materiais acadêmicos usados por curso, categoria, preço e estado de conservação.",
      },
      { property: "og:title", content: "Buscar materiais — Repassa" },
      {
        property: "og:description",
        content: "Encontre materiais acadêmicos usados na comunidade universitária.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const { materials } = useAppData();
  const [term, setTerm] = useState(search.q ?? "");
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    category: search.categoria ?? "",
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(
    () =>
      materials.filter((material) => {
        const normalized = term.trim().toLocaleLowerCase("pt-BR");
        const matchesTerm =
          !normalized ||
          [material.titulo, material.descricao, material.curso, material.categoria].some((value) =>
            value.toLocaleLowerCase("pt-BR").includes(normalized),
          );
        return (
          matchesTerm &&
          (!filters.course || material.curso === filters.course) &&
          (!filters.category || material.categoria === filters.category) &&
          (!filters.condition || material.estadoConservacao === filters.condition) &&
          (!filters.maxPrice || material.preco <= Number(filters.maxPrice))
        );
      }),
    [term, filters, materials],
  );

  const activeCount = Object.values(filters).filter(Boolean).length;
  const update = (key: keyof Filters, value: string) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const selectClass =
    "h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

  const FilterFields = () => (
    <div className="grid gap-4">
      <label className="grid gap-1.5 text-sm font-semibold">
        Curso
        <select
          className={selectClass}
          value={filters.course}
          onChange={(e) => update("course", e.target.value)}
        >
          <option value="">Todos os cursos</option>
          {courses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-semibold">
        Categoria
        <select
          className={selectClass}
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {materialCategories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-semibold">
        Preço máximo
        <select
          className={selectClass}
          value={filters.maxPrice}
          onChange={(e) => update("maxPrice", e.target.value)}
        >
          <option value="">Qualquer preço</option>
          <option value="50">Até R$ 50</option>
          <option value="100">Até R$ 100</option>
          <option value="150">Até R$ 150</option>
        </select>
      </label>
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-semibold">Estado de conservação</legend>
        {conditions.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="condition"
              value={item}
              checked={filters.condition === item}
              onChange={(e) => update("condition", e.target.value)}
              className="size-4 accent-primary"
            />
            {item}
          </label>
        ))}
      </fieldset>
      {activeCount > 0 && (
        <Button variant="ghost" onClick={() => setFilters(emptyFilters)}>
          <X /> Limpar filtros
        </Button>
      )}
    </div>
  );

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Explore o campus</p>
          <h1 className="text-3xl font-bold">Buscar materiais</h1>
          <p className="mt-2 text-muted-foreground">
            Filtre oportunidades e encontre o item certo para o seu semestre.
          </p>
        </div>
        <div className="mt-6 flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="pl-10"
              placeholder="O que você está procurando?"
              aria-label="Pesquisar materiais"
            />
          </div>
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal /> <span className="hidden sm:inline">Filtros</span>
            {activeCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
        {filtersOpen && (
          <div className="mt-4 rounded-lg border border-border bg-card p-4 lg:hidden">
            <FilterFields />
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mb-5 flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-primary" />
                <h2 className="text-lg font-semibold">Filtros</h2>
                {activeCount > 0 && (
                  <span className="rounded-full bg-soft px-2 text-xs font-semibold text-brand-dark">
                    {activeCount}
                  </span>
                )}
              </div>
              <FilterFields />
            </div>
          </aside>
          <section aria-live="polite">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-semibold">
                {results.length}{" "}
                {results.length === 1 ? "material encontrado" : "materiais encontrados"}
              </h2>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 xl:grid-cols-3">
                {results.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
                <Search className="mx-auto size-9 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhum material encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente outro termo ou remova alguns filtros.
                </p>
                <Button
                  className="mt-5"
                  variant="outline"
                  onClick={() => {
                    setTerm("");
                    setFilters(emptyFilters);
                  }}
                >
                  Limpar busca
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  );
}
