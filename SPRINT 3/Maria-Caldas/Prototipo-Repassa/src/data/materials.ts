import calculadora from "@/assets/calculadora-cientifica.jpg";
import livroCalculo from "@/assets/livro-calculo.jpg";
import jaleco from "@/assets/jaleco-laboratorio.jpg";
import kitDesenho from "@/assets/kit-desenho.jpg";
import atlasAnatomia from "@/assets/atlas-anatomia.jpg";
import kitQuimica from "@/assets/kit-quimica.jpg";

export type MaterialCondition = "Novo" | "Excelente" | "Bom" | "Regular";
export type MaterialStatus = "disponível" | "vendido";

export type Material = {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  precoProdutoNovo: number;
  estadoConservacao: MaterialCondition;
  foto: string;
  curso: string;
  categoria: string;
  status: MaterialStatus;
  idVendedor: string;
  vendedor: { nome: string; notaMedia: number };
  destaque: boolean;
};

export type Seller = {
  id: string;
  nome: string;
  instituicao: string;
  curso: string;
  notaMedia: number;
  totalAvaliacoes: number;
  membroDesde: string;
};

export const materials: Material[] = [
  {
    id: "mat-001",
    titulo: "Calculadora científica",
    descricao: "Calculadora completa, com capa protetora e todas as funções operando normalmente.",
    preco: 85,
    precoProdutoNovo: 140,
    estadoConservacao: "Bom",
    foto: calculadora,
    curso: "Engenharia",
    categoria: "Calculadoras",
    status: "disponível",
    idVendedor: "usr-001",
    vendedor: { nome: "Marina Alves", notaMedia: 4.8 },
    destaque: true,
  },
  {
    id: "mat-002",
    titulo: "Livro de Cálculo Vol. 1",
    descricao: "Edição completa com marcações leves a lápis e abas de estudo removíveis.",
    preco: 70,
    precoProdutoNovo: 180,
    estadoConservacao: "Regular",
    foto: livroCalculo,
    curso: "Engenharia",
    categoria: "Livros",
    status: "disponível",
    idVendedor: "usr-002",
    vendedor: { nome: "Rafael Santos", notaMedia: 4.9 },
    destaque: true,
  },
  {
    id: "mat-003",
    titulo: "Jaleco branco unissex",
    descricao: "Jaleco tamanho M, higienizado, tecido encorpado e sem manchas.",
    preco: 48,
    precoProdutoNovo: 95,
    estadoConservacao: "Excelente",
    foto: jaleco,
    curso: "Medicina",
    categoria: "Jalecos",
    status: "disponível",
    idVendedor: "usr-003",
    vendedor: { nome: "Camila Rocha", notaMedia: 5 },
    destaque: true,
  },
  {
    id: "mat-004",
    titulo: "Kit de desenho técnico",
    descricao: "Compasso, esquadros, régua metálica e lapiseira para disciplinas de desenho.",
    preco: 55,
    precoProdutoNovo: 120,
    estadoConservacao: "Bom",
    foto: kitDesenho,
    curso: "Arquitetura",
    categoria: "Instrumentos",
    status: "disponível",
    idVendedor: "usr-004",
    vendedor: { nome: "Lucas Melo", notaMedia: 4.7 },
    destaque: true,
  },
  {
    id: "mat-005",
    titulo: "Atlas de anatomia",
    descricao:
      "Atlas ilustrado, edição grande, páginas preservadas e capa com sinais leves de uso.",
    preco: 110,
    precoProdutoNovo: 260,
    estadoConservacao: "Bom",
    foto: atlasAnatomia,
    curso: "Medicina",
    categoria: "Livros",
    status: "vendido",
    idVendedor: "usr-005",
    vendedor: { nome: "Beatriz Lima", notaMedia: 4.9 },
    destaque: false,
  },
  {
    id: "mat-006",
    titulo: "Kit básico de laboratório",
    descricao: "Vidrarias, óculos e acessórios para aulas práticas introdutórias.",
    preco: 95,
    precoProdutoNovo: 210,
    estadoConservacao: "Novo",
    foto: kitQuimica,
    curso: "Química",
    categoria: "Laboratório",
    status: "disponível",
    idVendedor: "usr-006",
    vendedor: { nome: "João Pedro", notaMedia: 4.6 },
    destaque: false,
  },
];

export const sellers: Record<string, Seller> = {
  "usr-001": {
    id: "usr-001",
    nome: "Marina Alves",
    instituicao: "Universidade Federal de Minas Gerais",
    curso: "Engenharia Civil",
    notaMedia: 4.8,
    totalAvaliacoes: 23,
    membroDesde: "2024",
  },
  "usr-002": {
    id: "usr-002",
    nome: "Rafael Santos",
    instituicao: "Universidade de São Paulo",
    curso: "Engenharia Elétrica",
    notaMedia: 4.9,
    totalAvaliacoes: 31,
    membroDesde: "2023",
  },
  "usr-003": {
    id: "usr-003",
    nome: "Camila Rocha",
    instituicao: "Universidade Federal do Rio de Janeiro",
    curso: "Medicina",
    notaMedia: 5,
    totalAvaliacoes: 12,
    membroDesde: "2024",
  },
  "usr-004": {
    id: "usr-004",
    nome: "Lucas Melo",
    instituicao: "Universidade Federal do Paraná",
    curso: "Arquitetura e Urbanismo",
    notaMedia: 4.7,
    totalAvaliacoes: 18,
    membroDesde: "2023",
  },
  "usr-005": {
    id: "usr-005",
    nome: "Beatriz Lima",
    instituicao: "Universidade Federal de Minas Gerais",
    curso: "Medicina",
    notaMedia: 4.9,
    totalAvaliacoes: 27,
    membroDesde: "2022",
  },
  "usr-006": {
    id: "usr-006",
    nome: "João Pedro",
    instituicao: "Universidade Estadual de Campinas",
    curso: "Química",
    notaMedia: 4.6,
    totalAvaliacoes: 9,
    membroDesde: "2024",
  },
};

export const getSeller = (id: string): Seller | undefined => sellers[id];

export type Review = { id: string; autor: string; nota: number; comentario: string; data: string };

export const reviews: Record<string, Review[]> = {
  "usr-001": [
    {
      id: "rev-1",
      autor: "Diego Ferreira",
      nota: 5,
      comentario: "Vendedora super atenciosa, material exatamente como descrito.",
      data: "ago. 2026",
    },
    {
      id: "rev-2",
      autor: "Ana Paula",
      nota: 5,
      comentario: "Entrega rápida dentro do campus, recomendo!",
      data: "jul. 2026",
    },
  ],
  "usr-002": [
    {
      id: "rev-3",
      autor: "Fernanda Dias",
      nota: 5,
      comentario: "Ótima negociação, muito educado e pontual.",
      data: "jun. 2026",
    },
    {
      id: "rev-4",
      autor: "Bruno Costa",
      nota: 4,
      comentario: "Material em bom estado, só demorou um pouco pra combinar horário.",
      data: "mai. 2026",
    },
  ],
  "usr-003": [
    {
      id: "rev-5",
      autor: "Larissa Prado",
      nota: 5,
      comentario: "Jaleco impecável, parecia novo!",
      data: "ago. 2026",
    },
  ],
  "usr-004": [
    {
      id: "rev-6",
      autor: "Pedro Henrique",
      nota: 5,
      comentario: "Kit completo e muito bem cuidado.",
      data: "jul. 2026",
    },
    {
      id: "rev-7",
      autor: "Juliana Alves",
      nota: 4,
      comentario: "Tudo certo, recomendo o vendedor.",
      data: "jun. 2026",
    },
  ],
  "usr-005": [
    {
      id: "rev-8",
      autor: "Marcos Vinícius",
      nota: 5,
      comentario: "Atlas em ótimo estado, negociação tranquila.",
      data: "mai. 2026",
    },
  ],
  "usr-006": [
    {
      id: "rev-9",
      autor: "Isabela Nunes",
      nota: 5,
      comentario: "Kit novo mesmo, super honesto na descrição.",
      data: "ago. 2026",
    },
  ],
};

export const getReviews = (id: string): Review[] => reviews[id] ?? [];

export const categories = [
  { nome: "Livros", simbolo: "📚" },
  { nome: "Calculadoras", simbolo: "🧮" },
  { nome: "Jalecos", simbolo: "🥼" },
  { nome: "Instrumentos", simbolo: "📐" },
  { nome: "Laboratório", simbolo: "🧪" },
];

export const courses = [...new Set(materials.map((material) => material.curso))].sort();
export const materialCategories = [
  ...new Set(materials.map((material) => material.categoria)),
].sort();
export const conditions: MaterialCondition[] = ["Novo", "Excelente", "Bom", "Regular"];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
