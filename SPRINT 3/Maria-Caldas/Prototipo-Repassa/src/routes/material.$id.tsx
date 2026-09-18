import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Star,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/materials";
import { useAppData } from "@/lib/store";

export const Route = createFileRoute("/material/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do material — Repassa" },
      { name: "description", content: "Detalhes do material acadêmico anunciado na Repassa." },
    ],
  }),
  component: MaterialDetail,
});

function MaterialDetail() {
  const { id } = Route.useParams();
  const { materials, sellers, buyMaterial, getOrCreateConversation } = useAppData();
  const navigate = useNavigate();

  const material = materials.find((item) => item.id === id);

  if (!material) {
    return <MaterialNotFound />;
  }

  const seller = sellers[material.idVendedor];
  const isAvailable = material.status === "disponível";
  const materialId = material.id;
  const sellerId = material.idVendedor;

  function handleConfirmPurchase() {
    buyMaterial(materialId);
    toast.success("Compra confirmada! Combine a entrega pelo chat.");
    const conversation = getOrCreateConversation(materialId, sellerId);
    void navigate({ to: "/conversas/$id", params: { id: conversation.id } });
  }

  function handleSendMessage() {
    const conversation = getOrCreateConversation(materialId, sellerId);
    void navigate({ to: "/conversas/$id", params: { id: conversation.id } });
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          to="/buscar"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Voltar para a busca
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="relative aspect-[4/3] bg-muted">
              <img
                src={material.foto}
                alt={material.titulo}
                className="h-full w-full object-cover"
              />
              <Badge variant={isAvailable ? "success" : "sold"} className="absolute left-3 top-3">
                {isAvailable ? <CheckCircle2 aria-hidden="true" /> : <XCircle aria-hidden="true" />}
                {isAvailable ? "Disponível" : "Vendido"}
              </Badge>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="soft">{material.curso}</Badge>
              <Badge variant="outline">{material.categoria}</Badge>
              <Badge variant="warning">{material.estadoConservacao} estado</Badge>
            </div>

            <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-brand-dark">
              {material.titulo}
            </h1>

            <div className="mt-3 flex items-end gap-3">
              <span className="text-3xl font-bold text-price">{formatPrice(material.preco)}</span>
              <span className="pb-1 text-sm text-muted-foreground line-through">
                Novo: {formatPrice(material.precoProdutoNovo)}
              </span>
            </div>

            <div
              className={`mt-4 flex items-center gap-2 rounded-md px-4 py-3 text-sm font-semibold ${
                isAvailable ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"
              }`}
              role="status"
            >
              {isAvailable ? (
                <CheckCircle2 className="size-5" aria-hidden="true" />
              ) : (
                <XCircle className="size-5" aria-hidden="true" />
              )}
              {isAvailable ? "Disponível para compra" : "Este material já foi vendido"}
            </div>

            <section className="mt-6">
              <h2 className="text-lg font-semibold">Descrição</h2>
              <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                {material.descricao}
              </p>
            </section>

            {seller && (
              <section className="mt-6 rounded-lg border border-border bg-card p-5 shadow-card">
                <h2 className="text-lg font-semibold">Vendedor</h2>
                <div className="mt-3 flex items-start gap-4">
                  <div className="grid size-12 shrink-0 place-items-center rounded-full bg-soft font-heading text-lg font-bold text-brand-dark">
                    {seller.nome.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{seller.nome}</p>
                    <p className="text-sm text-muted-foreground">{seller.instituicao}</p>
                    <p className="text-sm text-muted-foreground">{seller.curso}</p>
                    <p
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-foreground"
                      aria-label={`Nota ${seller.notaMedia} em ${seller.totalAvaliacoes} avaliações`}
                    >
                      <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
                      {seller.notaMedia.toFixed(1).replace(".", ",")} · {seller.totalAvaliacoes}{" "}
                      avaliações
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-md bg-soft p-3">
                    <p className="text-xs text-muted-foreground">Membro desde</p>
                    <p className="font-semibold text-brand-dark">{seller.membroDesde}</p>
                  </div>
                  <div className="rounded-md bg-soft p-3">
                    <p className="text-xs text-muted-foreground">Avaliações</p>
                    <p className="font-semibold text-brand-dark">{seller.totalAvaliacoes}</p>
                  </div>
                  <div className="rounded-md bg-soft p-3">
                    <p className="text-xs text-muted-foreground">Confiança</p>
                    <p className="inline-flex items-center gap-1 font-semibold text-success">
                      <ShieldCheck className="size-4" aria-hidden="true" /> Verificado
                    </p>
                  </div>
                </div>

                <Button variant="secondary" className="mt-4 w-full sm:w-auto" asChild>
                  <Link to="/perfil/$id" params={{ id: seller.id }}>
                    <UserRound aria-hidden="true" /> Ver detalhes do vendedor
                  </Link>
                </Button>
              </section>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="flex-1" size="lg" disabled={!isAvailable}>
                    <ShoppingBag aria-hidden="true" /> Comprar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar interesse em comprar?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você está confirmando interesse em <strong>{material.titulo}</strong> por{" "}
                      {formatPrice(material.preco)}. Os detalhes de entrega serão combinados
                      diretamente com o vendedor pelo chat.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmPurchase}>
                      Confirmar compra
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="secondary" className="flex-1" size="lg" onClick={handleSendMessage}>
                <MessageCircle aria-hidden="true" /> Enviar mensagem
              </Button>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function MaterialNotFound() {
  return (
    <AppShell>
      <main className="mx-auto max-w-md px-4 py-16 text-center sm:py-24">
        <XCircle className="mx-auto size-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
          Material não encontrado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este anúncio não existe ou foi removido.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild>
            <Link to="/">Voltar ao início</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/buscar">Ver materiais</Link>
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
