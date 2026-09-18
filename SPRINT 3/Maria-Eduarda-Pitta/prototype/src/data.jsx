// REPASSA — Dados fictícios coerentes com contexto universitário (sem Lorem ipsum)
// Todos os IDs são internos e nunca exibidos na UI.

const USUARIOS = [
  {
    id: 'u1',
    nome: 'Mariana Souza',
    email: 'mariana.souza@exemplo.edu.br',
    instituicao: 'PUC-Rio',
    curso: 'Engenharia de Produção',
    periodo: 6,
    whatsapp: '(21) 99876-5432',
    notaMedia: 4.8,
  },
  {
    id: 'u2',
    nome: 'João Pedro Almeida',
    email: 'joao.almeida@exemplo.edu.br',
    instituicao: 'UFRJ',
    curso: 'Medicina',
    periodo: 4,
    whatsapp: '(21) 99123-4567',
    notaMedia: 4.9,
  },
  {
    id: 'u3',
    nome: 'Camila Nogueira',
    email: 'camila.nog@exemplo.edu.br',
    instituicao: 'UERJ',
    curso: 'Psicologia',
    periodo: 5,
    whatsapp: '(21) 98765-4321',
    notaMedia: 4.7,
  },
  {
    id: 'u4',
    nome: 'Rafael Lima',
    email: 'rafael.lima@exemplo.edu.br',
    instituicao: 'UFF',
    curso: 'Arquitetura e Urbanismo',
    periodo: 7,
    whatsapp: '(21) 99555-1122',
    notaMedia: 4.6,
  },
  {
    id: 'u5',
    nome: 'Lucas Ferreira',
    email: 'lucas.ferreira@exemplo.edu.br',
    instituicao: 'UFRJ',
    curso: 'Ciência da Computação',
    periodo: 8,
    whatsapp: '(21) 98111-2233',
    notaMedia: 5.0,
  },
  {
    // usuário logado (você)
    id: 'me',
    nome: 'Beatriz Alves',
    email: 'beatriz.alves@exemplo.edu.br',
    instituicao: 'PUC-Rio',
    curso: 'Engenharia de Produção',
    periodo: 6,
    whatsapp: '(21) 99000-1111',
    notaMedia: null, // sem avaliações ainda
  },
];

const USUARIO_LOGADO_ID = 'me';

const MATERIAIS_SEED = [
  {
    id: 'm1',
    titulo: 'Calculadora científica',
    descricao: 'Calculadora Casio fx-991ES Plus, usada poucas vezes. Estou vendendo porque troquei de curso e não preciso mais. Todas as funções em perfeito estado.',
    preco: 85.0,
    precoNovo: 140.0,
    estadoConservacao: 'Bom',
    foto: 'calculadora',
    curso: 'Engenharia',
    categoria: 'Calculadoras',
    status: 'Disponível',
    idVendedor: 'u1',
  },
  {
    id: 'm2',
    titulo: 'Jaleco branco tamanho M',
    descricao: 'Jaleco branco manga longa, tamanho M. Usado por dois semestres no curso de Medicina. Sem manchas ou defeitos, higienizado recentemente.',
    preco: 55.0,
    precoNovo: 90.0,
    estadoConservacao: 'Bom',
    foto: 'jaleco',
    curso: 'Medicina',
    categoria: 'Uniforme',
    status: 'Disponível',
    idVendedor: 'u2',
  },
  {
    id: 'm3',
    titulo: 'Livro Introdução à Psicologia — Feldman',
    descricao: 'Livro didático "Introdução à Psicologia" de Robert Feldman, 10ª edição. Poucas marcações a lápis, capa preservada.',
    preco: 76.0,
    precoNovo: 100.0,
    estadoConservacao: 'Bom',
    foto: 'livro-psico',
    curso: 'Psicologia',
    categoria: 'Livros',
    status: 'Disponível',
    idVendedor: 'u3',
  },
  {
    id: 'm4',
    titulo: 'Prancheta A2 com régua paralela',
    descricao: 'Prancheta profissional formato A2 com régua paralela em ótimo estado. Ideal para primeiros semestres de Arquitetura.',
    preco: 120.0,
    precoNovo: 220.0,
    estadoConservacao: 'Excelente',
    foto: 'prancheta',
    curso: 'Arquitetura e Urbanismo',
    categoria: 'Papelaria',
    status: 'Disponível',
    idVendedor: 'u4',
  },
  {
    id: 'm5',
    titulo: 'Livro Estruturas de Dados — Ziviani',
    descricao: 'Livro "Projeto de Algoritmos" do Nívio Ziviani. Todo o conteúdo intacto, algumas anotações a lápis nos primeiros capítulos.',
    preco: 60.0,
    precoNovo: 130.0,
    estadoConservacao: 'Bom',
    foto: 'livro-ed',
    curso: 'Ciência da Computação',
    categoria: 'Livros',
    status: 'Vendido',
    idVendedor: 'u5',
  },
  {
    id: 'm6',
    titulo: 'Escalímetro triangular 30 cm',
    descricao: 'Escalímetro triangular Trident, 30 cm, escalas 1:20 a 1:125. Novo, usado apenas em duas aulas.',
    preco: 25.0,
    precoNovo: 45.0,
    estadoConservacao: 'Novo',
    foto: 'escalimetro',
    curso: 'Arquitetura e Urbanismo',
    categoria: 'Papelaria',
    status: 'Disponível',
    idVendedor: 'u4',
  },
  {
    id: 'm7',
    titulo: 'Kit anatomia — Ossos didáticos',
    descricao: 'Kit de ossos didáticos em resina para estudo de anatomia. Inclui ossos das mãos e pés. Utilizado em disciplinas do primeiro ciclo.',
    preco: 180.0,
    precoNovo: 320.0,
    estadoConservacao: 'Excelente',
    foto: 'anatomia',
    curso: 'Medicina',
    categoria: 'Instrumentos',
    status: 'Disponível',
    idVendedor: 'u2',
  },
  {
    id: 'm8',
    titulo: 'Vade Mecum Saraiva 2024',
    descricao: 'Vade Mecum Saraiva 2024, capa dura. Praticamente sem uso, apenas dois marcadores coloridos em páginas específicas.',
    preco: 90.0,
    precoNovo: 180.0,
    estadoConservacao: 'Excelente',
    foto: 'vademecum',
    curso: 'Direito',
    categoria: 'Livros',
    status: 'Disponível',
    idVendedor: 'u3',
  },
];

// Listas para filtros
const CURSOS = [
  'Engenharia',
  'Medicina',
  'Psicologia',
  'Arquitetura e Urbanismo',
  'Direito',
  'Ciência da Computação',
  'Administração',
  'Design',
];
const CATEGORIAS = [
  'Livros',
  'Calculadoras',
  'Uniforme',
  'Papelaria',
  'Instrumentos',
  'Eletrônicos',
  'Apostilas',
  'Outros',
];
const CONSERVACOES = ['Novo', 'Excelente', 'Bom', 'Regular'];

const FAIXAS_PRECO = [
  { id: 'p0-50', label: 'Até R$ 50', min: 0, max: 50 },
  { id: 'p50-100', label: 'R$ 50 a R$ 100', min: 50, max: 100 },
  { id: 'p100-200', label: 'R$ 100 a R$ 200', min: 100, max: 200 },
  { id: 'p200+', label: 'Acima de R$ 200', min: 200, max: Infinity },
];

// Helpers
function fmtBRL(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function acharUsuario(id) {
  return USUARIOS.find(u => u.id === id);
}
function iniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
}

// Expor globalmente para os outros scripts babel
Object.assign(window, {
  USUARIOS,
  USUARIO_LOGADO_ID,
  MATERIAIS_SEED,
  CURSOS,
  CATEGORIAS,
  CONSERVACOES,
  FAIXAS_PRECO,
  fmtBRL,
  acharUsuario,
  iniciais,
});
