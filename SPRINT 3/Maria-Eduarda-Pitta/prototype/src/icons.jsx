// Ícones inline (Feather/Lucide style). Todos aceitam prop size, color pega de currentColor.
const Icon = ({ children, size = 22, strokeWidth = 2, viewBox = '0 0 24 24' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={viewBox}
       fill="none" stroke="currentColor" strokeWidth={strokeWidth}
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>;
const IconBell = (p) => <Icon {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Icon>;
const IconArrowLeft = (p) => <Icon {...p}><path d="m15 18-6-6 6-6"/></Icon>;
const IconArrowRight = (p) => <Icon {...p}><path d="m9 18 6-6-6-6"/></Icon>;
const IconHeart = (p) => <Icon {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></Icon>;
const IconHeartFill = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size||22} height={p.size||22} viewBox="0 0 24 24"
       fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);
const IconStar = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size||14} height={p.size||14} viewBox="0 0 24 24"
       fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7L12 17.7 5.7 21.4l1.7-7L2 9.7l7.1-.6L12 2.5z"/>
  </svg>
);
const IconHome = (p) => <Icon {...p}><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2Z"/></Icon>;
const IconSearchNav = IconSearch;
const IconPlusSquare = (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></Icon>;
const IconMsg = (p) => <Icon {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></Icon>;
const IconUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></Icon>;
const IconCheck = (p) => <Icon {...p} strokeWidth={p.strokeWidth||3}><path d="m5 12 5 5L20 6"/></Icon>;
const IconX = (p) => <Icon {...p}><path d="m6 6 12 12M18 6 6 18"/></Icon>;
const IconAlert = (p) => <Icon {...p}><path d="M12 3 2 21h20L12 3z"/><path d="M12 10v4M12 18v.01"/></Icon>;
const IconInfo = (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 8v.01M11 12h1v5"/></Icon>;
const IconMapPin = (p) => <Icon {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></Icon>;
const IconTruck = (p) => <Icon {...p}><path d="M14 18V6H2v10h2"/><path d="M14 8h4l4 4v6h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></Icon>;
const IconPix = (p) => <Icon {...p}><path d="M9 3 3 9v6l6 6h6l6-6V9l-6-6z"/><path d="M8 8l4 4 4-4M8 16l4-4 4 4"/></Icon>;
const IconCard = (p) => <Icon {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></Icon>;
const IconCash = (p) => <Icon {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 10v.01M18 14v.01"/></Icon>;
const IconFilter = (p) => <Icon {...p}><path d="M3 5h18M6 12h12M10 19h4"/></Icon>;
const IconChat = IconMsg;
const IconCart = (p) => <Icon {...p}><path d="M2 3h3l3 12h11l3-8H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></Icon>;
const IconTag = (p) => <Icon {...p}><path d="M20 12 12 20l-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/></Icon>;
const IconBook = (p) => <Icon {...p}><path d="M4 4h11a3 3 0 0 1 3 3v14H7a3 3 0 0 1-3-3z"/><path d="M18 21V7"/></Icon>;
const IconRuler = (p) => <Icon {...p}><path d="M3 17 17 3l4 4L7 21z"/><path d="M7 11l2 2M11 7l2 2M15 11l2 2"/></Icon>;
const IconCalc = (p) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h.01M8 16h2M12 16h2M16 16h.01"/></Icon>;
const IconShirt = (p) => <Icon {...p}><path d="M4 6l4-3 4 3 4-3 4 3-2 4h-3v11H9V10H6z"/></Icon>;
const IconMedkit = (p) => <Icon {...p}><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M8 8V4h8v4M12 13v4M10 15h4"/></Icon>;
const IconDots = (p) => <Icon {...p}><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></Icon>;

Object.assign(window, {
  Icon, IconSearch, IconBell, IconArrowLeft, IconArrowRight,
  IconHeart, IconHeartFill, IconStar,
  IconHome, IconSearchNav, IconPlusSquare, IconMsg, IconUser,
  IconCheck, IconX, IconAlert, IconInfo,
  IconMapPin, IconTruck, IconPix, IconCard, IconCash,
  IconFilter, IconChat, IconCart, IconTag,
  IconBook, IconRuler, IconCalc, IconShirt, IconMedkit, IconDots,
});
