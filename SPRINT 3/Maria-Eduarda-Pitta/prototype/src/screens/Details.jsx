// Tela: Detalhes do Material

function ScreenDetails({ nav, state, actions, params, toast }) {
  const material = state.materiais.find(m => m.id === params.id);
  if (!material) {
    return (
      <div className="screen">
        <TopBar title="Detalhes" showBack onBack={() => nav.back()} />
        <div className="screen-body">
          <EmptyState
            icon={<IconAlert size={28} />}
            title="Material não encontrado"
            text="Este anúncio pode ter sido removido pelo vendedor."
            action={<button className="btn btn-primary btn-sm mt-3" onClick={() => nav.goTab('home')}>Voltar para a Home</button>}
          />
        </div>
        <BottomNav active="home" onNavigate={(k) => nav.goTab(k)} />
      </div>
    );
  }

  const vendedor = acharUsuario(material.idVendedor);
  const souAutor = material.idVendedor === USUARIO_LOGADO_ID;
  const isSold = material.status === 'Vendido';
  const isFav = state.favoritos.includes(material.id);

  function toggleFav() {
    if (isFav) {
      actions.setFavoritos(state.favoritos.filter(id => id !== material.id));
      toast.info('Removido dos favoritos');
    } else {
      actions.setFavoritos([...state.favoritos, material.id]);
      toast.sucesso('Adicionado aos favoritos');
    }
  }

  function abrirCompra() {
    if (isSold) { toast.erro('Este material já foi vendido.'); return; }
    if (souAutor) { toast.erro('Você não pode comprar o próprio anúncio.'); return; }
    nav.go('checkout', { id: material.id });
  }
  function conversar() {
    if (souAutor) { toast.erro('Você não pode conversar sobre o seu próprio anúncio.'); return; }
    toast.info('Abrindo conversa com ' + vendedor.nome.split(' ')[0] + '...');
    setTimeout(() => nav.goTab('conversas'), 500);
  }

  return (
    <div className="screen" role="main" aria-label={`Detalhes de ${material.titulo}`}>
      <TopBar title="Detalhes do material" showBack onBack={() => nav.back()}
              onNotifications={() => nav.go('notif')} notifCount={state.notifCount} />

      <div className="screen-body">
        <div className="details-hero">
          <div className="details-photo-wrap">
            <div className="material-photo large">
              <PhotoPlaceholder tipo={material.foto} label="Foto do produto" />
            </div>
            <button className={`fav-btn ${isFav ? 'active' : ''}`}
                    onClick={toggleFav}
                    aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar'}
                    aria-pressed={isFav}>
              {isFav ? <IconHeartFill size={20} /> : <IconHeart size={20} />}
            </button>
          </div>
        </div>

        <div className="details-block">
          <h1 className="details-title">{material.titulo}</h1>
          <div className="details-price">
            {fmtBRL(material.preco)}
            {material.precoNovo != null && (
              <span className="old">novo: {fmtBRL(material.precoNovo)}</span>
            )}
          </div>
          <div className="details-meta">
            {material.estadoConservacao} estado · {material.curso} · {material.categoria}
          </div>
          <div className="details-status-row">
            <StatusBadge status={material.status} />
            {souAutor && <span className="badge badge-roxo">SEU ANÚNCIO</span>}
          </div>
        </div>

        <div className="details-section">
          <h3>Descrição</h3>
          <p>{material.descricao}</p>
        </div>

        <div className="details-section">
          <h3>Vendedor</h3>
          <div className="seller-row">
            <div className="avatar" aria-hidden="true">{iniciais(vendedor.nome)}</div>
            <div className="seller-info">
              <div className="seller-name">{vendedor.nome}</div>
              <div className="seller-rating">
                {vendedor.notaMedia != null ? (
                  <>
                    <span className="star"><IconStar size={13} /></span>
                    <span>{vendedor.notaMedia.toFixed(1).replace('.', ',')}</span>
                    <span>·</span>
                    <span>{vendedor.instituicao} — {vendedor.curso}</span>
                  </>
                ) : (
                  <span>{vendedor.instituicao} — {vendedor.curso}</span>
                )}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm"
                    onClick={() => toast.info('Perfil de ' + vendedor.nome.split(' ')[0] + ' — em breve.')}>
              Ver perfil
            </button>
          </div>
        </div>

        {isSold && !souAutor && (
          <div style={{ padding: '0 var(--sp-4)', marginTop: 12 }}>
            <Banner kind="atencao">
              Este material já foi vendido e não está mais disponível para compra.
            </Banner>
          </div>
        )}

        {/* Ações */}
        {souAutor ? (
          <div className="owner-actions" role="group" aria-label="Ações do autor">
            <button className="btn btn-secondary btn-full"
                    onClick={() => toast.info('Edição de anúncio — em breve.')}>
              Editar anúncio
            </button>
            {material.status === 'Disponível' && (
              <button className="btn btn-primary btn-full"
                      onClick={() => {
                        actions.marcarComoVendido(material.id);
                        toast.sucesso('Anúncio marcado como Vendido.');
                      }}>
                <IconCheck size={18} strokeWidth={2.6} /> Marcar como Vendido
              </button>
            )}
            <button className="btn btn-destructive btn-full"
                    onClick={() => toast.atencao('Exclusão exige confirmação — recurso disponível em Meus Anúncios.')}>
              Excluir anúncio
            </button>
          </div>
        ) : (
          <div className="details-actions">
            <button className="btn btn-secondary btn-full"
                    onClick={conversar}
                    aria-label="Conversar com vendedor">
              <IconChat size={18} /> Conversar
            </button>
            <button className="btn btn-primary btn-full"
                    onClick={abrirCompra}
                    disabled={isSold}
                    aria-label={isSold ? 'Material indisponível: vendido' : 'Comprar material'}>
              {isSold ? <><IconX size={18} strokeWidth={2.6} /> Indisponível</>
                      : <><IconCart size={18} /> Comprar</>}
            </button>
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>

      <BottomNav active="home" onNavigate={(k) => nav.goTab(k)} />
    </div>
  );
}

window.ScreenDetails = ScreenDetails;
