// Task 3 - small behaviours that support the CSS (no frameworks)

// 1. Shadow on the navbar once the page is scrolled
const nav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// 2. Fill skill bars when the Skills section scrolls into view
const bars = document.querySelectorAll('.bar-fill');
bars.forEach(bar => bar.style.setProperty('--w', bar.dataset.level + '%'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('go');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(bar => io.observe(bar));
} else {
  bars.forEach(bar => bar.classList.add('go'));
}

// 3. Close the mobile menu after tapping a link
document.querySelectorAll('#mainNav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('mainNav');
    if (menu.classList.contains('show') && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});

// 4. Highlight the nav link for the section being viewed
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('#mainNav .nav-link');
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spy.observe(s));

// 5. Contact form: simple check, no backend in this task
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  if (!name || !emailOk || message.length < 5) {
    note.textContent = 'Please enter your name, a valid email and a message.';
    note.className = 'bad';
    return;
  }
  note.textContent = 'Thanks, ' + name + '. Your message is ready to send.';
  note.className = 'ok';
  form.reset();
});
