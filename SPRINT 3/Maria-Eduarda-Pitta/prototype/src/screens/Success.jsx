// Tela: Compra Confirmada (sucesso)

function ScreenSuccess({ nav, state, params }) {
  const compra = state.compras.find(c => c.id === params.compraId);
  const material = state.materiais.find(m => m.id === params.materialId);
  const pagamento = state.pagamentos.find(p => p.idCompra === params.compraId);
  const vendedor = material ? acharUsuario(material.idVendedor) : null;

  return (
    <div className="screen" role="main" aria-label="Compra confirmada">
      <TopBar title="Pedido confirmado" showBack={false} right={<div style={{ width: 40 }} />} showBrand={false} />

      <div className="screen-body no-bottomnav">
        <div className="success-screen">
          <div className="success-mark" aria-hidden="true">
            <IconCheck size={48} strokeWidth={3} />
          </div>
          <h1>Compra confirmada!</h1>
          <p>Sua compra foi registrada com sucesso. Combine os últimos detalhes com o vendedor pelo chat.</p>

          {compra && material && (
            <div className="success-recap" role="group" aria-label="Resumo da compra">
              <div className="row-line"><span className="k">Material</span><span className="v">{material.titulo}</span></div>
              <div className="row-line"><span className="k">Vendedor</span><span className="v">{vendedor?.nome}</span></div>
              <div className="row-line"><span className="k">Forma de entrega</span><span className="v">{compra.formaEntrega}</span></div>
              <div className="row-line"><span className="k">Endereço/local</span><span className="v">{compra.enderecoLocalEntrega}</span></div>
              <div className="row-line"><span className="k">Pagamento</span><span className="v">{pagamento?.formaPagamento} · Aprovado</span></div>
              <div className="row-line"><span className="k">Total</span><span className="v" style={{ color: 'var(--coral)' }}>{fmtBRL(compra.valorTotal)}</span></div>
              <div className="row-line"><span className="k">Data da compra</span><span className="v">{new Date(compra.dataCompra).toLocaleString('pt-BR')}</span></div>
              <div className="row-line"><span className="k">Status da entrega</span><span className="v"><span className="badge badge-ambar"><IconAlert size={12} /> AGUARDANDO</span></span></div>
            </div>
          )}

          <div className="success-actions">
            <button className="btn btn-primary btn-full" onClick={() => nav.goTab('conversas')}>
              <IconChat size={18} /> Falar com o vendedor
            </button>
            <button className="btn btn-secondary btn-full" onClick={() => nav.goTab('home')}>
              Voltar à página inicial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScreenSuccess = ScreenSuccess;
