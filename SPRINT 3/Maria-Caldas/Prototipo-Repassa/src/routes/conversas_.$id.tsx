import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/data/materials";
import { useAppData } from "@/lib/store";

export const Route = createFileRoute("/conversas_/$id")({
  head: () => ({
    meta: [{ title: "Conversa — Repassa" }],
  }),
  component: ConversationPage,
});

function ConversationPage() {
  const { id } = Route.useParams();
  const { conversations, materials, sellers, sendMessage } = useAppData();
  const [text, setText] = useState("");

  const conversation = conversations.find((item) => item.id === id);

  if (!conversation) {
    return (
      <AppShell>
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">Conversa não encontrada</h1>
          <Button className="mt-4" asChild>
            <Link to="/conversas">Voltar às conversas</Link>
          </Button>
        </main>
      </AppShell>
    );
  }

  const seller = sellers[conversation.sellerId];
  const material = materials.find((item) => item.id === conversation.materialId);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    sendMessage(conversation!.id, text);
    setText("");
  }

  return (
    <AppShell>
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 border-b border-border py-4">
          <Link
            to="/conversas"
            aria-label="Voltar às conversas"
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-soft font-heading font-bold text-brand-dark">
            {seller?.nome.charAt(0) ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{seller?.nome ?? "Vendedor"}</p>
            <p className="truncate text-xs text-muted-foreground">{seller?.instituicao}</p>
          </div>
        </div>

        {material && (
          <Link
            to="/material/$id"
            params={{ id: material.id }}
            className="flex items-center gap-3 border-b border-border bg-soft/60 px-1 py-3 transition hover:bg-soft"
          >
            <img
              src={material.foto}
              alt={material.titulo}
              className="size-12 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{material.titulo}</p>
              <p className="text-sm font-bold text-price">{formatPrice(material.preco)}</p>
            </div>
          </Link>
        )}

        <div className="flex-1 space-y-3 overflow-y-auto py-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3.5 py-2 text-sm ${
                  message.from === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`mt-1 text-[11px] ${
                    message.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border py-3">
          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Escreva uma mensagem..."
            aria-label="Mensagem"
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!text.trim()} aria-label="Enviar mensagem">
            <Send aria-hidden="true" />
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
