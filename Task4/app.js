// Task 4 - Complex form validation, dynamic DOM updates, client-side routing
'use strict';

/* ------------------------------------------------------------------
   1. Tiny data layer (localStorage with a safe fallback)
------------------------------------------------------------------ */
const STORE_KEY = 'task4-members';
let memoryFallback = [];

function loadMembers() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch (e) {
    return memoryFallback;
  }
}
function saveMembers(list) {
  memoryFallback = list;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* private mode: keep in memory */ }
}

let members = loadMembers();

/* ------------------------------------------------------------------
   2. Small helpers
------------------------------------------------------------------ */
const $ = (sel, root = document) => root.querySelector(sel);
const view = $('#view');

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  });
  children.forEach(c => node.append(c));
  return node;
}

let toastTimer;
function toast(message) {
  const t = $('#toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function updateNavCount() { $('#navCount').textContent = members.length; }

/* ------------------------------------------------------------------
   3. Password strength and validation rules
------------------------------------------------------------------ */
const PASSWORD_RULES = {
  length: pw => pw.length >= 8,
  lower:  pw => /[a-z]/.test(pw),
  upper:  pw => /[A-Z]/.test(pw),
  digit:  pw => /\d/.test(pw),
  symbol: pw => /[^A-Za-z0-9\s]/.test(pw),
  nospace: pw => pw.length > 0 && !/\s/.test(pw)
};

const COMMON_PASSWORDS = ['password', 'password1', 'password123', '12345678', 'qwerty123', 'iloveyou', 'admin123', 'welcome1'];

function passwordScore(pw) {
  let score = Object.values(PASSWORD_RULES).filter(rule => rule(pw)).length;   // 0..6
  if (pw.length >= 12) score += 1;
  if (/(.)\1{2,}/.test(pw)) score -= 1;                                          // aaa, 111
  if (COMMON_PASSWORDS.includes(pw.toLowerCase())) score = Math.min(score, 1);
  return Math.max(0, Math.min(score, 7));
}

function strengthInfo(score, empty) {
  if (empty) return { label: 'none', pct: 0, color: 'var(--bad)' };
  if (score <= 2) return { label: 'weak', pct: 25, color: 'var(--bad)' };
  if (score <= 4) return { label: 'fair', pct: 50, color: 'var(--warn)' };
  if (score <= 6) return { label: 'good', pct: 75, color: '#8be28b' };
  return { label: 'strong', pct: 100, color: 'var(--good)' };
}

const FIELD_RULES = {
  username(v) {
    if (!v) return 'Choose a username.';
    if (!/^[A-Za-z0-9_]{3,20}$/.test(v)) return 'Use 3 to 20 letters, digits or underscores.';
    if (/^\d/.test(v)) return 'The username cannot start with a digit.';
    if (members.some(m => m.username.toLowerCase() === v.toLowerCase())) return 'That username is taken.';
    return '';
  },
  email(v) {
    if (!v) return 'Enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email address.';
    if (members.some(m => m.email.toLowerCase() === v.toLowerCase())) return 'That email is already registered.';
    return '';
  },
  password(v, form) {
    if (!v) return 'Create a password.';
    const missing = Object.entries(PASSWORD_RULES).filter(([, rule]) => !rule(v)).length;
    if (missing) return 'The password does not meet every rule yet.';
    if (COMMON_PASSWORDS.includes(v.toLowerCase())) return 'That password is too common.';
    const user = form.username.value.trim().toLowerCase();
    if (user.length >= 3 && v.toLowerCase().includes(user)) return 'The password must not contain your username.';
    return '';
  },
  confirm(v, form) {
    if (!v) return 'Repeat your password.';
    if (v !== form.password.value) return 'The passwords do not match.';
    return '';
  },
  interest(v) { return v ? '' : 'Pick your main interest.'; },
  other(v, form) {
    if (form.interest.value !== 'other') return '';
    if (v.trim().length < 3) return 'Add at least 3 characters.';
    return '';
  }
};

/* ------------------------------------------------------------------
   4. Page controllers (each runs after its template is inserted)
------------------------------------------------------------------ */
function initRegister() {
  const form = $('#joinForm');
  const fill = $('#meterFill');
  const label = $('#strengthLabel');
  const ruleItems = form.querySelectorAll('#pwRules li');

  function setMessage(name, text) {
    const input = form.elements[name];
    $(`.msg[data-for="${name}"]`, form).textContent = text;
    input.classList.toggle('bad', !!text);
    input.classList.toggle('good', !text && input.value !== '');
  }

  function check(name) {
    const message = FIELD_RULES[name](form.elements[name].value, form);
    setMessage(name, message);
    return !message;
  }

  // Live password feedback: meter, label and rule checklist
  function renderStrength() {
    const pw = form.password.value;
    ruleItems.forEach(li => li.classList.toggle('ok', PASSWORD_RULES[li.dataset.rule](pw)));
    const info = strengthInfo(passwordScore(pw), pw === '');
    fill.style.width = info.pct + '%';
    fill.style.background = info.color;
    label.textContent = 'Strength: ' + info.label;
  }

  ['username', 'email', 'password', 'confirm', 'interest', 'other'].forEach(name => {
    const input = form.elements[name];
    input.addEventListener('blur', () => check(name));
    input.addEventListener('input', () => {
      if (name === 'password') {
        renderStrength();
        if (form.confirm.value) check('confirm');         // keep the match message fresh
      }
      if (input.classList.contains('bad')) check(name);
    });
  });

  // Show the extra field only when "Something else" is chosen
  form.interest.addEventListener('change', () => {
    const wrap = $('#otherWrap');
    const isOther = form.interest.value === 'other';
    wrap.classList.toggle('hidden', !isOther);
    if (isOther) form.other.focus(); else setMessage('other', '');
    check('interest');
  });

  // Show / hide password
  $('#togglePw').addEventListener('click', e => {
    const showing = form.password.type === 'text';
    form.password.type = showing ? 'password' : 'text';
    form.confirm.type = form.password.type;
    e.target.textContent = showing ? 'Show' : 'Hide';
    e.target.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    Object.keys(FIELD_RULES).forEach(name => { if (!check(name)) ok = false; });
    if (!ok) {
      const firstBad = form.querySelector('.bad');
      if (firstBad) firstBad.focus();
      return;
    }
    members.push({
      id: Date.now(),
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      interest: form.interest.value === 'other' ? form.other.value.trim() : form.interest.options[form.interest.selectedIndex].text,
      joined: new Date().toLocaleDateString()
      // The password is deliberately NOT stored. Real apps hash passwords on a server (see Task 6).
    });
    saveMembers(members);
    updateNavCount();
    toast('Welcome, ' + form.username.value.trim() + '!');
    location.hash = '#/members';
  });

  renderStrength();
}

function initMembers() {
  const list = $('#memberList');
  const search = $('#search');
  const empty = $('#emptyState');
  const total = $('#memberTotal');

  function render() {
    const q = search.value.trim().toLowerCase();
    const shown = members.filter(m => m.username.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));

    list.replaceChildren();                                   // clear, then rebuild
    shown.forEach(m => {
      const remove = el('button', { class: 'remove', type: 'button', 'aria-label': 'Remove ' + m.username, text: 'Remove' });
      remove.addEventListener('click', () => {
        members = members.filter(x => x.id !== m.id);
        saveMembers(members);
        updateNavCount();
        render();
        toast(m.username + ' was removed.');
      });
      list.append(el('li', { class: 'member' },
        el('div', { class: 'avatar', 'aria-hidden': 'true', text: m.username[0].toUpperCase() }),
        el('div', { class: 'member-info' },
          el('strong', { text: m.username }),
          el('span', { text: m.email + ' - joined ' + m.joined })),
        el('span', { class: 'tag', text: m.interest }),
        remove));
    });

    total.textContent = members.length ? `(${shown.length} of ${members.length})` : '';
    empty.classList.toggle('hidden', shown.length > 0);
    if (!members.length) {
      empty.replaceChildren('No members yet. ', el('a', { href: '#/register', text: 'Be the first to join.' }));
    } else if (!shown.length) {
      empty.textContent = 'No one matches "' + search.value + '".';
    }
  }

  search.addEventListener('input', render);
  render();
}

/* ------------------------------------------------------------------
   5. The router
------------------------------------------------------------------ */
const routes = {
  '/':         { tpl: 'tpl-home',     title: 'Home' },
  '/register': { tpl: 'tpl-register', title: 'Join',    init: initRegister },
  '/members':  { tpl: 'tpl-members',  title: 'Members', init: initMembers },
  '/about':    { tpl: 'tpl-about',    title: 'About' }
};

function currentPath() {
  const path = location.hash.replace(/^#/, '') || '/';
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function router() {
  const path = currentPath();
  const route = routes[path];
  const tpl = document.getElementById(route ? route.tpl : 'tpl-404');

  view.replaceChildren(tpl.content.cloneNode(true));          // swap the page content
  if (route && route.init) route.init();
  if (!route) $('#badPath').textContent = '#' + path;

  document.title = (route ? route.title : 'Not found') + ' | Task 4';
  document.querySelectorAll('.topbar nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.route === path);
  });
  view.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
updateNavCount();
router();
