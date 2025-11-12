// ==========================================
// VIDEO DE FONDO ANIMADO CON CANVAS
// ==========================================
class HeroAnimation {
  constructor() {
    this.canvas = document.getElementById('heroCanvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.connections = [];
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    
    // Seguir el mouse para efecto interactivo
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
  }
  
  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }
  
  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
    this.ctx.fill();
  }
  
  drawConnection(p1, p2, distance, maxDistance) {
    const opacity = (1 - distance / maxDistance) * 0.3;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.strokeStyle = `rgba(251, 191, 36, ${opacity})`;
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();
  }
  
  updateParticles() {
    const maxDistance = 150;
    
    this.particles.forEach((particle, i) => {
      // Actualizar posición
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Rebotar en los bordes
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Interacción con el mouse
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        particle.x -= dx * 0.01;
        particle.y -= dy * 0.01;
      }
      
      // Dibujar partícula
      this.drawParticle(particle);
      
      // Dibujar conexiones
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = particle.x - p2.x;
        const dy = particle.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          this.drawConnection(particle, p2, distance, maxDistance);
        }
      }
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Fondo con gradiente sutil
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, 'rgba(233, 69, 96, 0.05)');
    gradient.addColorStop(0.5, 'rgba(198, 47, 71, 0.03)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.08)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Inicializar animación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new HeroAnimation();
});

// ==========================================
// PROGRESS BAR AL HACER SCROLL
// ==========================================
function updateProgressBar() {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
}

window.addEventListener('scroll', updateProgressBar);

// ==========================================
// ==========================================
// CARRUSEL REUTILIZABLE (REFACTORIZADO)
// ==========================================
class ReusableCarousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      return;
    }
    this.currentSlide = 0;
    this.slides = this.container.querySelectorAll('.carousel-slide');
    this.indicators = this.container.querySelectorAll('.indicator');
    this.prevBtn = this.container.querySelector('.carousel-prev');
    this.nextBtn = this.container.querySelector('.carousel-next');
    this.track = this.container.querySelector('.carousel-track');
    this.trackContainer = this.container.querySelector('.carousel-track-container');
    this.autoPlayInterval = null;
    this.autoPlayDelay = 7000;
    if (this.slides.length === 0) return;
    this.init();
  }
  init() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    this.addSwipeSupport();
    this.startAutoPlay();
    if (this.container) {
      this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) {
      console.error("Índice de slide fuera de rango");
      return;
    }
    if (this.slides[this.currentSlide]) {
      this.slides[this.currentSlide].classList.remove('active');
    }
    if (this.indicators[this.currentSlide]) {
      this.indicators[this.currentSlide].classList.remove('active');
    }
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    if (this.indicators[this.currentSlide]) {
      this.indicators[this.currentSlide].classList.add('active');
    }
    if (this.track) {
      this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
  }
  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  addSwipeSupport() {
    if (!this.trackContainer) return;
    let startX = 0;
    let isDragging = false;
    this.trackContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoPlay();
    }, { passive: true });
    this.trackContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
    }, { passive: true });
    this.trackContainer.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      isDragging = false;
      this.startAutoPlay();
    });
  }
}

// Inicializar carruseles cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Buscar todos los elementos que tengan la clase testimonial-carousel o cases-carousel
  const allCarousels = document.querySelectorAll('.testimonial-carousel');
  
  console.log(`🎠 Carruseles encontrados: ${allCarousels.length}`);
  
  allCarousels.forEach((carousel, index) => {
    // Agregar un ID único si no lo tiene
    if (!carousel.id) {
      carousel.id = `carousel-${index}`;
    }
    console.log(`Inicializando carrusel: #${carousel.id}`);
    new ReusableCarousel(`#${carousel.id}`);
  });
});

// ==========================================
// MEJORA DE ACCESIBILIDAD: TRAP FOCUS EN MODALS
// ==========================================
document.addEventListener('keydown', (e) => {
  // Cerrar con ESC si hay algún modal abierto (futuro)
  if (e.key === 'Escape') {
    // Código para cerrar modals
  }
  
  // Navegación con teclado mejorada
  if (e.key === 'Tab') {
    const focusableElements = document.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Asegurar que el foco no salga del contenido principal
    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
});

// ==========================================
// LAZY LOADING PARA IMÁGENES
// ==========================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  });
}

// ==========================================
// SMOOTH SCROLL POLYFILL PARA NAVEGADORES ANTIGUOS
// ==========================================
if (!('scrollBehavior' in document.documentElement.style)) {
  const smoothScrollPolyfill = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const targetPosition = target.offsetTop;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          const duration = 1000;
          let start = null;
          
          function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
          }
          
          function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
          }
          
          requestAnimationFrame(animation);
        }
      });
    });
  };
  
  document.addEventListener('DOMContentLoaded', smoothScrollPolyfill);
}

// ==========================================
// PERFORMANCE: DEBOUNCE PARA SCROLL
// ==========================================
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Aplicar debounce a funciones de scroll
window.addEventListener('scroll', debounce(() => {
  updateProgressBar();
  highlightActiveLink();
}, 5));

// ==========================================
// RESALTAR ENLACE ACTIVO EN NAVBAR
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a[href^="#"]');

function highlightActiveLink() {
  let current = '';
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ==========================================
// MODO OSCURO / CLARO
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Verificar preferencia guardada
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
} else if (!savedTheme) {
  // Detectar preferencia del sistema
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
  }
}

// Toggle al hacer clic
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Guardar preferencia
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
    
    // Animación suave
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      themeToggle.style.transform = 'rotate(0deg)';
    }, 400);
  });
}

// Escuchar cambios en la preferencia del sistema
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        body.classList.add('dark-mode');
      } else {
        body.classList.remove('dark-mode');
      }
    }
  });
}

// ==========================================
// CONTADOR ANIMADO EN ESTADÍSTICAS
// ==========================================
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 segundos
  const increment = target / (duration / 16); // 60 FPS
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      element.classList.add('counting');
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
      element.classList.remove('counting');
    }
  };
  
  updateCounter();
}

// Observador para activar contadores cuando sean visibles
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumber = entry.target.querySelector('.stat-number[data-target]');
      if (statNumber && statNumber.textContent === '0') {
        animateCounter(statNumber);
        counterObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => counterObserver.observe(card));
});

// ==========================================
// TIMELINE INTERACTIVA (EXPANDIR/COLAPSAR)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const timelineHeaders = document.querySelectorAll('.timeline-header');
  
  timelineHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle expanded state
      this.setAttribute('aria-expanded', !isExpanded);
      
      if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        content.classList.add('expanded');
      } else {
        content.classList.remove('expanded');
        content.classList.add('collapsed');
      }
    });
    
    // Soporte para teclado
    header.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
});

// ==========================================
// CALCULADORA DE IMPACTO DIGITAL
// ==========================================
class ImpactCalculator {
  constructor() {
    this.initialShares = 10;
    this.shareRate = 0.2;
    this.timeHours = 24;
    this.platform = 'whatsapp';
    this.networkSize = 200;
    this.canvas = document.getElementById('propagationCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.init();
  }
  
  init() {
    // Event listeners para los controles
    const initialSharesInput = document.getElementById('initialShares');
    const shareRateInput = document.getElementById('shareRate');
    const timeHoursInput = document.getElementById('timeHours');
    const platformSelect = document.getElementById('platformSelect');
  const networkSizeValue = document.getElementById('networkSizeValue');
  const networkSizeUp = document.getElementById('networkSizeUp');
  const networkSizeDown = document.getElementById('networkSizeDown');
    const calculateBtn = document.getElementById('calculateBtn');

    if (platformSelect) {
      this.platform = platformSelect.value;
      platformSelect.addEventListener('change', (e) => {
        this.platform = e.target.value;
      });
    }

    // Valor inicial
    if (networkSizeValue) {
      this.networkSize = parseInt(networkSizeValue.textContent) || 200;
    }
    // Botón para aumentar
    if (networkSizeUp) {
      networkSizeUp.addEventListener('click', () => {
        let val = this.networkSize;
        val = Math.min(val + 10, 10000);
        this.networkSize = val;
        if (networkSizeValue) networkSizeValue.textContent = val;
        this.calculate();
      });
    }
    // Botón para disminuir
    if (networkSizeDown) {
      networkSizeDown.addEventListener('click', () => {
        let val = this.networkSize;
        val = Math.max(val - 10, 10);
        this.networkSize = val;
        if (networkSizeValue) networkSizeValue.textContent = val;
        this.calculate();
      });
    }

    if (initialSharesInput) {
      initialSharesInput.addEventListener('input', (e) => {
        this.initialShares = parseInt(e.target.value);
        document.getElementById('initialSharesValue').textContent = e.target.value;
      });
    }

    if (shareRateInput) {
      shareRateInput.addEventListener('input', (e) => {
        this.shareRate = parseInt(e.target.value) / 100;
        document.getElementById('shareRateValue').textContent = e.target.value + '%';
      });
    }

    if (timeHoursInput) {
      timeHoursInput.addEventListener('input', (e) => {
        this.timeHours = parseInt(e.target.value);
        const hours = e.target.value;
        document.getElementById('timeHoursValue').textContent = hours + (hours === '1' ? ' hora' : ' horas');
      });
    }

    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => this.calculate());
    }

    // Calcular automáticamente al cargar
    this.calculate();
  }
  
  calculate() {
    // Parámetros promedio por plataforma (basados en estudios y reportes públicos)
    // Parámetros ajustados para mayor sensibilidad
    const platformParams = {
      whatsapp:   { reachPerShare: [15, 30], shareRate: [0.22, 0.32] },
      twitter:    { reachPerShare: [40, 80], shareRate: [0.04, 0.09] },
      facebook:   { reachPerShare: [30, 60], shareRate: [0.08, 0.16] },
      telegram:   { reachPerShare: [20, 40], shareRate: [0.15, 0.22] },
      tiktok:     { reachPerShare: [60, 150], shareRate: [0.02, 0.05] },
      instagram:  { reachPerShare: [20, 45], shareRate: [0.05, 0.12] }
    };
    const params = platformParams[this.platform] || platformParams['whatsapp'];

    // Usar el valor central para el cálculo principal, extremos para el rango
    const avgReach = Math.round((params.reachPerShare[0] + params.reachPerShare[1]) / 2);
    const minReach = params.reachPerShare[0];
    const maxReach = params.reachPerShare[1];
    const avgShareRate = (params.shareRate[0] + params.shareRate[1]) / 2;
    const minShareRate = params.shareRate[0];
    const maxShareRate = params.shareRate[1];

    // Generaciones
  // Más generaciones para mayor propagación
  const generations = Math.floor(this.timeHours / 1.5);

    // Cálculo principal (valor promedio)
    let totalReach = this.initialShares;
    let totalShares = this.initialShares;
    let currentGen = this.initialShares;
    for (let i = 0; i < generations; i++) {
      currentGen = Math.floor(currentGen * avgShareRate);
      totalShares += currentGen;
      totalReach += currentGen * avgReach;
    }
    // Limitar por red de contactos
    totalReach = Math.min(totalReach, this.networkSize * generations * 2);

    // Cálculo mínimo
    let minTotalReach = this.initialShares;
    let minCurrentGen = this.initialShares;
    for (let i = 0; i < generations; i++) {
      minCurrentGen = Math.floor(minCurrentGen * minShareRate);
      minTotalReach += minCurrentGen * minReach;
    }
    minTotalReach = Math.min(minTotalReach, this.networkSize * generations);

    // Cálculo máximo
    let maxTotalReach = this.initialShares;
    let maxCurrentGen = this.initialShares;
    for (let i = 0; i < generations; i++) {
      maxCurrentGen = Math.floor(maxCurrentGen * maxShareRate);
      maxTotalReach += maxCurrentGen * maxReach;
    }
    maxTotalReach = Math.min(maxTotalReach, this.networkSize * generations * 4);

    // Estimar plataformas (más compartidos = más plataformas)
    let platforms = 1;
    if (totalShares > 50) platforms = 2;
    if (totalShares > 200) platforms = 3;
    if (totalShares > 500) platforms = 4;
    if (totalShares > 1000) platforms = 5;

    // Determinar nivel de viralización
  let viralLevel = 'Bajo';
  let viralColor = '#10b981';
  if (totalReach > 400) { viralLevel = 'Medio'; viralColor = '#fbbf24'; }
  if (totalReach > 2500) { viralLevel = 'Alto'; viralColor = '#f59e0b'; }
  if (totalReach > 12000) { viralLevel = 'Crítico'; viralColor = '#e94560'; }

    // Actualizar resultados
    this.updateResults(totalReach, totalShares, platforms, viralLevel, viralColor, minTotalReach, maxTotalReach);

    // Dibujar visualización
    this.drawVisualization(totalReach, totalShares, generations);
  }
  
  updateResults(reach, shares, platforms, level, color, minReach, maxReach) {
    document.getElementById('totalReach').textContent = reach.toLocaleString('es-MX');
    document.getElementById('totalShares').textContent = shares.toLocaleString('es-MX');
    document.getElementById('platformCount').textContent = platforms + '+';
    const levelElement = document.getElementById('viralLevel');
    levelElement.textContent = level;
    levelElement.style.color = color;
    // Mostrar rango estimado
    const rangeElem = document.getElementById('reachRange');
    if (rangeElem) {
      rangeElem.textContent = `${minReach.toLocaleString('es-MX')} - ${maxReach.toLocaleString('es-MX')}`;
    }
  }
  
  drawVisualization(reach, shares, generations) {
    // Configurar canvas
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = 300;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 20;
    
    // Dibujar ondas de propagación
    for (let i = generations; i >= 0; i--) {
      const radius = (maxRadius / generations) * i;
      const opacity = 1 - (i / (generations + 1));
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(233, 69, 96, ${opacity * 0.3})`;
      this.ctx.fill();
      this.ctx.strokeStyle = `rgba(233, 69, 96, ${opacity * 0.6})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
    
    // Punto central
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    this.ctx.fillStyle = '#e94560';
    this.ctx.fill();
    
    // Texto central
    this.ctx.fillStyle = '#1e293b';
    this.ctx.font = 'bold 16px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Contenido', centerX, centerY - 40);
    this.ctx.fillText('Inicial', centerX, centerY - 20);
    
    // Dibujar nodos en las ondas exteriores
    const nodeCount = Math.min(shares, 50);
    for (let i = 0; i < nodeCount; i++) {
      const angle = (Math.PI * 2 / nodeCount) * i;
      const distance = maxRadius * (0.5 + Math.random() * 0.5);
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = '#fbbf24';
      this.ctx.fill();
      
      // Línea de conexión
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(x, y);
      this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }
}

// ==========================================
// MAPA INTERACTIVO DE MÉXICO
// ==========================================
class MexicoMap {
  constructor() {
    this.stateData = {
      "Sonora": { cases: 17, trend: "stable" },
      "Baja California": { cases: 29, trend: "stable" },
      "Chihuahua": { cases: 31, trend: "decreasing" },
      "Coahuila": { cases: 23, trend: "stable" },
      "Tamaulipas": { cases: 27, trend: "increasing" },
      "Nuevo León": { cases: 48, trend: "increasing" },
      "Quintana Roo": { cases: 5, trend: "increasing" },
      "Campeche": { cases: 4, trend: "stable" },
      "Yucatán": { cases: 12, trend: "stable" },
      "Tabasco": { cases: 8, trend: "stable" },
      "Chiapas": { cases: 11, trend: "stable" },
      "Oaxaca": { cases: 14, trend: "stable" },
      "Veracruz": { cases: 42, trend: "stable" },
      "Puebla": { cases: 38, trend: "increasing" },
      "Guerrero": { cases: 15, trend: "stable" },
      "Morelos": { cases: 16, trend: "increasing" },
      "México": { cases: 67, trend: "increasing" },
      "Ciudad de México": { cases: 89, trend: "increasing" },
      "Tlaxcala": { cases: 6, trend: "stable" },
      "Hidalgo": { cases: 13, trend: "decreasing" },
      "Querétaro": { cases: 19, trend: "stable" },
      "Guanajuato": { cases: 35, trend: "stable" },
      "Michoacán": { cases: 25, trend: "stable" },
      "Jalisco": { cases: 54, trend: "stable" },
      "Colima": { cases: 2, trend: "stable" },
      "Nayarit": { cases: 3, trend: "stable" },
      "Sinaloa": { cases: 21, trend: "increasing" },
      "Durango": { cases: 10, trend: "stable" },
      "Zacatecas": { cases: 9, trend: "decreasing" },
      "Aguascalientes": { cases: 7, trend: "stable" },
      "San Luis Potosí": { cases: 18, trend: "decreasing" },
      "Baja California Sur": { cases: 1, trend: "stable" }
    };
    this.init();
  }
  
  async init() {
    await this.loadMap();
    this.renderTopStates();
  }
  
  async loadMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;
    
    try {
      // Cargar el SVG con fetch
  const response = await fetch('assets/mapa_mexico.svg');
      if (!response.ok) {
        throw new Error('No se pudo cargar el mapa');
      }
      
      const svgText = await response.text();
      
      // Insertar el SVG directamente en el contenedor
      mapContainer.innerHTML = svgText;
      
      // Obtener el elemento SVG insertado
      const svgElement = mapContainer.querySelector('svg');
      if (svgElement) {
        svgElement.setAttribute('id', 'mexicoMap');
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        
        // Aplicar datos al mapa
        this.applyDataToMap();
      }
    } catch (error) {
      console.error('Error cargando mapa:', error);
      mapContainer.innerHTML = '<div class="map-error">No se pudo cargar el mapa. Por favor, recarga la página.</div>';
    }
  }
  
  applyDataToMap() {
    // Seleccionar todos los paths con atributo name
    const paths = document.querySelectorAll('#mexicoMap path[name]');
    
    paths.forEach(path => {
      const stateName = path.getAttribute('name');
      const data = this.stateData[stateName];
      
      if (data) {
        const category = this.getCaseCategory(data.cases);
        path.classList.add('state-path', category);
        
        // Event listeners
        path.addEventListener('click', () => this.showStateInfo(stateName, data));
        path.addEventListener('mouseenter', () => {
          path.classList.add('selected');
        });
        path.addEventListener('mouseleave', () => {
          path.classList.remove('selected');
        });
      } else {
        path.classList.add('state-path', 'none');
      }
    });
  }
  
  getTrendIcon(trend) {
    const icons = {
      increasing: '↗',
      decreasing: '↘',
      stable: '→'
    };
    return icons[trend] || '→';
  }
  
  getCaseCategory(cases) {
    if (cases >= 50) return 'critical';
    if (cases >= 20) return 'high';
    if (cases >= 10) return 'medium';
    if (cases >= 1) return 'low';
    return 'none';
  }
  
  showStateInfo(stateName, data) {
    const stateInfo = document.getElementById('stateInfo');
    if (!stateInfo) return;
    
    const category = this.getCaseCategory(data.cases);
    const trendText = {
      increasing: 'En aumento',
      decreasing: 'En descenso',
      stable: 'Estable'
    };
    
    // Remove active state from all cards
    document.querySelectorAll('.state-card').forEach(card => {
      card.classList.remove('active');
    });
    
    // Add active to clicked card
    document.querySelectorAll(`.state-card[data-state="${stateName}"]`).forEach(card => {
      card.classList.add('active');
    });
    
    stateInfo.innerHTML = `
      <div class="state-info-content">
        <h3>${stateName}</h3>
        <div class="state-stat-row">
          <div class="state-stat">
            <span class="stat-label">Casos Reportados</span>
            <span class="stat-value ${category}">${data.cases}</span>
          </div>
          <div class="state-stat">
            <span class="stat-label">Tendencia</span>
            <span class="stat-value trend-${data.trend}">
              ${this.getTrendIcon(data.trend)} ${trendText[data.trend]}
            </span>
          </div>
        </div>
        <div class="state-severity">
          <span class="severity-badge ${category}">
            ${this.getCategoryLabel(category)}
          </span>
        </div>
        <p class="state-description">
          Estado con nivel <strong>${this.getCategoryLabel(category).toLowerCase()}</strong> de casos reportados de violencia digital.
          ${data.cases > 30 ? 'Requiere atención prioritaria y recursos de apoyo.' : 
            data.cases > 10 ? 'Situación que requiere monitoreo continuo.' : 
            'Mantener vigilancia y prevención.'}
        </p>
      </div>
    `;
  }
  
  getCategoryLabel(category) {
    const labels = {
      critical: 'Crítico',
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
      none: 'Sin Datos'
    };
    return labels[category] || 'Sin Datos';
  }
  
  renderTopStates() {
    const topStatesContainer = document.querySelector('.top-states');
    if (!topStatesContainer) return;
    
    // Get top 5 states by cases
    const sortedStates = Object.entries(this.stateData)
      .sort((a, b) => b[1].cases - a[1].cases)
      .slice(0, 5);
    
    topStatesContainer.innerHTML = '<h3>Estados con Mayor Incidencia</h3>';
    
    const rankingsDiv = document.createElement('div');
    rankingsDiv.className = 'state-rankings';
    
    sortedStates.forEach(([stateName, data], index) => {
      const category = this.getCaseCategory(data.cases);
      const rankCard = document.createElement('div');
      rankCard.className = 'rank-card';
      rankCard.innerHTML = `
        <div class="rank-number">${index + 1}</div>
        <div class="rank-content">
          <h4>${stateName}</h4>
          <div class="rank-stats">
            <span class="rank-cases ${category}">${data.cases} casos</span>
            <span class="rank-trend trend-${data.trend}">
              ${this.getTrendIcon(data.trend)}
            </span>
          </div>
        </div>
      `;
      rankingsDiv.appendChild(rankCard);
    });
    
    topStatesContainer.appendChild(rankingsDiv);
  }
}

// Inicializar calculadora y mapa
document.addEventListener('DOMContentLoaded', () => {
  new ImpactCalculator();
  new MexicoMap();
});

// ==========================================
// LOG DE INICIALIZACIÓN
// ==========================================
console.log('%c🏛️ Violencia Digital México', 'font-size: 20px; font-weight: bold; color: #e94560;');
console.log('%cSitio web iniciado correctamente', 'color: #43b581;');
console.log('%cSi encuentras algún problema, por favor repórtalo.', 'color: #666;');
