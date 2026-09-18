// App principal — roteamento em memória + estado central

function App() {
  // Roteamento em memória, com pilha para voltar
  const [stack, setStack] = useState(() => {
    try {
      const raw = localStorage.getItem('repassa.route');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [{ screen: 'home', params: {} }];
  });
  const current = stack[stack.length - 1];

  useEffect(() => {
    try { localStorage.setItem('repassa.route', JSON.stringify(stack)); } catch (_) {}
  }, [stack]);

  // Estado global (materiais, filtros, favoritos, compras)
  const [state, setStateRaw] = useState(() => {
    let saved = null;
    try {
      const raw = localStorage.getItem('repassa.state');
      if (raw) saved = JSON.parse(raw);
    } catch (_) {}
    return {
      materiais: saved?.materiais || MATERIAIS_SEED.slice(),
      favoritos: saved?.favoritos || [],
      compras: saved?.compras || [],
      pagamentos: saved?.pagamentos || [],
      avaliacoes: saved?.avaliacoes || [],
      filtros: saved?.filtros || { curso: [], categoria: [], preco: [], conservacao: [] },
      notifCount: saved?.notifCount ?? 3,
      homeQuery: saved?.homeQuery || '',
    };
  });

  useEffect(() => {
    try { localStorage.setItem('repassa.state', JSON.stringify(state)); } catch (_) {}
  }, [state]);

  function setState(updater) {
    setStateRaw(prev => typeof updater === 'function' ? updater(prev) : updater);
  }

  // Toasts
  const toast = useToasts();

  // Nav helpers
  const nav = {
    go(screen, params = {}) {
      setStack(prev => [...prev, { screen, params }]);
      // sobe scroll ao entrar em tela nova
      setTimeout(() => {
        document.querySelector('.screen-body')?.scrollTo?.({ top: 0, behavior: 'instant' });
      }, 0);
    },
    // Muda de aba pela bottom nav: reseta a pilha para aquela aba
    goTab(tab) {
      const map = {
        home: 'home',
        buscar: 'buscar',
        anunciar: 'anunciar',
        conversas: 'conversas',
        perfil: 'perfil',
      };
      setStack([{ screen: map[tab] || 'home', params: {} }]);
    },
    back() {
      setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
    },
    reset() {
      setStack([{ screen: 'home', params: {} }]);
    }
  };

  // Actions do estado
  const actions = {
    setState,
    setFiltros(f) { setState(s => ({ ...s, filtros: f })); },
    setFavoritos(list) { setState(s => ({ ...s, favoritos: list })); },
    marcarComoVendido(materialId) {
      setState(s => ({
        ...s,
        materiais: s.materiais.map(m => m.id === materialId ? { ...m, status: 'Vendido' } : m),
      }));
    },
    finalizarCompra(compra, pagamento) {
      setState(s => ({
        ...s,
        compras: [...s.compras, compra],
        pagamentos: [...s.pagamentos, pagamento],
        // Regra RN09/RF29: com pagamento aprovado, o material já vira Vendido para bloquear novas compras.
        materiais: s.materiais.map(m => m.id === compra.idMaterial ? { ...m, status: 'Vendido' } : m),
        notifCount: (s.notifCount || 0) + 1,
      }));
    },
    resetarDemo() {
      localStorage.removeItem('repassa.state');
      localStorage.removeItem('repassa.route');
      window.location.reload();
    }
  };

  // Renderiza tela corrente
  function renderScreen() {
    const p = { nav, state, actions, params: current.params, toast };
    switch (current.screen) {
      case 'home':      return <ScreenHome {...p} />;
      case 'buscar':    return <ScreenBuscar {...p} />;
      case 'details':   return <ScreenDetails {...p} />;
      case 'checkout':  return <ScreenCheckout {...p} />;
      case 'success':   return <ScreenSuccess {...p} />;
      case 'anunciar':  return <ScreenAnunciar {...p} />;
      case 'conversas': return <ScreenConversas {...p} />;
      case 'chat':      return <ScreenChat {...p} />;
      case 'notif':     return <ScreenNotif {...p} />;
      case 'perfil':    return <ScreenPerfil {...p} />;
      default:          return <ScreenHome {...p} />;
    }
  }

  return (
    <div className="stage">
      {/* Painel lateral só aparece em desktop grande (via CSS) */}
      <aside className="desktop-panel" aria-hidden="true">
        <span className="brand">REPASSA · Protótipo funcional</span>
        <h1>Materiais que continuam histórias.</h1>
        <p>
          Marketplace universitário de materiais acadêmicos usados. Fluxo funcional: Página Inicial →
          Detalhes → Compra → Confirmação. Layout otimizado para celular, com moldura simulada aqui no
          desktop.
        </p>
        <div className="swatches">
          <div className="sw" style={{ background: '#7C3AED' }} />
          <div className="sw" style={{ background: '#5B21B6' }} />
          <div className="sw" style={{ background: '#F3E8FF' }} />
          <div className="sw" style={{ background: '#FF6B5E' }} />
          <div className="sw" style={{ background: '#22A06B' }} />
          <div className="sw" style={{ background: '#F59E0B' }} />
          <div className="sw" style={{ background: '#DC3545' }} />
        </div>
        <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 12 }}
                onClick={actions.resetarDemo}>
          Reiniciar demo
        </button>
      </aside>

      <div className="app-shell" role="application" aria-label="Aplicativo REPASSA">
        {renderScreen()}
        <ToastStack toasts={toast.toasts} />
      </div>

      <aside className="desktop-panel" aria-hidden="true">
        <span className="brand">Teste o fluxo prioritário</span>
        <p>
          <strong style={{ color: '#F3E8FF' }}>1.</strong> Toque em um material na Home.<br/>
          <strong style={{ color: '#F3E8FF' }}>2.</strong> Em Detalhes, toque em <em>Comprar</em>.<br/>
          <strong style={{ color: '#F3E8FF' }}>3.</strong> Escolha entrega, endereço e pagamento.<br/>
          <strong style={{ color: '#F3E8FF' }}>4.</strong> Marque “Revisei” e confirme.
        </p>
        <p style={{ marginTop: 8 }}>
          Um material já cadastrado como <strong style={{ color: '#F3E8FF' }}>Vendido</strong> ("Estruturas de
          Dados") demonstra o bloqueio de compra.
        </p>
      </aside>
    </div>
  );
}

// Boot
const rootEl = document.getElementById('root');
ReactDOM.createRoot(rootEl).render(<App />);
