import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/materials";
import { useAppData } from "@/lib/store";

export const Route = createFileRoute("/conversas")({
  head: () => ({
    meta: [
      { title: "Conversas — Repassa" },
      { name: "description", content: "Suas conversas com compradores e vendedores na Repassa." },
    ],
  }),
  component: ConversasPage,
});

function ConversasPage() {
  const { conversations, materials, sellers } = useAppData();

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-primary">Negociações</p>
        <h1 className="text-3xl font-bold text-brand-dark">Conversas</h1>

        {conversations.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
            <MessageCircle className="mx-auto size-9 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">Nenhuma conversa ainda</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Envie uma mensagem a partir dos detalhes de um material para começar a negociar.
            </p>
            <Button className="mt-5" variant="outline" asChild>
              <Link to="/buscar">Explorar materiais</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card shadow-card">
            {conversations.map((conversation) => {
              const seller = sellers[conversation.sellerId];
              const material = materials.find((item) => item.id === conversation.materialId);
              const lastMessage = conversation.messages[conversation.messages.length - 1];

              return (
                <li key={conversation.id}>
                  <Link
                    to="/conversas/$id"
                    params={{ id: conversation.id }}
                    className="flex items-center gap-3 p-4 transition-colors hover:bg-soft"
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-full bg-soft font-heading text-base font-bold text-brand-dark">
                      {seller?.nome.charAt(0) ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate font-semibold text-foreground">
                          {seller?.nome ?? "Vendedor"}
                        </p>
                        {lastMessage && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {lastMessage.time}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {material
                          ? `${material.titulo} · ${formatPrice(material.preco)}`
                          : "Material"}
                      </p>
                      {lastMessage && (
                        <p className="mt-0.5 truncate text-sm text-foreground">
                          {lastMessage.from === "me" ? "Você: " : ""}
                          {lastMessage.text}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </AppShell>
  );
}
