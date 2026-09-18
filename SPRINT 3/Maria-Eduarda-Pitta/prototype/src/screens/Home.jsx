// Tela: Página Inicial

function ScreenHome({ nav, state, actions }) {
  const [query, setQuery] = useState(state.homeQuery || '');
  const [openSheet, setOpenSheet] = useState(null); // 'curso' | 'categoria' | 'preco' | 'conservacao'

  const { filtros } = state;

  const materiais = state.materiais;

  const filtrados = useMemo(() => {
    let list = materiais.slice();
    // Busca por nome (título e também descrição/categoria/curso para melhor UX)
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(m =>
        m.titulo.toLowerCase().includes(q) ||
        m.descricao.toLowerCase().includes(q) ||
        m.curso.toLowerCase().includes(q) ||
        m.categoria.toLowerCase().includes(q)
      );
    }
    if (filtros.curso.length) list = list.filter(m => filtros.curso.includes(m.curso));
    if (filtros.categoria.length) list = list.filter(m => filtros.categoria.includes(m.categoria));
    if (filtros.conservacao.length) list = list.filter(m => filtros.conservacao.includes(m.estadoConservacao));
    if (filtros.preco.length) {
      list = list.filter(m => {
        return filtros.preco.some(fid => {
          const faixa = FAIXAS_PRECO.find(f => f.id === fid);
          if (!faixa) return true;
          return m.preco >= faixa.min && m.preco <= faixa.max;
        });
      });
    }
    // Disponíveis antes; vendidos depois
    list.sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === 'Disponível' ? -1 : 1;
    });
    return list;
  }, [materiais, query, filtros]);

  useEffect(() => {
    actions.setState(s => ({ ...s, homeQuery: query }));
  }, [query]);

  const totalFiltrosAtivos =
    filtros.curso.length + filtros.categoria.length + filtros.conservacao.length + filtros.preco.length;

  function limparTudo() {
    setQuery('');
    actions.setFiltros({ curso: [], categoria: [], preco: [], conservacao: [] });
  }

  return (
    <div className="screen" role="main" aria-label="Página Inicial">
      <TopBar showBrand onNotifications={() => nav.go('notif')} notifCount={state.notifCount} />

      <div className="screen-body">
        {/* Hero + busca */}
        <div className="home-hero">
          <div className="brand-line">
            <img src={window.__resources?.logoRepassa || "public/logo-repassa.png"} alt="Logo do REPASSA" />
            <div>
              <h1>REPASSA</h1>
              <p className="slogan">Materiais que continuam histórias</p>
            </div>
          </div>

          <div className="search-wrap search">
            <span className="search-icon"><IconSearch size={18} /></span>
            <input
              type="search"
              className="search-input"
              placeholder="O que você procura?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Pesquisar materiais"
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')} aria-label="Limpar busca">
                <IconX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="home-filters">
          <div className="chip-row" role="group" aria-label="Filtros">
            <FilterChip label="Curso" count={filtros.curso.length}
                        active={filtros.curso.length > 0}
                        onClick={() => setOpenSheet('curso')} />
            <FilterChip label="Categoria" count={filtros.categoria.length}
                        active={filtros.categoria.length > 0}
                        onClick={() => setOpenSheet('categoria')} />
            <FilterChip label="Preço" count={filtros.preco.length}
                        active={filtros.preco.length > 0}
                        onClick={() => setOpenSheet('preco')} />
            <FilterChip label="Conservação" count={filtros.conservacao.length}
                        active={filtros.conservacao.length > 0}
                        onClick={() => setOpenSheet('conservacao')} />
            {totalFiltrosAtivos > 0 && (
              <button className="chip" onClick={limparTudo} aria-label="Limpar todos os filtros">
                <IconX size={14} /> Limpar
              </button>
            )}
          </div>
        </div>

        {/* Seção */}
        <div className="section-header">
          <h2>{query || totalFiltrosAtivos ? 'Resultados' : 'Materiais recentes'}</h2>
          <span className="link" aria-live="polite">
            {filtrados.length} {filtrados.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        <div className="home-list">
          {filtrados.length === 0 ? (
            <EmptyState
              icon={<IconSearch size={30} />}
              title="Nenhum material encontrado"
              text={totalFiltrosAtivos || query
                ? 'Tente ajustar os filtros ou o termo da busca.'
                : 'Ainda não há materiais publicados.'}
              action={
                (totalFiltrosAtivos || query) &&
                <button className="btn btn-secondary btn-sm mt-3" onClick={limparTudo}>
                  Limpar filtros
                </button>
              }
            />
          ) : (
            filtrados.map(m => (
              <MaterialCard key={m.id} material={m} onOpen={(id) => nav.go('details', { id })} />
            ))
          )}
        </div>
      </div>

      <BottomNav active="home" onNavigate={(k) => nav.goTab(k)} />

      {/* Sheets de filtros */}
      <FilterSheet
        open={openSheet === 'curso'}
        title="Filtrar por curso"
        options={CURSOS}
        selected={filtros.curso}
        onApply={(v) => actions.setFiltros({ ...filtros, curso: v })}
        onClose={() => setOpenSheet(null)} />

      <FilterSheet
        open={openSheet === 'categoria'}
        title="Filtrar por categoria"
        options={CATEGORIAS}
        selected={filtros.categoria}
        onApply={(v) => actions.setFiltros({ ...filtros, categoria: v })}
        onClose={() => setOpenSheet(null)} />

      <FilterSheet
        open={openSheet === 'preco'}
        title="Faixa de preço"
        options={FAIXAS_PRECO.map(f => ({ value: f.id, label: f.label }))}
        selected={filtros.preco}
        onApply={(v) => actions.setFiltros({ ...filtros, preco: v })}
        onClose={() => setOpenSheet(null)} />

      <FilterSheet
        open={openSheet === 'conservacao'}
        title="Estado de conservação"
        options={CONSERVACOES}
        selected={filtros.conservacao}
        onApply={(v) => actions.setFiltros({ ...filtros, conservacao: v })}
        onClose={() => setOpenSheet(null)} />
    </div>
  );
}

window.ScreenHome = ScreenHome;
