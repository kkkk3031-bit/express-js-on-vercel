// Apply theme immediately to prevent flash
;(function(){ document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light' })()

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
  const lb = document.getElementById('lang-btn')
  if (lb) lb.textContent = l === 'ar' ? 'EN' : 'عربي'
}

function toggleLang() {
  const l = (localStorage.getItem('lang') || 'en') === 'ar' ? 'en' : 'ar'
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
function addToCart(name, price, qty) {
  qty = qty || 1
  let cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const ex = cart.find(i => i.name === name)
  if (ex) ex.qty += qty; else cart.push({ name, price, qty })
  localStorage.setItem('cart', JSON.stringify(cart))
  updateCartCount()
  const t = document.getElementById('toast')
  if (t) {
    t.textContent = '✅ ' + name + ' added to cart!'
    t.classList.add('show')
    setTimeout(() => t.classList.remove('show'), 2500)
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const el = document.getElementById('cart-count')
  if (el) el.textContent = cart.reduce((s, i) => s + i.qty, 0)
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  const t = document.documentElement.dataset.theme || 'light'
  const tb = document.getElementById('theme-btn')
  if (tb) tb.textContent = t === 'dark' ? '☀️' : '🌙'
  applyLang(localStorage.getItem('lang') || 'en')
  updateNavAuth()
  updateCartCount()
})
