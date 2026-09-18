// Tela: Finalização da Compra

function ScreenCheckout({ nav, state, actions, params, toast }) {
  const material = state.materiais.find(m => m.id === params.id);

  // Se o material sumiu ou já é vendido / é do próprio usuário, sai imediatamente
  useEffect(() => {
    if (!material) { toast.erro('Material não encontrado.'); nav.back(); return; }
    if (material.status === 'Vendido') { toast.erro('Este material acabou de ser vendido.'); nav.go('details', { id: material.id }); }
    if (material.idVendedor === USUARIO_LOGADO_ID) { toast.erro('Você não pode comprar o próprio anúncio.'); nav.back(); }
  }, [material?.id, material?.status]);

  if (!material) return null;

  const vendedor = acharUsuario(material.idVendedor);
  const comprador = acharUsuario(USUARIO_LOGADO_ID);

  const [entrega, setEntrega] = useState(null); // 'retirada' | 'endereco'
  const [endereco, setEndereco] = useState('');
  const [enderecoTocado, setEnderecoTocado] = useState(false);
  const [pagamento, setPagamento] = useState(null); // 'pix' | 'cartao' | 'dinheiro'
  const [revisado, setRevisado] = useState(false);
  const [processando, setProcessando] = useState(false);

  const VALOR_ENTREGA_ENDERECO = 5.0;
  const subtotal = material.preco;
  const valorEntrega = entrega === 'endereco' ? VALOR_ENTREGA_ENDERECO : (entrega === 'retirada' ? 0 : 0);
  const total = subtotal + valorEntrega;

  // Validação do campo endereço
  function validarEndereco() {
    if (!entrega) return { ok: false, msg: null }; // ainda não escolheu entrega
    const v = endereco.trim();
    if (v.length < 5) return { ok: false, msg: entrega === 'endereco' ? 'Informe o endereço completo.' : 'Informe o local combinado.' };
    if (entrega === 'endereco') {
      const temNumero = /\d/.test(v);
      const palavras = v.split(/\s+/).filter(Boolean).length;
      if (!temNumero) return { ok: false, msg: 'Informe rua e número.' };
      if (palavras < 2) return { ok: false, msg: 'Digite um endereço mais completo.' };
    }
    return { ok: true, msg: null };
  }
  const endValid = validarEndereco();
  const enderecoObrigatorio = !!entrega;
  const mostrarErroEndereco = enderecoObrigatorio && enderecoTocado && !endValid.ok && endereco.length > 0;

  const formValido = !!entrega && endValid.ok && !!pagamento;
  const podeConfirmar = formValido && revisado && !processando;

  function nomePagamento(p) {
    return p === 'pix' ? 'Pix' : p === 'cartao' ? 'Cartão' : 'Dinheiro';
  }
  function nomeEntrega(e) {
    return e === 'retirada' ? 'Retirada em local combinado' : 'Entrega em endereço';
  }

  function confirmar() {
    if (!podeConfirmar) return;
    // Verificar se acabou de ser vendido
    const atual = state.materiais.find(m => m.id === material.id);
    if (!atual || atual.status === 'Vendido') {
      toast.erro('Este material acabou de ser vendido.');
      nav.go('details', { id: material.id });
      return;
    }

    setProcessando(true);
    // Simular processamento de pagamento 1,2s
    setTimeout(() => {
      // Cria compra + pagamento + marca material como vendido
      const dataCompra = new Date();
      const compra = {
        id: 'c' + Date.now(),
        idComprador: USUARIO_LOGADO_ID,
        idMaterial: material.id,
        dataCompra: dataCompra.toISOString(),
        valorTotal: total,
        formaEntrega: nomeEntrega(entrega),
        enderecoLocalEntrega: endereco.trim(),
        statusEntrega: 'Aguardando entrega',
      };
      const pag = {
        id: 'p' + Date.now(),
        idCompra: compra.id,
        formaPagamento: nomePagamento(pagamento),
        valor: total,
        data: dataCompra.toISOString(),
        statusPagamento: 'Aprovado',
      };
      actions.finalizarCompra(compra, pag);
      setProcessando(false);
      nav.go('success', { compraId: compra.id, materialId: material.id });
    }, 1200);
  }

  return (
    <div className="screen" role="main" aria-label="Finalização da compra">
      <TopBar title="Finalizar compra" showBack onBack={() => nav.back()}
              onNotifications={() => nav.go('notif')} notifCount={state.notifCount} />

      <div className="screen-body" style={{ paddingBottom: 24 }}>
        {/* Resumo */}
        <div className="checkout-section">
          <div className="section-title">
            <span className="num">1</span> Resumo do pedido
          </div>
          <div className="order-summary">
            <div className="material-photo">
              <PhotoPlaceholder tipo={material.foto} label="Foto" />
            </div>
            <div className="summary-info">
              <div className="summary-title">{material.titulo}</div>
              <div className="summary-meta">
                {material.estadoConservacao} estado · {material.curso} · {material.categoria}
              </div>
              <div className="summary-price">{fmtBRL(material.preco)}</div>
            </div>
          </div>

          <div className="divider" />

          <div className="parties">
            <div className="party-row">
              <span className="label">Comprador</span>
              <span className="value">{comprador.nome}</span>
            </div>
            <div className="party-row">
              <span className="label">Vendedor</span>
              <span className="value">
                {vendedor.nome}
                {vendedor.notaMedia != null && (
                  <span style={{ color: 'var(--cinza)', fontWeight: 500, marginLeft: 6 }}>
                    · ★ {vendedor.notaMedia.toFixed(1).replace('.', ',')}
                  </span>
                )}
              </span>
            </div>
            <div className="party-row">
              <span className="label">Valor</span>
              <span className="value" style={{ color: 'var(--coral)' }}>{fmtBRL(material.preco)}</span>
            </div>
          </div>
        </div>

        {/* Forma de entrega */}
        <div className="checkout-section">
          <div className="section-title">
            <span className="num">2</span> Forma de entrega
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} role="radiogroup" aria-label="Forma de entrega">
            <RadioCard
              selected={entrega === 'retirada'}
              onClick={() => setEntrega('retirada')}
              title="Retirada em local combinado"
              sub="Combine ponto e horário com o vendedor · sem custo"
              icon={<IconMapPin size={20} />}
            />
            <RadioCard
              selected={entrega === 'endereco'}
              onClick={() => setEntrega('endereco')}
              title="Entrega em endereço"
              sub={`Envio ao endereço informado · ${fmtBRL(VALOR_ENTREGA_ENDERECO)}`}
              icon={<IconTruck size={20} />}
            />
          </div>

          {entrega && (
            <div className="field mt-4">
              <label className="field-label field-required" htmlFor="endereco">
                {entrega === 'endereco' ? 'Endereço de entrega' : 'Local combinado'}
              </label>
              <textarea
                id="endereco"
                className={`field-input ${mostrarErroEndereco ? 'error' : ''}`}
                rows={2}
                placeholder={entrega === 'endereco'
                  ? 'Ex.: Rua Marquês de São Vicente, 225 — Gávea — Rio de Janeiro/RJ'
                  : 'Ex.: em frente ao bloco A do campus, terça-feira às 15h'}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                onBlur={() => setEnderecoTocado(true)}
                aria-required="true"
                aria-invalid={mostrarErroEndereco ? 'true' : 'false'}
                aria-describedby={mostrarErroEndereco ? 'endereco-err' : undefined}
              />
              {mostrarErroEndereco ? (
                <div id="endereco-err" className="field-error" role="alert">
                  <IconAlert size={14} /> {endValid.msg}
                </div>
              ) : (
                <div className="field-hint">
                  {entrega === 'endereco'
                    ? 'Informe rua, número, bairro e cidade.'
                    : 'Descreva o ponto de encontro e horário.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Forma de pagamento */}
        <div className="checkout-section">
          <div className="section-title">
            <span className="num">3</span> Forma de pagamento
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} role="radiogroup" aria-label="Forma de pagamento">
            <RadioCard
              selected={pagamento === 'pix'}
              onClick={() => setPagamento('pix')}
              title="Pix"
              sub="Confirmação imediata"
              icon={<IconPix size={20} />}
            />
            <RadioCard
              selected={pagamento === 'cartao'}
              onClick={() => setPagamento('cartao')}
              title="Cartão"
              sub="Crédito ou débito"
              icon={<IconCard size={20} />}
            />
            <RadioCard
              selected={pagamento === 'dinheiro'}
              onClick={() => setPagamento('dinheiro')}
              title="Dinheiro"
              sub="Pagar ao vendedor na entrega ou retirada"
              icon={<IconCash size={20} />}
            />
          </div>
        </div>

        {/* Totais */}
        <div className="checkout-section">
          <div className="section-title">
            <span className="num">4</span> Totais
          </div>
          <div className="totals">
            <div className="totals-row">
              <span className="label">Subtotal</span>
              <span className="value">{fmtBRL(subtotal)}</span>
            </div>
            <div className="totals-row">
              <span className="label">Valor da entrega</span>
              <span className="value">
                {entrega ? fmtBRL(valorEntrega) : <span style={{ color: 'var(--cinza)' }}>—</span>}
              </span>
            </div>
            <div className="totals-row total">
              <span className="label">Total</span>
              <span className="value">{fmtBRL(total)}</span>
            </div>
          </div>
        </div>

        {/* Revisão */}
        <div style={{ padding: '16px var(--sp-4) 0' }}>
          <Banner kind="atencao">Confira as informações antes de continuar.</Banner>
          <div className="mt-3">
            <Checkbox checked={revisado} onChange={setRevisado}>
              Revisei as informações e desejo confirmar a compra.
            </Checkbox>
          </div>
        </div>
      </div>

      {/* Footer fixo com Confirmar */}
      <div className="checkout-footer">
        {!formValido && (
          <div className="field-hint" style={{ textAlign: 'center', paddingBottom: 2 }}>
            {!entrega && 'Selecione a forma de entrega. '}
            {entrega && !endValid.ok && (endereco.trim() ? 'Ajuste o endereço/local. ' : 'Informe o endereço ou local. ')}
            {!pagamento && 'Selecione a forma de pagamento.'}
          </div>
        )}
        <button
          className="btn btn-primary btn-full"
          disabled={!podeConfirmar}
          onClick={confirmar}
          aria-label="Confirmar compra">
          {processando ? (
            <>
              <span className="spinner" style={{
                width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: 'white', borderRadius: '50%', display: 'inline-block',
                animation: 'spin 0.8s linear infinite'
              }} />
              Processando…
            </>
          ) : (
            <>Confirmar compra · {fmtBRL(total)}</>
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

window.ScreenCheckout = ScreenCheckout;
