// Apply theme + language immediately to prevent flash
;(function(){
  document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light'
  var l = localStorage.getItem('lang') || 'ar'
  document.documentElement.lang = l
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
})()

// ── THEME ──
function toggleTheme() {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = t
  localStorage.setItem('theme', t)
  const btn = document.getElementById('theme-btn')
  if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙'
}

// ── LANGUAGE ──
function applyLang(l) {
  document.documentElement.lang = l
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
  document.querySelectorAll('[data-en][data-ar]').forEach(el => {
    if (!el.querySelector('[data-en]')) el.textContent = l === 'ar' ? el.dataset.ar : el.dataset.en
  })
  document.querySelectorAll('[data-en-ph]').forEach(el => {
    el.placeholder = l === 'ar' ? (el.dataset.arPh || el.dataset.enPh) : el.dataset.enPh
  })
  // Nav lang btn (top)
  const lb = document.getElementById('lang-btn')
  if (lb) lb.textContent = l === 'ar' ? 'EN' : 'عربي'
  // Float lang btn (bottom)
  const flb = document.getElementById('lang-float-btn')
  if (flb) flb.textContent = l === 'ar' ? 'EN' : 'عربي'
}

function toggleLang() {
  const l = (localStorage.getItem('lang') || 'ar') === 'ar' ? 'en' : 'ar'
  localStorage.setItem('lang', l)
  applyLang(l)
}

// ── AUTH ──
function getUser() {
  try { return JSON.parse(localStorage.getItem('ks_user') || 'null') } catch { return null }
}

function logout() {
  localStorage.removeItem('ks_user')
  window.location.href = '/'
}

function updateNavAuth() {
  const u = getUser()
  const $ = id => document.getElementById(id)
  if (u) {
    if ($('nav-login')) $('nav-login').style.display = 'none'
    if ($('nav-register')) $('nav-register').style.display = 'none'
    if ($('nav-user')) {
      $('nav-user').style.display = 'flex'
      const sp = $('nav-user').querySelector('.nav-username')
      if (sp) sp.textContent = u.name
    }
    if ($('nav-logout')) $('nav-logout').style.display = 'flex'
  } else {
    if ($('nav-login')) $('nav-login').style.display = ''
    if ($('nav-register')) $('nav-register').style.display = ''
    if ($('nav-user')) $('nav-user').style.display = 'none'
    if ($('nav-logout')) $('nav-logout').style.display = 'none'
  }
}

// ── CART ──
function addToCart(name, price, qty, nameAr) {
  qty = qty || 1
  let cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const ex = cart.find(i => i.name === name)
  if (ex) ex.qty += qty
  else cart.push({ name, nameAr: nameAr || name, price, qty })
  localStorage.setItem('cart', JSON.stringify(cart))
  updateCartCount()
  const lang = localStorage.getItem('lang') || 'ar'
  const displayName = (lang === 'ar' && nameAr) ? nameAr : name
  const msg = lang === 'ar' ? ('✅ تمت الإضافة: ' + displayName) : ('✅ ' + name + ' added to cart!')
  const t = document.getElementById('toast')
  if (t) {
    t.textContent = msg
    t.classList.add('show')
    setTimeout(() => t.classList.remove('show'), 2500)
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const total = cart.reduce((s, i) => s + i.qty, 0)
  const el = document.getElementById('cart-count')
  if (el) el.textContent = total
  const mb = document.getElementById('mnav-count')
  if (mb) { mb.textContent = total; mb.style.display = total > 0 ? 'flex' : 'none' }
}

// ── MOBILE MENU ──
function openMenu() {
  document.getElementById('slide-menu')?.classList.add('open')
  document.getElementById('slide-overlay')?.classList.add('open')
  document.body.style.overflow = 'hidden'
}
function closeMenu() {
  document.getElementById('slide-menu')?.classList.remove('open')
  document.getElementById('slide-overlay')?.classList.remove('open')
  document.body.style.overflow = ''
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  const t = document.documentElement.dataset.theme || 'light'
  const tb = document.getElementById('theme-btn')
  if (tb) tb.textContent = t === 'dark' ? '☀️' : '🌙'
  const l = localStorage.getItem('lang') || 'ar'
  applyLang(l)
  updateNavAuth()
  updateCartCount()
  // sync mobile nav badge
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const total = cart.reduce((s, i) => s + i.qty, 0)
  const mb = document.getElementById('mnav-count')
  if (mb) { mb.textContent = total; mb.style.display = total > 0 ? 'flex' : 'none' }
  // highlight active mobile nav item
  const path = window.location.pathname
  document.querySelectorAll('.mnav-item').forEach(el => {
    const href = el.getAttribute('href')
    if (href && (href === path || (href !== '/' && path.startsWith(href)))) el.classList.add('active')
  })
})
