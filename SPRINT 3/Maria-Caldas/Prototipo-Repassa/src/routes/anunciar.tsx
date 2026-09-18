import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ImagePlus, X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories, conditions, courses, type MaterialCondition } from "@/data/materials";
import { useAppData } from "@/lib/store";

export const Route = createFileRoute("/anunciar")({
  head: () => ({
    meta: [
      { title: "Anunciar material — Repassa" },
      { name: "description", content: "Anuncie um material acadêmico usado na Repassa." },
    ],
  }),
  component: AnunciarPage,
});

type FormState = {
  titulo: string;
  descricao: string;
  categoria: string;
  curso: string;
  estadoConservacao: MaterialCondition | "";
  preco: string;
  precoProdutoNovo: string;
};

const emptyForm: FormState = {
  titulo: "",
  descricao: "",
  categoria: "",
  curso: "",
  estadoConservacao: "",
  preco: "",
  precoProdutoNovo: "",
};

function AnunciarPage() {
  const { addMaterial } = useAppData();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showBanner, setShowBanner] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!photo) nextErrors["foto"] = "Adicione uma foto do material.";
    if (!form.titulo.trim()) nextErrors["titulo"] = "Informe o nome do material.";
    if (!form.descricao.trim()) nextErrors["descricao"] = "Descreva o material.";
    if (!form.categoria) nextErrors["categoria"] = "Selecione uma categoria.";
    if (!form.curso) nextErrors["curso"] = "Selecione um curso.";
    if (!form.estadoConservacao)
      nextErrors["estadoConservacao"] = "Selecione o estado de conservação.";
    if (!form.preco || Number(form.preco) <= 0) nextErrors["preco"] = "Informe um preço válido.";
    if (!form.precoProdutoNovo || Number(form.precoProdutoNovo) <= 0)
      nextErrors["precoProdutoNovo"] = "Informe o preço do produto novo.";

    setErrors(nextErrors);
    setShowBanner(Object.keys(nextErrors).length > 0);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate() || !photo || !form.estadoConservacao) return;

    const material = addMaterial({
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      preco: Number(form.preco),
      precoProdutoNovo: Number(form.precoProdutoNovo),
      estadoConservacao: form.estadoConservacao,
      curso: form.curso,
      categoria: form.categoria,
      foto: photo,
    });

    toast.success("Anúncio publicado com sucesso");
    void navigate({ to: "/material/$id", params: { id: material.id } });
  }

  const fieldError = (key: keyof FormState | "foto") => errors[key];
  const inputClass = (key: keyof FormState | "foto") =>
    fieldError(key) ? "border-destructive focus-visible:ring-destructive" : "";

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-primary">Divulgue seu material</p>
        <h1 className="text-3xl font-bold text-brand-dark">Anunciar material</h1>
        <p className="mt-2 text-muted-foreground">
          Preencha as informações abaixo para publicar seu anúncio na comunidade universitária.
        </p>

        {showBanner && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-md bg-warning-soft px-4 py-3 text-sm font-semibold text-warning-foreground"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Confira as informações antes de continuar.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-6 rounded-lg border border-border bg-card p-5 shadow-card sm:p-6"
          noValidate
        >
          <div className="grid gap-1.5">
            <Label>Foto do material</Label>
            {photo ? (
              <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-lg border border-border bg-muted">
                <img src={photo} alt="Prévia do material" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-background/90 text-foreground shadow"
                  aria-label="Remover foto"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex aspect-[4/3] w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-soft/40 text-muted-foreground transition hover:border-primary hover:text-primary ${
                  fieldError("foto") ? "border-destructive" : "border-border"
                }`}
              >
                <ImagePlus className="size-8" aria-hidden="true" />
                <span className="text-sm font-semibold">Adicionar foto</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {fieldError("foto") && <p className="text-sm text-destructive">{fieldError("foto")}</p>}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="titulo">Título do anúncio</Label>
            <Input
              id="titulo"
              value={form.titulo}
              onChange={(event) => update("titulo", event.target.value)}
              placeholder="Ex.: Calculadora científica"
              className={inputClass("titulo")}
            />
            {fieldError("titulo") && (
              <p className="text-sm text-destructive">{fieldError("titulo")}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={form.descricao}
              onChange={(event) => update("descricao", event.target.value)}
              placeholder="Conte o estado de uso, motivo da venda e o que acompanha..."
              className={inputClass("descricao")}
              rows={4}
            />
            {fieldError("descricao") && (
              <p className="text-sm text-destructive">{fieldError("descricao")}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Categoria</Label>
              <Select value={form.categoria} onValueChange={(value) => update("categoria", value)}>
                <SelectTrigger className={inputClass("categoria")}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.nome} value={category.nome}>
                      {category.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("categoria") && (
                <p className="text-sm text-destructive">{fieldError("categoria")}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label>Curso</Label>
              <Select value={form.curso} onValueChange={(value) => update("curso", value)}>
                <SelectTrigger className={inputClass("curso")}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("curso") && (
                <p className="text-sm text-destructive">{fieldError("curso")}</p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Estado de conservação</Label>
            <Select
              value={form.estadoConservacao}
              onValueChange={(value) => update("estadoConservacao", value as MaterialCondition)}
            >
              <SelectTrigger className={inputClass("estadoConservacao")}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError("estadoConservacao") && (
              <p className="text-sm text-destructive">{fieldError("estadoConservacao")}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="preco">Preço de venda (R$)</Label>
              <Input
                id="preco"
                type="number"
                min="0"
                step="0.01"
                value={form.preco}
                onChange={(event) => update("preco", event.target.value)}
                placeholder="0,00"
                className={inputClass("preco")}
              />
              {fieldError("preco") && (
                <p className="text-sm text-destructive">{fieldError("preco")}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="precoProdutoNovo">Preço do produto novo (R$)</Label>
              <Input
                id="precoProdutoNovo"
                type="number"
                min="0"
                step="0.01"
                value={form.precoProdutoNovo}
                onChange={(event) => update("precoProdutoNovo", event.target.value)}
                placeholder="0,00"
                className={inputClass("precoProdutoNovo")}
              />
              {fieldError("precoProdutoNovo") && (
                <p className="text-sm text-destructive">{fieldError("precoProdutoNovo")}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Usado para exibir o desconto riscado no anúncio.
              </p>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Publicar anúncio
          </Button>
        </form>
      </main>
    </AppShell>
  );
}
