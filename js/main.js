// Header: fundo sólido após rolar
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobile
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('menu');
const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('is-open', open);
};
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Galeria: foto ampliada
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
document.querySelectorAll('.gallery button').forEach((btn) => {
  btn.addEventListener('click', () => {
    lightboxImg.src = btn.dataset.full;
    lightboxImg.alt = btn.querySelector('img').alt;
    lightbox.showModal();
  });
});
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

// Aberto agora / hoje (horário de Joinville)
const HOURS = { 0: null, 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [9, 18] };
const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
const day = now.getDay();
const hour = now.getHours() + now.getMinutes() / 60;
const today = HOURS[day];
const isOpen = !!today && hour >= today[0] && hour < today[1];

const status = document.querySelector('[data-status]');
status.textContent = isOpen ? `Aberto agora · até ${today[1]}h` : 'Fechado agora · Glória, Joinville';
status.classList.add(isOpen ? 'is-open' : 'is-closed');

document.querySelectorAll('.hours tr').forEach((row) => {
  if (row.dataset.days.split(',').map(Number).includes(day)) row.classList.add('is-today');
});

document.querySelector('[data-year]').textContent = now.getFullYear();

// Ondinha no clique/toque dos botões
document.querySelectorAll('.btn').forEach((el) => {
  el.addEventListener('pointerdown', (e) => {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    el.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Elementos surgem ao rolar (só com JS, para não esconder conteúdo se ele falhar)
const revealTargets = document.querySelectorAll('.section__head, .about > *, .gallery li, .card, .review, .contact > *');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('is-visible');
    revealObserver.unobserve(el);
    // depois de aparecer, devolve as transições normais de hover
    setTimeout(() => el.classList.remove('reveal', 'is-visible'), 1200);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealTargets.forEach((el) => {
  const siblings = [...el.parentElement.children];
  el.style.setProperty('--delay', `${Math.min(siblings.indexOf(el), 5) * 0.08}s`);
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Menu destaca a seção visível
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

// Botão flutuante some no rodapé para não cobrir conteúdo
const fab = document.querySelector('.fab');
new IntersectionObserver(([entry]) => fab.classList.toggle('is-hidden', entry.isIntersecting))
  .observe(document.querySelector('.footer'));
