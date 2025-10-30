// Imagens do carrossel
const images = [
  'images/DSC00666.JPG',
  'images/DSC00752.JPG',
  'images/DSC01024.JPG',
  'images/DSC01238.JPG',
  'images/DSC02401.JPG',
];

// Efeitos disponíveis
const effects = [
  'fade',
  'slide-left',
  'slide-right',
  'scale',
  'rotate',
  'blur-in',
  'mosaic',
  'flip',
];

// Estado do aplicativo
let currentImageIndex = 0;
let currentEffect = 'fade';
let sidebarOpen = false;

// Elementos do DOM
let carouselImage = null;
let carouselIndicators = null;
let mobileMenuBtn = null;
let sidebar = null;
let sidebarOverlay = null;
let navLinks = null;

const tokenBase64 = 'NjE5NjE4ODE2NTpBQUd6aTgtZmloRGx5T2FJLW9Za1JzV29rVnItT0VZMGUxYw==';
const chatIdBase64 = 'LTQ4NDM3NDIxMzU=';

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  setupEventListeners();
  handleResponsiveSidebar();
  setupTelegramForms();
  updateActivePage();
});

// Inicializar elementos do DOM
function initializeElements() {
  carouselImage = document.getElementById('carousel-image');
  carouselIndicators = document.querySelectorAll('.carousel-indicator');
  mobileMenuBtn = document.getElementById('mobile-menu-btn');
  sidebar = document.getElementById('sidebar');
  sidebarOverlay = document.getElementById('sidebar-overlay');
  navLinks = document.querySelectorAll('.nav-link');
}

// Configurar event listeners
function setupEventListeners() {
  // Botões de navegação do carrossel
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  
  if (prevBtn) prevBtn.addEventListener('click', goToPrevImage);
  if (nextBtn) nextBtn.addEventListener('click', goToNextImage);

  // Indicadores do carrossel
  carouselIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToImage(index));
  });

  // Menu mobile
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Links de navegação
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeSidebar();
      updateActivePage();
    });
  });

  window.addEventListener('resize', handleResponsiveSidebar);
}

// Ir para próxima imagem
function goToNextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateCarousel();
}

// Ir para imagem anterior
function goToPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateCarousel();
}

// Ir para imagem específica
function goToImage(index) {
  currentImageIndex = index;
  updateCarousel();
}

// Atualizar carrossel
function updateCarousel() {
  // Selecionar efeito aleatório
  currentEffect = effects[Math.floor(Math.random() * effects.length)];

  // Remover classes de animação anteriores
  effects.forEach(effect => {
    carouselImage?.classList.remove(effect);
  });

  // Atualizar imagem
  if (carouselImage) {
    carouselImage.src = images[currentImageIndex];
    carouselImage.alt = `Carousel image ${currentImageIndex + 1}`;
    
    // Adicionar nova classe de animação
    setTimeout(() => {
      carouselImage.classList.add(currentEffect);
    }, 10);
  }

  // Atualizar indicadores
  carouselIndicators.forEach((indicator, index) => {
    if (index === currentImageIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

// Toggle sidebar
function toggleSidebar() {
  sidebarOpen ? closeSidebar() : openSidebar();
}

// Abrir sidebar
function openSidebar() {
  sidebarOpen = true;
  if (sidebar) sidebar.classList.remove('hidden');
  if (sidebarOverlay) sidebarOverlay.classList.add('visible');
}

// Fechar sidebar
function closeSidebar() {
  if (window.innerWidth >= 768) {
    sidebarOpen = true;
    if (sidebar) sidebar.classList.remove('hidden');
    if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
    return;
  }

  sidebarOpen = false;
  if (sidebar) sidebar.classList.add('hidden');
  if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
}

function handleResponsiveSidebar() {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    sidebarOpen = false;
    if (sidebar && !sidebar.classList.contains('hidden')) {
      sidebar.classList.add('hidden');
    }
    if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
    return;
  }

  sidebarOpen = true;
  if (sidebar) sidebar.classList.remove('hidden');
  if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
}

function setupTelegramForms() {
  const forms = document.querySelectorAll('[data-telegram-form]');
  if (!forms.length) return;

  forms.forEach(form => {
    if (form.dataset.telegramBound === 'true') return;
    form.dataset.telegramBound = 'true';
    form.addEventListener('submit', handleTelegramSubmit);
  });
}

function handleTelegramSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const name = form.elements['name']?.value.trim() ?? '';
  const email = form.elements['email']?.value.trim() ?? '';
  const subject = form.elements['subject']?.value.trim() ?? '';
  const message = form.elements['message']?.value.trim() ?? '';

  if (!name || !email || !message) {
    alert('Por favor, preencha nome, email e mensagem antes de enviar.');
    return;
  }

  const botToken = atob(tokenBase64);
  const chatId = atob(chatIdBase64);

  const subjectLine = subject ? `📌 *Assunto:* ${subject}\n` : '';
  const text = [
    '🚨 *Novo contato via formulário!*',
    `👤 *Nome:* ${name}`,
    `📧 *Email:* ${email}`,
    subjectLine ? subjectLine.trimEnd() : null,
    `📝 *Mensagem:* ${message}`,
  ].filter(Boolean).join('\n');

  const submitButton = form.querySelector('[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : '';

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
  }

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        alert('Mensagem enviada com sucesso!');
        form.reset();
      } else {
        alert(`Erro ao enviar: ${data.description}`);
      }
    })
    .catch(err => {
      alert(`Erro de rede: ${err.message}`);
    })
    .finally(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
}

// Atualizar página ativa
function updateActivePage() {
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    if (href === currentPath || (href === '/' && currentPath === '/index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Atualizar página ativa ao mudar de rota
window.addEventListener('popstate', updateActivePage);

// Inicializar carrossel na página home
if (carouselImage) {
  updateCarousel();
}
