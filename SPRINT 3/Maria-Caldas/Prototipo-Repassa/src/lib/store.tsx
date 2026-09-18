import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  materials as seedMaterials,
  sellers as seedSellers,
  type Material,
  type Seller,
} from "@/data/materials";

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  sellerId: string;
  materialId: string;
  messages: ChatMessage[];
};

export const CURRENT_USER_ID = "usr-me";

const CURRENT_USER: Seller = {
  id: CURRENT_USER_ID,
  nome: "Você",
  instituicao: "Sua universidade",
  curso: "Seu curso",
  notaMedia: 0,
  totalAvaliacoes: 0,
  membroDesde: "2026",
};

export type NewMaterialInput = {
  titulo: string;
  descricao: string;
  preco: number;
  precoProdutoNovo: number;
  estadoConservacao: Material["estadoConservacao"];
  curso: string;
  categoria: string;
  foto: string;
};

type Store = {
  materials: Material[];
  sellers: Record<string, Seller>;
  currentUser: Seller;
  addMaterial: (input: NewMaterialInput) => Material;
  buyMaterial: (id: string) => void;
  conversations: Conversation[];
  getOrCreateConversation: (materialId: string, sellerId: string) => Conversation;
  sendMessage: (conversationId: string, text: string) => void;
};

const StoreContext = createContext<Store | null>(null);

const STORAGE_PREFIX = "repassa-store-v1";

function nowLabel() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function persist<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
  } catch {
    // ignore quota/serialization errors — best effort persistence for the prototype
  }
}

function restore<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  // Initial render always uses seed data (same on server and client) to avoid
  // hydration mismatches. Persisted state (if any) is applied after mount.
  const [materials, setMaterials] = useState<Material[]>(seedMaterials);
  const [sellers, setSellers] = useState<Record<string, Seller>>(seedSellers);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const restoredMaterials = restore<Material[]>("materials");
    const restoredSellers = restore<Record<string, Seller>>("sellers");
    const restoredConversations = restore<Conversation[]>("conversations");
    if (restoredMaterials) setMaterials(restoredMaterials);
    if (restoredSellers) setSellers(restoredSellers);
    if (restoredConversations) setConversations(restoredConversations);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persist("materials", materials);
  }, [materials, hydrated]);
  useEffect(() => {
    if (hydrated) persist("sellers", sellers);
  }, [sellers, hydrated]);
  useEffect(() => {
    if (hydrated) persist("conversations", conversations);
  }, [conversations, hydrated]);

  const currentUser = sellers[CURRENT_USER_ID] ?? CURRENT_USER;

  function addMaterial(input: NewMaterialInput): Material {
    const id = `mat-${Date.now()}`;
    const material: Material = {
      id,
      titulo: input.titulo,
      descricao: input.descricao,
      preco: input.preco,
      precoProdutoNovo: input.precoProdutoNovo,
      estadoConservacao: input.estadoConservacao,
      foto: input.foto,
      curso: input.curso,
      categoria: input.categoria,
      status: "disponível",
      idVendedor: CURRENT_USER_ID,
      vendedor: { nome: currentUser.nome, notaMedia: currentUser.notaMedia },
      destaque: false,
    };
    setSellers((current) =>
      current[CURRENT_USER_ID] ? current : { ...current, [CURRENT_USER_ID]: CURRENT_USER },
    );
    setMaterials((current) => [material, ...current]);
    return material;
  }

  function buyMaterial(id: string) {
    setMaterials((current) =>
      current.map((material) =>
        material.id === id ? { ...material, status: "vendido" } : material,
      ),
    );
  }

  function getOrCreateConversation(materialId: string, sellerId: string): Conversation {
    const existing = conversations.find(
      (conversation) =>
        conversation.materialId === materialId && conversation.sellerId === sellerId,
    );
    if (existing) return existing;

    const material = materials.find((item) => item.id === materialId);
    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      sellerId,
      materialId,
      messages: [
        {
          id: `msg-${Date.now()}`,
          from: "them",
          text: material
            ? `Oi! Ainda tem interesse em "${material.titulo}"?`
            : "Oi! Como posso ajudar?",
          time: nowLabel(),
        },
      ],
    };
    setConversations((current) => [conversation, ...current]);
    return conversation;
  }

  function sendMessage(conversationId: string, text: string) {
    if (!text.trim()) return;
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                { id: `msg-${Date.now()}`, from: "me", text: text.trim(), time: nowLabel() },
              ],
            }
          : conversation,
      ),
    );
  }

  const value = useMemo<Store>(
    () => ({
      materials,
      sellers,
      currentUser,
      addMaterial,
      buyMaterial,
      conversations,
      getOrCreateConversation,
      sendMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [materials, sellers, currentUser, conversations],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppData(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
