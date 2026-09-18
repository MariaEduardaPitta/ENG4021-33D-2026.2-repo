import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck, Star } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { MaterialCard } from "@/components/material-card";
import { Button } from "@/components/ui/button";
import { getReviews } from "@/data/materials";
import { useAppData } from "@/lib/store";

export const Route = createFileRoute("/perfil_/$id")({
  head: () => ({ meta: [{ title: "Perfil do vendedor — Repassa" }] }),
  component: SellerProfilePage,
});

function SellerProfilePage() {
  const { id } = Route.useParams();
  const { sellers, materials, getOrCreateConversation } = useAppData();
  const navigate = useNavigate();

  const seller = sellers[id];
  const sellerMaterials = materials.filter((material) => material.idVendedor === id);
  const reviews = getReviews(id);

  if (!seller) {
    return (
      <AppShell>
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">Perfil não encontrado</h1>
          <Button className="mt-4" asChild>
            <Link to="/buscar">Ver materiais</Link>
          </Button>
        </main>
      </AppShell>
    );
  }

  const sellerId = seller.id;

  function handleMessage() {
    const target = sellerMaterials[0];
    if (!target) return;
    const conversation = getOrCreateConversation(target.id, sellerId);
    void navigate({ to: "/conversas/$id", params: { id: conversation.id } });
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-full bg-soft font-heading text-2xl font-bold text-brand-dark">
              {seller.nome.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-dark">{seller.nome}</h1>
              <p className="text-sm text-muted-foreground">
                {seller.curso} · {seller.instituicao}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                  <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
                  {seller.notaMedia.toFixed(1).replace(".", ",")} · {seller.totalAvaliacoes}{" "}
                  avaliações
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-success">
                  <ShieldCheck className="size-4" aria-hidden="true" /> Estudante verificado da
                  mesma universidade
                </span>
              </div>
            </div>
          </div>
          {sellerMaterials.length > 0 && (
            <Button onClick={handleMessage} className="w-full sm:w-auto">
              <MessageCircle aria-hidden="true" /> Enviar mensagem
            </Button>
          )}
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brand-dark">
            Anúncios de {seller.nome.split(" ")[0]}
          </h2>
          {sellerMaterials.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 lg:grid-cols-3">
              {sellerMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Nenhum anúncio ativo no momento.</p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-brand-dark">Avaliações</h2>
          {reviews.length > 0 ? (
            <ul className="mt-4 grid gap-3">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{review.autor}</p>
                    <span className="text-xs text-muted-foreground">{review.data}</span>
                  </div>
                  <div
                    className="mt-1 flex items-center gap-0.5"
                    aria-label={`Nota ${review.nota} de 5`}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`size-4 ${index < review.nota ? "fill-warning text-warning" : "text-muted"}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{review.comentario}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Ainda sem avaliações.</p>
          )}
        </section>
      </main>
    </AppShell>
  );
}
