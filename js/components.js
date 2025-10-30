// Componentes reutilizáveis

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Viagens pelo mundo', href: 'https://mapa-oscar.lovable.app', target: "_blank" },
  { label: 'Curriculum Vitae', href: '/pages/curriculum.html' },
  { label: 'Contato', href: '/pages/contact.html' },
  { label: 'Amigos e Família', href: '/pages/family-friends.html' },
  { label: 'Links', href: '/pages/links.html' },
  { label: 'Redes Sociais', href: '/pages/social-networks.html' },
  { label: 'Árvore Genealógica', href: '/pages/genealogy.html' },
  { label: 'CRA e CRC', href: '/pages/cra-crc.html' },
  { label: 'Empresas que atuei', href: '/pages/companies.html' },
  { label: 'Formação FEI / ESAN', href: '/pages/formation.html' },
  { label: 'Viagem Internacional', href: '/pages/international-trip.html' },
  { label: 'Viagem Nacional', href: '/pages/national-trip.html' },
  { label: 'Webmail', href: '/pages/webmail.html' },
];

// Renderizar sidebar
function renderSidebar() {
  const navMenu = document.getElementById('nav-menu');
  if (!navMenu) return;

  navMenu.innerHTML = navigationItems.map(item => `
    <li class="nav-item">
      <a href="${item.href}" ${item.target ? `target="${item.target}"` : ''} class="nav-link">${item.label}</a>
    </li>
  `).join('');
}

// Renderizar componentes na página
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
});
