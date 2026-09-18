import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle, ShieldCheck, Star, UserRound } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { MaterialCard } from "@/components/material-card";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil — Repassa" }] }),
  component: MeuPerfilPage,
});

function MeuPerfilPage() {
  const { currentUser, materials } = useAppData();
  const myMaterials = materials.filter((material) => material.idVendedor === currentUser.id);

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-full bg-soft font-heading text-2xl font-bold text-brand-dark">
              <UserRound className="size-8" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-dark">{currentUser.nome}</h1>
              <p className="text-sm text-muted-foreground">Meu perfil</p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                {currentUser.totalAvaliacoes > 0 ? (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                    <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
                    {currentUser.notaMedia.toFixed(1).replace(".", ",")} ·{" "}
                    {currentUser.totalAvaliacoes} avaliações
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Novo por aqui</span>
                )}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-success">
                  <ShieldCheck className="size-4" aria-hidden="true" /> Estudante verificado
                </span>
              </div>
            </div>
          </div>
          <Button variant="secondary" disabled className="w-full sm:w-auto">
            Editar perfil
          </Button>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-brand-dark">Meus anúncios</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/anunciar">
                <PlusCircle /> Novo anúncio
              </Link>
            </Button>
          </div>
          {myMaterials.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 lg:grid-cols-3">
              {myMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
              <PlusCircle className="mx-auto size-9 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">Você ainda não tem anúncios</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Anuncie um material e ele aparece aqui.
              </p>
              <Button className="mt-5" asChild>
                <Link to="/anunciar">Anunciar agora</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}
