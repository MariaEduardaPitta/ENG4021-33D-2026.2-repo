import { Link } from "@tanstack/react-router";
import { CircleCheck, CircleX, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { type Material, formatPrice } from "@/data/materials";

export function MaterialCard({ material }: { material: Material }) {
  const isAvailable = material.status === "disponível";

  return (
    <Link
      to="/material/$id"
      params={{ id: material.id }}
      aria-label={`Ver detalhes de ${material.titulo}`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <article className="overflow-hidden rounded-lg border border-border bg-card shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={material.foto}
            alt={material.titulo}
            width={1024}
            height={768}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <Badge variant={isAvailable ? "success" : "sold"} className="absolute left-3 top-3">
            {isAvailable ? <CircleCheck aria-hidden="true" /> : <CircleX aria-hidden="true" />}
            {material.status}
          </Badge>
        </div>

        <div className="flex min-h-64 flex-col p-4">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge variant="soft">{material.curso}</Badge>
            <Badge variant="outline">{material.categoria}</Badge>
          </div>
          <h3 className="line-clamp-2 font-heading text-lg font-semibold leading-snug text-card-foreground">
            {material.titulo}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{material.estadoConservacao} estado</p>

          <div className="mt-3 flex items-end gap-2">
            <strong className="text-xl text-price">{formatPrice(material.preco)}</strong>
            <span className="pb-0.5 text-xs text-muted-foreground line-through">
              Nova: {formatPrice(material.precoProdutoNovo)}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="truncate pr-2 font-medium text-foreground">
              {material.vendedor.nome}
            </span>
            <span
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-foreground"
              aria-label={`Nota ${material.vendedor.notaMedia}`}
            >
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              {material.vendedor.notaMedia.toFixed(1).replace(".", ",")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
