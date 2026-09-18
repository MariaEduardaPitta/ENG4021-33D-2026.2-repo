// Telas complementares (placeholders funcionais + conversas + notificações + perfil)

function ScreenBuscar({ nav, state, actions }) {
  // Reaproveita a home focando no input
  useEffect(() => {
    setTimeout(() => document.querySelector('.search-input')?.focus(), 100);
  }, []);
  return <ScreenHome nav={nav} state={state} actions={actions} />;
}

function ScreenAnunciar({ nav }) {
  return (
    <div className="screen">
      <TopBar title="Anunciar material" showBack onBack={() => nav.back()} />
      <div className="screen-body">
        <div className="placeholder">
          <div className="ico"><IconPlusSquare size={36} /></div>
          <h2>Publique um material</h2>
          <p>Nesta primeira versão, o fluxo de criação de anúncio (fotos, título, descrição, curso, categoria, preço e conservação) está em desenvolvimento.</p>
          <button className="btn btn-primary btn-sm" onClick={() => nav.goTab('home')}>Voltar à home</button>
        </div>
      </div>
      <BottomNav active="anunciar" onNavigate={(k) => nav.goTab(k)} />
    </div>
  );
}

function ScreenConversas({ nav, state }) {
  const conversasMock = [
    { id: 'chat1', outro: acharUsuario('u1'), sobre: 'Calculadora científica', ultima: 'Oi! A calculadora ainda está disponível?', hora: '10:24' },
    { id: 'chat2', outro: acharUsuario('u2'), sobre: 'Jaleco branco tamanho M', ultima: 'Combinamos amanhã 14h no bloco A.', hora: 'Ontem' },
  ];
  return (
    <div className="screen">
      <TopBar title="Conversas" showBack={false} />
      <div className="screen-body">
        {conversasMock.length === 0 ? (
          <EmptyState icon={<IconMsg size={30} />} title="Nenhuma conversa"
                      text="Suas conversas com compradores e vendedores aparecerão aqui." />
        ) : (
          <div className="chat-list">
            {conversasMock.map(c => (
              <button key={c.id} className="chat-item" style={{ background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
                      onClick={() => nav.go('chat', { id: c.id })}>
                <div className="avatar">{iniciais(c.outro.nome)}</div>
                <div className="info">
                  <div className="name">{c.outro.nome}</div>
                  <div className="last">{c.ultima}</div>
                  <div className="subject">{c.sobre}</div>
                </div>
                <div className="last" style={{ marginTop: 0, fontSize: 11 }}>{c.hora}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNav active="conversas" onNavigate={(k) => nav.goTab(k)} />
    </div>
  );
}

function ScreenChat({ nav, params }) {
  const chats = {
    chat1: { outro: acharUsuario('u1'), sobre: 'Calculadora científica' },
    chat2: { outro: acharUsuario('u2'), sobre: 'Jaleco branco tamanho M' },
  };
  const c = chats[params.id] || chats.chat1;
  return (
    <div className="screen">
      <TopBar title={c.outro.nome} showBack onBack={() => nav.back()} />
      <div className="screen-body no-bottomnav" style={{ padding: 16 }}>
        <div style={{
          background: 'var(--lilas-claro)', color: 'var(--roxo-escuro)',
          padding: '8px 12px', borderRadius: 12, fontSize: 12, textAlign: 'center', marginBottom: 12
        }}>Sobre: {c.sobre}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ alignSelf: 'flex-start', background: 'var(--branco)', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', maxWidth: '80%', fontSize: 14, boxShadow: 'var(--shadow-card)' }}>
            Oi! Ainda tenho o material, sim. Está disponível!
          </div>
          <div style={{ alignSelf: 'flex-end', background: 'var(--roxo-principal)', color: 'white', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', maxWidth: '80%', fontSize: 14 }}>
            Ótimo! Posso passar para retirar amanhã?
          </div>
        </div>
      </div>
      <div style={{ padding: 12, borderTop: '1px solid var(--cinza-claro)', background: 'var(--branco)', display: 'flex', gap: 8 }}>
        <input className="field-input" placeholder="Escreva uma mensagem…" style={{ flex: 1 }} />
        <button className="btn btn-primary btn-sm">Enviar</button>
      </div>
    </div>
  );
}

function ScreenNotif({ nav }) {
  const items = [
    { id: 'n1', kind: 'info',    icon: IconMsg,    titulo: 'Nova mensagem de Mariana',   sub: 'Sobre: Calculadora científica',   hora: 'Agora' },
    { id: 'n2', kind: 'sucesso', icon: IconCheck,  titulo: 'Pagamento aprovado',         sub: 'Compra de Jaleco branco tamanho M', hora: '2h atrás' },
    { id: 'n3', kind: 'atencao', icon: IconTruck,  titulo: 'Entrega em andamento',       sub: 'Livro Introdução à Psicologia',   hora: 'Ontem' },
  ];
  const bg = {
    info: 'var(--lilas-claro)', sucesso: 'var(--verde-fundo)', atencao: 'var(--ambar-fundo)', erro: 'var(--vermelho-fundo)'
  };
  const fg = {
    info: 'var(--roxo-principal)', sucesso: 'var(--verde)', atencao: '#B7770B', erro: 'var(--vermelho)'
  };
  return (
    <div className="screen">
      <TopBar title="Notificações" showBack onBack={() => nav.back()} />
      <div className="screen-body">
        <div className="notif-list">
          {items.map(n => {
            const IconC = n.icon;
            return (
              <div key={n.id} className="notif-item">
                <div className="n-icon" style={{ background: bg[n.kind], color: fg[n.kind] }}>
                  <IconC size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="n-title">{n.titulo}</div>
                  <div className="n-sub">{n.sub}</div>
                  <div className="n-time">{n.hora}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav active="home" onNavigate={(k) => nav.goTab(k)} />
    </div>
  );
}

function ScreenPerfil({ nav, state }) {
  const me = acharUsuario(USUARIO_LOGADO_ID);
  const minhasCompras = state.compras.length;
  const favoritos = state.favoritos.length;
  return (
    <div className="screen">
      <TopBar title="Perfil" showBack={false} />
      <div className="screen-body">
        <div style={{ padding: 20, background: 'linear-gradient(135deg, var(--roxo-escuro), var(--roxo-principal))', color: 'white', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="avatar" style={{ width: 64, height: 64, fontSize: 22, background: 'rgba(255,255,255,0.2)' }}>
            {iniciais(me.nome)}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 20 }}>{me.nome}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{me.instituicao} · {me.curso}</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 3 }}>{me.periodo}º período</div>
          </div>
        </div>

        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <StatCell label="Compras" value={minhasCompras} onClick={() => {}} />
          <StatCell label="Vendas" value={0} onClick={() => {}} />
          <StatCell label="Favoritos" value={favoritos} onClick={() => {}} />
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <MenuLink icon={<IconTag size={20} />} label="Meus anúncios" onClick={() => {}} />
          <MenuLink icon={<IconCart size={20} />} label="Minhas compras" onClick={() => {}} />
          <MenuLink icon={<IconHeart size={20} />} label="Favoritos" onClick={() => {}} />
          <MenuLink icon={<IconStar size={20} />} label="Avaliações recebidas" onClick={() => {}} />
          <MenuLink icon={<IconUser size={20} />} label="Editar dados" onClick={() => {}} />
          <MenuLink icon={<IconDots size={20} />} label="Configurações" onClick={() => {}} />
        </div>
      </div>
      <BottomNav active="perfil" onNavigate={(k) => nav.goTab(k)} />
    </div>
  );
}

function StatCell({ label, value, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'var(--branco)', borderRadius: 12, padding: '14px 8px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      boxShadow: 'var(--shadow-card)', textAlign: 'center'
    }}>
      <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 20, color: 'var(--roxo-escuro)' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--cinza)' }}>{label}</div>
    </button>
  );
}
function MenuLink({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px',
      background: 'var(--branco)', borderRadius: 12, textAlign: 'left', color: 'var(--grafite)',
      boxShadow: 'var(--shadow-card)'
    }}>
      <span style={{ color: 'var(--roxo-principal)' }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</span>
      <IconArrowRight size={16} />
    </button>
  );
}

Object.assign(window, {
  ScreenBuscar, ScreenAnunciar, ScreenConversas, ScreenChat, ScreenNotif, ScreenPerfil,
});
