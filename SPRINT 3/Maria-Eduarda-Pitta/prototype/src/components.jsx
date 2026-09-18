// Componentes reutilizáveis do REPASSA

const { useState, useEffect, useMemo, useRef } = React;

// ---------- TopBar ----------
function TopBar({ title, showBack, onBack, showBrand, onNotifications, notifCount = 0, right }) {
  return (
    <header className="topbar" role="banner">
      {showBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="Voltar">
          <IconArrowLeft size={22} />
        </button>
      ) : (
        <div style={{ width: 40 }} aria-hidden="true" />
      )}

      {showBrand ? (
        <div className="brand-lockup" style={{ justifyContent: 'center' }}>
          <img src={window.__resources?.logoRepassa || "public/logo-repassa.png"} alt="" aria-hidden="true" className="topbar-logo" />
          <div className="brand-text">
            <span className="brand-name">REPASSA</span>
          </div>
        </div>
      ) : (
        <div className="title">{title}</div>
      )}

      {right !== undefined ? right : (
        <button className="icon-btn" onClick={onNotifications} aria-label="Notificações">
          <IconBell size={22} />
          {notifCount > 0 && <span className="badge-dot">{notifCount}</span>}
        </button>
      )}
    </header>
  );
}

// ---------- BottomNav ----------
function BottomNav({ active, onNavigate }) {
  const items = [
    { key: 'home', label: 'Início', icon: IconHome },
    { key: 'buscar', label: 'Buscar', icon: IconSearchNav },
    { key: 'anunciar', label: 'Anunciar', icon: IconPlusSquare },
    { key: 'conversas', label: 'Conversas', icon: IconMsg },
    { key: 'perfil', label: 'Perfil', icon: IconUser },
  ];
  return (
    <nav className="bottomnav" role="navigation" aria-label="Navegação principal">
      {items.map(it => {
        const IconC = it.icon;
        const isActive = it.key === active;
        return (
          <button key={it.key}
                  className={`bottomnav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate(it.key)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={it.label}>
            <span className="icon-wrap"><IconC size={22} strokeWidth={isActive ? 2.4 : 2} /></span>
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ---------- StatusBadge ----------
function StatusBadge({ status }) {
  // Sempre com texto + ícone (nunca só cor)
  if (status === 'Disponível') {
    return (
      <span className="badge badge-verde" aria-label="Material disponível">
        <IconCheck size={12} strokeWidth={3} /> DISPONÍVEL
      </span>
    );
  }
  if (status === 'Vendido') {
    return (
      <span className="badge badge-cinza" aria-label="Material vendido">
        <IconX size={12} strokeWidth={3} /> VENDIDO
      </span>
    );
  }
  return <span className="badge badge-cinza">{status}</span>;
}

// ---------- Foto placeholder ilustrada ----------
function PhotoPlaceholder({ tipo, label }) {
  // desenha ícone temático de fundo
  const map = {
    calculadora: IconCalc,
    jaleco: IconShirt,
    'livro-psico': IconBook,
    'livro-ed': IconBook,
    prancheta: IconRuler,
    escalimetro: IconRuler,
    anatomia: IconMedkit,
    vademecum: IconBook,
    default: IconTag,
  };
  const IconC = map[tipo] || map.default;
  return (
    <div className="photo-placeholder" aria-hidden="true">
      <span className="ph-icon"><IconC size={80} /></span>
      {label && <span className="ph-label">{label}</span>}
    </div>
  );
}

// ---------- MaterialCard (lista) ----------
function MaterialCard({ material, onOpen }) {
  const vendedor = acharUsuario(material.idVendedor);
  const isSold = material.status === 'Vendido';
  return (
    <article className={`material-card ${isSold ? 'sold' : ''}`}
             onClick={() => onOpen(material.id)}
             tabIndex="0"
             role="button"
             aria-label={`Abrir detalhes de ${material.titulo}`}
             onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(material.id); } }}>
      <div className="material-photo">
        <PhotoPlaceholder tipo={material.foto} label="Foto do produto" />
      </div>
      <div className="material-info">
        <div className="material-title">{material.titulo}</div>
        <div className="material-price">
          {fmtBRL(material.preco)}
          {material.precoNovo != null && (
            <span className="old">novo: {fmtBRL(material.precoNovo)}</span>
          )}
        </div>
        <div className="material-meta">
          {material.estadoConservacao} estado · {material.curso} · {material.categoria}
        </div>
        <div className="material-footer">
          <div className="material-seller">
            {vendedor.notaMedia != null ? (
              <>
                <span className="star"><IconStar size={13} /></span>
                <span>{vendedor.notaMedia.toFixed(1).replace('.', ',')}</span>
                <span>·</span>
                <span className="name">{vendedor.nome.split(' ')[0]}</span>
              </>
            ) : (
              <span className="name">Sem avaliações</span>
            )}
          </div>
          <StatusBadge status={material.status} />
        </div>
      </div>
    </article>
  );
}

// ---------- Chip filtro ----------
function FilterChip({ label, active, count, onClick, icon }) {
  return (
    <button className={`chip ${active ? 'active' : ''}`}
            onClick={onClick}
            aria-pressed={active}>
      {icon}
      <span>{label}</span>
      {count > 0 && <span className="count">{count}</span>}
    </button>
  );
}

// ---------- BottomSheet ----------
function BottomSheet({ open, title, children, onClose, footer }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true" aria-label={title}
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar"><IconX size={20} /></button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- FilterSheet (checkboxes ou radios) ----------
function FilterSheet({ open, title, options, selected, multiple = true, onApply, onClose }) {
  const [local, setLocal] = useState(selected || []);
  useEffect(() => { if (open) setLocal(selected || []); }, [open, selected]);
  function toggle(v) {
    if (multiple) {
      setLocal(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
    } else {
      setLocal(prev => prev.includes(v) ? [] : [v]);
    }
  }
  return (
    <BottomSheet open={open} title={title} onClose={onClose} footer={
      <>
        <button className="btn btn-secondary" onClick={() => setLocal([])}>Limpar</button>
        <button className="btn btn-primary" onClick={() => { onApply(local); onClose(); }}>Aplicar</button>
      </>
    }>
      {options.map(opt => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const isSelected = local.includes(val);
        return (
          <div key={val}
               className={`option-row ${isSelected ? 'selected' : ''}`}
               onClick={() => toggle(val)}
               role="checkbox"
               aria-checked={isSelected}
               tabIndex="0"
               onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(val); } }}>
            <div className="check-box">
              {isSelected && <IconCheck size={14} strokeWidth={3} />}
            </div>
            <div className="option-label">{label}</div>
          </div>
        );
      })}
    </BottomSheet>
  );
}

// ---------- Toast provider ----------
function useToasts() {
  const [toasts, setToasts] = useState([]);
  function push(kind, message) {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, kind, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  }
  return {
    toasts,
    sucesso: (m) => push('sucesso', m),
    atencao: (m) => push('atencao', m),
    erro: (m) => push('erro', m),
    info: (m) => push('info', m),
  };
}
function ToastStack({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map(t => {
        const IconC = t.kind === 'sucesso' ? IconCheck
                    : t.kind === 'erro'    ? IconX
                    : t.kind === 'atencao' ? IconAlert
                    : IconInfo;
        return (
          <div key={t.id} className={`toast toast-${t.kind}`}>
            <IconC size={18} strokeWidth={2.5} />
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Banner ----------
function Banner({ kind = 'info', children, icon }) {
  const IconC = icon || (kind === 'atencao' ? IconAlert
                       : kind === 'erro'    ? IconX
                       : kind === 'sucesso' ? IconCheck
                       : IconInfo);
  return (
    <div className={`banner banner-${kind}`} role="note">
      <span className="icon"><IconC size={18} strokeWidth={2.4} /></span>
      <span className="text">{children}</span>
    </div>
  );
}

// ---------- Botões / Checkbox atômicos ----------
function Checkbox({ checked, onChange, children, id }) {
  const aid = id || useMemo(() => 'cb-' + Math.random().toString(36).slice(2), []);
  return (
    <label className="checkbox" htmlFor={aid}>
      <input id={aid} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="checkbox-box">
        {checked && <IconCheck size={14} strokeWidth={3} />}
      </span>
      <span className="checkbox-label">{children}</span>
    </label>
  );
}

// ---------- Radio card (usado no checkout) ----------
function RadioCard({ selected, onClick, title, sub, icon }) {
  return (
    <div className={`radio-card ${selected ? 'selected' : ''}`}
         onClick={onClick}
         role="radio"
         aria-checked={selected}
         tabIndex="0"
         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}>
      <div className="radio-dot" />
      <div className="radio-label">
        <div className="radio-title">{title}</div>
        {sub && <div className="radio-sub">{sub}</div>}
      </div>
      {icon && <div className="radio-icon">{icon}</div>}
    </div>
  );
}

// ---------- Modal ----------
function Modal({ open, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="sheet-overlay" role="dialog" aria-modal="true"
         onClick={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div className="sheet" style={{ borderRadius: 'var(--radius-lg)', margin: '0 20px 40px', maxHeight: '80%' }}>
        <div className="sheet-body" style={{ padding: 0 }}>
          {children}
        </div>
        {footer && <div className="sheet-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- EmptyState ----------
function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon || <IconSearch size={28} />}</div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

// Expor todos globalmente
Object.assign(window, {
  TopBar, BottomNav, StatusBadge, PhotoPlaceholder, MaterialCard,
  FilterChip, BottomSheet, FilterSheet,
  useToasts, ToastStack, Banner,
  Checkbox, RadioCard, Modal, EmptyState,
});
