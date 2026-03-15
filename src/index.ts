import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'public')))

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin2024'
const ADMIN_TOKEN = crypto.createHash('sha256').update(ADMIN_PASS + 'ks').digest('hex').slice(0, 32)

// ── TYPES ──
type Product = {
  id: number; name: string; nameAr: string; price: number; emoji: string
  category: string; categoryAr: string; badge: string; desc: string; descAr: string
  specs: Record<string, string>
}
type Order = {
  id: string; name: string; phone: string; email: string; area: string
  address: string; payment: string; items: Array<{name:string;price:number;qty:number}>
  total: number; createdAt: string; status: string
}

// ── PRODUCTS ──
let PRODUCTS: Product[] = [
  { id: 1,  name: 'iPhone 15 Pro Max',      nameAr: 'آيفون 15 برو ماكس',    price: 319.0, emoji: '📱', category: 'Phones',   categoryAr: 'هواتف',     badge: 'hot',  desc: 'Apple A17 Pro chip, 48MP camera, titanium design, USB-C, ProMotion 120Hz display.',      descAr: 'شريحة Apple A17 Pro، كاميرا 48MP، تصميم تيتانيوم، USB-C، شاشة 120Hz.',   specs: { Chip: 'A17 Pro', Camera: '48MP Triple', Display: '6.7" OLED 120Hz', Storage: '256GB' } },
  { id: 2,  name: 'Samsung Galaxy S24 Ultra',nameAr: 'سامسونج جالاكسي S24 ألترا', price: 289.0, emoji: '📲', category: 'Phones',   categoryAr: 'هواتف',     badge: 'new',  desc: 'Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, 12GB RAM, 6.8" Dynamic AMOLED.',    descAr: 'معالج Snapdragon 8 Gen 3، كاميرا 200MP، قلم S Pen، ذاكرة 12GB.',         specs: { Processor: 'Snapdragon 8 Gen 3', Camera: '200MP Quad', RAM: '12GB', Display: '6.8" AMOLED' } },
  { id: 3,  name: 'PlayStation 5',          nameAr: 'بلايستيشن 5',           price: 149.0, emoji: '🎮', category: 'Gaming',   categoryAr: 'ألعاب',     badge: 'hot',  desc: 'Next-gen gaming console, 4K@120fps, ray tracing, 825GB SSD, DualSense controller.',     descAr: 'جهاز ألعاب الجيل الجديد، 4K بـ120fps، تتبع أشعة، SSD 825GB.',             specs: { GPU: '10.28 TFLOPS', Resolution: '4K 120fps', Storage: '825GB SSD', Audio: '3D Tempest' } },
  { id: 4,  name: 'Xbox Series X',          nameAr: 'إكس بوكس سيريس إكس',   price: 129.0, emoji: '🕹️', category: 'Gaming',   categoryAr: 'ألعاب',     badge: 'sale', desc: 'Most powerful Xbox ever, 12 TFLOPS GPU, 4K@120fps, 1TB SSD, Quick Resume.',            descAr: 'أقوى Xbox على الإطلاق، GPU بـ12 TFLOPS، 4K بـ120fps، SSD 1TB.',           specs: { GPU: '12 TFLOPS', Resolution: '4K 120fps', Storage: '1TB SSD', RAM: '16GB GDDR6' } },
  { id: 5,  name: 'Samsung 65" QLED 4K TV', nameAr: 'تلفزيون سامسونج 65 QLED 4K', price: 399.0, emoji: '📺', category: 'TVs',  categoryAr: 'تلفزيونات', badge: 'hot',  desc: 'Quantum HDR, 120Hz, Smart TV with Tizen OS, Dolby Atmos, built-in Alexa & Bixby.',     descAr: 'Quantum HDR، 120Hz، تلفاز ذكي بنظام Tizen، Dolby Atmos، Alexa.',        specs: { Panel: 'QLED', Resolution: '4K UHD', Refresh: '120Hz', HDR: 'Quantum HDR 2000' } },
  { id: 6,  name: 'LG C3 OLED 55"',        nameAr: 'إل جي OLED C3 55 بوصة', price: 349.0, emoji: '🖥️', category: 'TVs',    categoryAr: 'تلفزيونات', badge: 'new',  desc: 'Perfect blacks, OLED evo panel, 4K 120Hz, G-Sync, FreeSync, webOS 23, Dolby Vision.',  descAr: 'لوح OLED evo، 4K بـ120Hz، G-Sync، webOS 23، Dolby Vision IQ.',           specs: { Panel: 'OLED evo', Resolution: '4K', Refresh: '120Hz', Gaming: 'G-Sync + FreeSync' } },
  { id: 7,  name: 'MacBook Pro M3',         nameAr: 'ماك بوك برو M3',        price: 489.0, emoji: '💻', category: 'Laptops', categoryAr: 'لابتوب',    badge: 'new',  desc: 'Apple M3 chip, 18-hour battery, Liquid Retina XDR display, 16GB RAM, 512GB SSD.',     descAr: 'شريحة Apple M3، بطارية 18 ساعة، شاشة Liquid Retina XDR، 16GB RAM.',      specs: { Chip: 'Apple M3', RAM: '16GB', Storage: '512GB SSD', Battery: '18 hours' } },
  { id: 8,  name: 'AirPods Pro 2',         nameAr: 'إيربودز برو 2',          price: 79.0,  emoji: '🎧', category: 'Audio',   categoryAr: 'صوتيات',    badge: 'hot',  desc: 'Active noise cancellation, Adaptive Audio, H2 chip, 30hr battery, USB-C case.',        descAr: 'إلغاء ضجيج نشط، صوت تكيفي، شريحة H2، بطارية 30 ساعة.',                  specs: { Chip: 'Apple H2', ANC: 'Adaptive ANC', Battery: '30hr total', Case: 'USB-C MagSafe' } },
  { id: 9,  name: 'iPad Pro 12.9"',        nameAr: 'آيباد برو 12.9 بوصة',   price: 349.0, emoji: '📟', category: 'Tablets', categoryAr: 'أجهزة لوحية',badge: 'new',  desc: 'M2 chip, Liquid Retina XDR, 12MP camera, 5G, Apple Pencil 2 support, 256GB.',         descAr: 'شريحة M2، شاشة Liquid Retina XDR، كاميرا 12MP، 5G، دعم Apple Pencil 2.', specs: { Chip: 'Apple M2', Display: '12.9" XDR', Storage: '256GB', Connectivity: '5G + WiFi 6E' } },
  { id: 10, name: 'RTX 4080 Super GPU',    nameAr: 'كارت شاشة RTX 4080 سوبر', price: 249.0, emoji: '⚡', category: 'Gaming', categoryAr: 'ألعاب',     badge: 'sale', desc: 'NVIDIA Ada Lovelace, 16GB GDDR6X, DLSS 3, ray tracing, 4K gaming powerhouse.',         descAr: 'بنية NVIDIA Ada Lovelace، 16GB GDDR6X، DLSS 3، تتبع أشعة، ألعاب 4K.',    specs: { VRAM: '16GB GDDR6X', Architecture: 'Ada Lovelace', TDP: '320W', Ports: '3x DP + HDMI' } },
  { id: 11, name: 'Sony WH-1000XM5',       nameAr: 'سوني WH-1000XM5',       price: 89.0,  emoji: '🎵', category: 'Audio',   categoryAr: 'صوتيات',    badge: 'sale', desc: 'Industry-leading ANC, 30hr battery, Multipoint, LDAC hi-res audio, speak-to-chat.',   descAr: 'إلغاء ضجيج رائد في الصناعة، بطارية 30 ساعة، صوت LDAC عالي الدقة.',       specs: { ANC: 'Industry-leading', Battery: '30 hours', Driver: '30mm', Codec: 'LDAC Hi-Res' } },
  { id: 12, name: 'Apple Watch Ultra 2',   nameAr: 'ساعة آبل ألترا 2',      price: 129.0, emoji: '⌚', category: 'Wearables',categoryAr: 'إكسسوارات', badge: 'new',  desc: 'S9 chip, titanium case, 60hr battery, dual-frequency GPS, 100m water resistance.',     descAr: 'شريحة S9، علبة تيتانيوم، بطارية 60 ساعة، GPS ثنائي التردد، مقاومة ماء 100م.',specs: { Chip: 'Apple S9', Case: 'Titanium', Battery: '60 hours', Water: '100m WR' } },
]

const ORDERS: Order[] = []

// ── HELPERS ──
const badgeColors: Record<string, string> = { new: '#6366f1', sale: '#06b6d4', hot: '#f59e0b' }
const badgeAr: Record<string, string> = { new: 'جديد', sale: 'تخفيض', hot: 'رائج' }
const categoryArMap: Record<string, string> = { Phones:'هواتف', Gaming:'ألعاب', TVs:'تلفزيونات', Laptops:'لابتوب', Audio:'صوتيات', Tablets:'أجهزة لوحية', Wearables:'إكسسوارات', Accessories:'إكسسوارات', Bags:'حقائب', Beauty:'جمال', Fashion:'أزياء', Food:'أغذية', Home:'منزل', Jewelry:'مجوهرات' }

function isAdmin(req: express.Request): boolean {
  const cookies = Object.fromEntries(
    (req.headers.cookie || '').split(';').filter(Boolean).map(c => {
      const [k, ...v] = c.trim().split('=')
      return [k, v.join('=')]
    })
  )
  return cookies['ks_admin'] === ADMIN_TOKEN
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!isAdmin(req)) return res.redirect('/admin/login')
  next()
}

// ── TEMPLATES ──
const topbarHTML = `<div class="topbar">🚚 <span data-en="Free delivery across Kuwait on orders over 10 KD" data-ar="توصيل مجاني في الكويت للطلبات فوق 10 دينار">Free delivery across Kuwait on orders over 10 KD</span> &nbsp;|&nbsp; 📞 +965 5555 5555</div>`

const navHTML = `
<nav>
  <a class="logo" href="/">Kuwait<span>Store</span></a>
  <button class="hamburger" onclick="this.parentNode.querySelector('.nav-links').classList.toggle('open')" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
  <div class="nav-links">
    <a href="/" data-en="Home" data-ar="الرئيسية">Home</a>
    <a href="/products" data-en="Products" data-ar="المنتجات">Products</a>
    <a href="/about" data-en="About" data-ar="عن المتجر">About</a>
    <a href="/contact" data-en="Contact" data-ar="اتصل بنا">Contact</a>
    <a href="/login" id="nav-login" data-en="Login" data-ar="دخول">Login</a>
    <a href="/register" id="nav-register" data-en="Register" data-ar="تسجيل">Register</a>
    <a href="/account" id="nav-user" style="display:none">👤 <span class="nav-username"></span></a>
    <button id="nav-logout" class="nav-btn" onclick="logout()" style="display:none" data-en="Logout" data-ar="خروج">Logout</button>
    <a href="/cart" class="nav-cart">🛒 <span data-en="Cart" data-ar="السلة">Cart</span> <span class="cart-count" id="cart-count">0</span></a>
    <button id="theme-btn" class="icon-btn" onclick="toggleTheme()" title="Dark/Light">🌙</button>
    <button id="lang-btn" class="icon-btn lang-btn" onclick="toggleLang()">عربي</button>
  </div>
</nav>`

const whatsappHTML = `<a href="https://wa.me/96555555555?text=Hello%20Kuwait%20Store!" class="whatsapp-btn" target="_blank" title="WhatsApp">💬</a>`

const footerHTML = `
<div class="newsletter">
  <h2 data-en="Stay Updated" data-ar="ابق على اطلاع">Stay Updated</h2>
  <p data-en="Subscribe for exclusive deals and new arrivals" data-ar="اشترك للحصول على عروض حصرية">Subscribe for exclusive deals and new arrivals</p>
  <form class="newsletter-form" onsubmit="this.innerHTML='<p style=color:white>✅ Subscribed!</p>';return false;">
    <input type="email" placeholder="Your email address" data-en-ph="Your email address" data-ar-ph="بريدك الإلكتروني" required/>
    <button type="submit" data-en="Subscribe" data-ar="اشترك">Subscribe</button>
  </form>
</div>
<footer>
  <div class="footer-grid">
    <div class="footer-col">
      <h4>Kuwait Store</h4>
      <p data-en="Your trusted online shopping destination in Kuwait since 2020." data-ar="وجهتك التسوقية الموثوقة في الكويت منذ 2020.">Your trusted online shopping destination in Kuwait since 2020.</p>
      <div class="footer-social">
        <a class="social-icon" href="#" title="Instagram">📸</a>
        <a class="social-icon" href="#" title="Twitter">🐦</a>
        <a class="social-icon" href="#" title="Snapchat">👻</a>
        <a class="social-icon" href="#" title="TikTok">🎵</a>
      </div>
    </div>
    <div class="footer-col">
      <h4 data-en="Quick Links" data-ar="روابط سريعة">Quick Links</h4>
      <a href="/" data-en="Home" data-ar="الرئيسية">Home</a>
      <a href="/products" data-en="All Products" data-ar="جميع المنتجات">All Products</a>
      <a href="/about" data-en="About Us" data-ar="عن المتجر">About Us</a>
      <a href="/contact" data-en="Contact" data-ar="اتصل بنا">Contact</a>
      <a href="/cart" data-en="My Cart" data-ar="سلتي">My Cart</a>
    </div>
    <div class="footer-col">
      <h4 data-en="Categories" data-ar="الفئات">Categories</h4>
      <a href="/products?cat=Accessories" data-en="Accessories" data-ar="إكسسوارات">Accessories</a>
      <a href="/products?cat=Fashion" data-en="Fashion" data-ar="أزياء">Fashion</a>
      <a href="/products?cat=Beauty" data-en="Beauty" data-ar="جمال">Beauty</a>
      <a href="/products?cat=Jewelry" data-en="Jewelry" data-ar="مجوهرات">Jewelry</a>
      <a href="/products?cat=Home" data-en="Home" data-ar="منزل">Home</a>
      <a href="/products?cat=Food" data-en="Food" data-ar="أغذية">Food</a>
    </div>
    <div class="footer-col">
      <h4 data-en="Customer Service" data-ar="خدمة العملاء">Customer Service</h4>
      <a href="/contact" data-en="Contact Us" data-ar="اتصل بنا">Contact Us</a>
      <a href="https://wa.me/96555555555" target="_blank">WhatsApp</a>
      <a href="mailto:info@kuwait-store.com">info@kuwait-store.com</a>
      <a href="tel:+96555555555">+965 5555 5555</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; ${new Date().getFullYear()} <span>Kuwait Store</span>. All rights reserved. &nbsp;|&nbsp; Made with ❤️ in Kuwait 🇰🇼</p>
  </div>
</footer>`

const page = (title: string, breadcrumb: string, body: string, meta = '') => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="description" content="${meta || 'Kuwait Store - Premium online shopping in Kuwait.'}"/>
  <title>${title} | Kuwait Store</title>
  <link rel="stylesheet" href="/style.css"/>
  <link rel="icon" href="/logo.png"/>
  <script>document.documentElement.dataset.theme=localStorage.getItem('theme')||'light'</script>
</head>
<body>
  ${topbarHTML}
  ${navHTML}
  ${breadcrumb ? `<div class="breadcrumb"><a href="/" data-en="Home" data-ar="الرئيسية">Home</a> › ${breadcrumb}</div>` : ''}
  ${body}
  ${whatsappHTML}
  <div class="toast" id="toast"></div>
  ${footerHTML}
  <script src="/app.js"></script>
</body>
</html>`

const productCard = (p: Product) => `
<div class="product-card">
  <div class="product-img" onclick="location.href='/products/${p.id}'">
    ${p.badge ? `<div class="product-badge" style="background:${badgeColors[p.badge]}"><span data-en="${p.badge.toUpperCase()}" data-ar="${badgeAr[p.badge]}">${p.badge.toUpperCase()}</span></div>` : ''}
    ${p.emoji}
  </div>
  <div class="product-info">
    <div class="product-tag" data-en="${p.category}" data-ar="${p.categoryAr}">${p.category}</div>
    <h3 onclick="location.href='/products/${p.id}'" data-en="${p.name}" data-ar="${p.nameAr}">${p.name}</h3>
    <p data-en="${p.desc.slice(0,80)}..." data-ar="${p.descAr.slice(0,80)}...">${p.desc.slice(0,80)}...</p>
    <div class="product-footer">
      <span class="price">${p.price.toFixed(3)} KD</span>
      <button class="add-cart" onclick="addToCart('${p.name}',${p.price})"><span data-en="+ Cart" data-ar="+ السلة">+ Cart</span></button>
    </div>
  </div>
</div>`

// ── HOME ──
app.get('/', (_req, res) => {
  const featured = PRODUCTS.filter(p => p.badge === 'hot').slice(0, 6)
  const cats = [
    { icon: '📱', name: 'Phones',   nameAr: 'هواتف',     cat: 'Phones' },
    { icon: '🎮', name: 'Gaming',   nameAr: 'ألعاب',     cat: 'Gaming' },
    { icon: '📺', name: 'TVs',      nameAr: 'تلفزيونات', cat: 'TVs' },
    { icon: '💻', name: 'Laptops',  nameAr: 'لابتوب',    cat: 'Laptops' },
    { icon: '🎧', name: 'Audio',    nameAr: 'صوتيات',    cat: 'Audio' },
    { icon: '📟', name: 'Tablets',  nameAr: 'لوحيات',    cat: 'Tablets' },
    { icon: '⌚', name: 'Wearables',nameAr: 'إكسسوارات', cat: 'Wearables' },
    { icon: '⚡', name: 'All',      nameAr: 'الكل',      cat: '' },
  ]
  const catCards = cats.map(c => `
    <a class="cat-card" href="/products${c.cat ? '?cat='+c.cat : ''}">
      <span class="cat-card-icon">${c.icon}</span>
      <div class="cat-card-name" data-en="${c.name}" data-ar="${c.nameAr}">${c.name}</div>
    </a>`).join('')

  res.type('html').send(page('Home', '', `
    <div class="hero">
      <div class="hero-bg-grid"></div>
      <div class="hero-glow-1"></div>
      <div class="hero-glow-2"></div>
      <div class="hero-content">
        <div class="hero-badge">⚡ <span data-en="NEW ARRIVALS 2025" data-ar="وصل حديثاً 2025">NEW ARRIVALS 2025</span></div>
        <h1>
          <span data-en="Shop the Latest" data-ar="تسوق أحدث">Shop the Latest</span>
          <span class="line2 gradient-text" data-en="Technology" data-ar="التكنولوجيا">Technology</span>
        </h1>
        <p data-en="Kuwait's #1 electronics store — phones, gaming, TVs, laptops and more. Same-day delivery." data-ar="متجر الإلكترونيات الأول في الكويت — هواتف، ألعاب، تلفزيونات، لابتوب والمزيد. توصيل في نفس اليوم.">Kuwait's #1 electronics store — phones, gaming, TVs, laptops and more. Same-day delivery.</p>
        <div class="hero-btns">
          <a href="/products" class="btn btn-primary" data-en="🛍️ Shop Now" data-ar="🛍️ تسوق الآن">🛍️ Shop Now</a>
          <a href="/products?cat=Gaming" class="btn btn-outline" data-en="🎮 Gaming Deals" data-ar="🎮 عروض الألعاب">🎮 Gaming Deals</a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><div class="num">500+</div><div class="lbl" data-en="Products" data-ar="منتج">Products</div></div>
          <div class="hero-stat"><div class="num">50K+</div><div class="lbl" data-en="Customers" data-ar="عميل">Customers</div></div>
          <div class="hero-stat"><div class="num">4.9★</div><div class="lbl" data-en="Rating" data-ar="تقييم">Rating</div></div>
          <div class="hero-stat"><div class="num" data-en="Same Day" data-ar="نفس اليوم">Same Day</div><div class="lbl" data-en="Delivery" data-ar="توصيل">Delivery</div></div>
        </div>
      </div>
    </div>

    <div class="search-bar">
      <form action="/products" method="GET" style="display:flex;width:100%;max-width:580px">
        <input type="text" name="q" data-en-ph="Search phones, TVs, gaming..." data-ar-ph="ابحث عن هواتف، تلفزيونات، ألعاب..." placeholder="Search phones, TVs, gaming..."/>
        <button type="submit">🔍</button>
      </form>
    </div>

    <div class="categories-section">
      <h2 data-en="Shop by Category" data-ar="تسوق حسب الفئة">Shop by Category</h2>
      <div class="cat-cards-grid">${catCards}</div>
    </div>

    <div class="promo-banner">
      <div class="promo-content">
        <div class="promo-badge" data-en="LIMITED TIME" data-ar="عرض محدود">LIMITED TIME</div>
        <h3 data-en="Gaming Week — Up to 30% OFF" data-ar="أسبوع الألعاب — خصم يصل إلى 30٪">Gaming Week — Up to 30% OFF</h3>
        <p data-en="PS5, Xbox Series X, RTX 4080 and more. Don't miss out!" data-ar="PS5، Xbox Series X، RTX 4080 والمزيد. لا تفوت الفرصة!">PS5, Xbox Series X, RTX 4080 and more. Don't miss out!</p>
        <a href="/products?cat=Gaming" class="btn btn-primary" style="margin-top:1.2rem;display:inline-block" data-en="Shop Gaming →" data-ar="تسوق الألعاب →">Shop Gaming →</a>
      </div>
      <div class="promo-emoji">🎮</div>
    </div>

    <div class="features">
      <div class="features-grid">
        <div class="feature-item"><div class="feature-icon">🚀</div><h3 data-en="Same-Day Delivery" data-ar="توصيل في نفس اليوم">Same-Day Delivery</h3><p data-en="Order before 2PM, get it today" data-ar="اطلب قبل 2 ظهراً واستلمه اليوم">Order before 2PM, get it today</p></div>
        <div class="feature-item"><div class="feature-icon">🔒</div><h3 data-en="Secure Payment" data-ar="دفع آمن">Secure Payment</h3><p data-en="KNET, Visa, Mastercard & Cash" data-ar="كي نت، فيزا، ماستركارد ونقداً">KNET, Visa, Mastercard & Cash</p></div>
        <div class="feature-item"><div class="feature-icon">✅</div><h3 data-en="Official Warranty" data-ar="ضمان رسمي">Official Warranty</h3><p data-en="All products have official warranty" data-ar="جميع المنتجات بضمان رسمي">All products have official warranty</p></div>
        <div class="feature-item"><div class="feature-icon">💬</div><h3 data-en="24/7 Support" data-ar="دعم 24/7">24/7 Support</h3><p data-en="WhatsApp & phone support" data-ar="دعم واتساب وهاتف">WhatsApp & phone support</p></div>
      </div>
    </div>

    <section>
      <h2 class="section-title">🔥 <span data-en="Hot Deals" data-ar="أقوى العروض">Hot Deals</span></h2>
      <div class="products-grid">${featured.map(productCard).join('')}</div>
      <div style="text-align:center;margin-top:2.5rem">
        <a href="/products" class="btn btn-primary" data-en="View All Products →" data-ar="عرض جميع المنتجات →">View All Products →</a>
      </div>
    </section>

    <div class="testimonials">
      <div class="testimonials-inner">
        <h2 data-en="What Customers Say" data-ar="ماذا يقول عملاؤنا">What Customers Say</h2>
        <div class="reviews-grid">
          <div class="review-card"><div class="review-stars">★★★★★</div><p class="review-text" data-en='"Got my PS5 same day! Incredible service and great price. Best tech store in Kuwait."' data-ar='"وصل PS5 في نفس اليوم! خدمة رائعة وسعر ممتاز. أفضل متجر تقنية في الكويت."'>"Got my PS5 same day! Incredible service and great price. Best tech store in Kuwait."</p><div class="review-author">Khalid Al-Mutairi</div><div class="review-loc">Kuwait City</div></div>
          <div class="review-card"><div class="review-stars">★★★★★</div><p class="review-text" data-en='"My new iPhone 15 Pro arrived perfectly packed. Official warranty, amazing deal!"' data-ar='"وصل آيفون 15 برو بتغليف ممتاز. ضمان رسمي وسعر رائع!"'>"My new iPhone 15 Pro arrived perfectly packed. Official warranty, amazing deal!"</p><div class="review-author">Sara Al-Rashidi</div><div class="review-loc">Salmiya</div></div>
          <div class="review-card"><div class="review-stars">★★★★★</div><p class="review-text" data-en='"The LG OLED TV picture quality is insane. Fast delivery and great customer service!"' data-ar='"جودة صورة تلفاز LG OLED خيالية. توصيل سريع وخدمة عملاء ممتازة!"'>"The LG OLED TV picture quality is insane. Fast delivery and great customer service!"</p><div class="review-author">Mohammed Al-Sabah</div><div class="review-loc">Hawalli</div></div>
        </div>
      </div>
    </div>
  `))
})

// ── PRODUCTS LIST ──
app.get('/products', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase()
  const cat = (req.query.cat as string) || ''
  const sort = (req.query.sort as string) || ''
  const categories = [...new Set(PRODUCTS.map(p => p.category))]

  let filtered = PRODUCTS
  if (query) filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.nameAr.includes(query) || p.desc.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
  if (cat) filtered = filtered.filter(p => p.category === cat)
  if (sort === 'asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))

  const catBtns = ['All', ...categories].map(c =>
    `<button class="cat-btn ${cat === c || (c === 'All' && !cat) ? 'active' : ''}" onclick="location.href='/products${c === 'All' ? '' : '?cat=' + c}'">${c}</button>`
  ).join('')

  const cards = filtered.length
    ? filtered.map(productCard).join('')
    : '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:3rem">No products found. <a href="/products" style="color:var(--primary)">Clear search</a></p>'

  res.type('html').send(page('Products', 'Products', `
    <section>
      <h2 class="section-title"><span data-en="All Products" data-ar="جميع المنتجات">All Products</span> ${query ? `— "${query}"` : ''} <span style="font-size:1rem;font-weight:400;color:var(--muted)">(${filtered.length})</span></h2>
      <div class="search-bar" style="padding:0 0 1.5rem;background:none;box-shadow:none;justify-content:flex-start">
        <form action="/products" method="GET" style="display:flex;width:100%;max-width:500px">
          ${cat ? `<input type="hidden" name="cat" value="${cat}"/>` : ''}
          <input type="text" name="q" data-en-ph="Search products..." data-ar-ph="ابحث عن منتجات..." placeholder="Search products..." value="${query}"/>
          <button type="submit">🔍</button>
        </form>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1rem">
        <div class="categories">${catBtns}</div>
        <select onchange="location.href='/products?${cat ? 'cat=' + cat + '&' : ''}${query ? 'q=' + query + '&' : ''}sort='+this.value" style="padding:0.4rem 0.8rem;border:2px solid var(--border);border-radius:6px;font-size:0.88rem;background:var(--card);color:var(--text)">
          <option value="" ${!sort ? 'selected' : ''}>Sort: Default</option>
          <option value="asc" ${sort==='asc'?'selected':''}>Price: Low → High</option>
          <option value="desc" ${sort==='desc'?'selected':''}>Price: High → Low</option>
          <option value="name" ${sort==='name'?'selected':''}>Name A–Z</option>
        </select>
      </div>
      <div class="products-grid">${cards}</div>
    </section>
  `))
})

// ── PRODUCT DETAIL ──
app.get('/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === parseInt(req.params.id))
  if (!product) return res.redirect('/products')

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)
  const specRows = Object.entries(product.specs).map(([k, v]) =>
    `<div class="spec-row"><span class="spec-key">${k}</span><span class="spec-val">${v}</span></div>`
  ).join('')

  res.type('html').send(page(product.name, `<a href="/products" data-en="Products" data-ar="المنتجات">Products</a> › <span data-en="${product.name}" data-ar="${product.nameAr}">${product.name}</span>`, `
    <section>
      <div class="product-detail">
        <div class="product-detail-img">${product.emoji}</div>
        <div class="product-detail-info">
          <div class="product-tag" data-en="${product.category}" data-ar="${product.categoryAr}">${product.category}</div>
          <h1 data-en="${product.name}" data-ar="${product.nameAr}">${product.name}</h1>
          <div class="review-stars" style="font-size:1.1rem">★★★★★ <span style="color:var(--muted);font-size:0.9rem">(48 reviews)</span></div>
          <span class="price">${product.price.toFixed(3)} KD</span>
          <p data-en="${product.desc}" data-ar="${product.descAr}">${product.desc}</p>
          <div class="qty-control">
            <button onclick="if(parseInt(document.getElementById('qty').textContent)>1)document.getElementById('qty').textContent=parseInt(document.getElementById('qty').textContent)-1">−</button>
            <span id="qty">1</span>
            <button onclick="document.getElementById('qty').textContent=parseInt(document.getElementById('qty').textContent)+1">+</button>
          </div>
          <div class="detail-actions">
            <button class="btn btn-primary" onclick="addToCart('${product.name}',${product.price},parseInt(document.getElementById('qty').textContent))">🛒 <span data-en="Add to Cart" data-ar="أضف للسلة">Add to Cart</span></button>
            <a href="/checkout" class="btn btn-dark" data-en="Buy Now" data-ar="اشتر الآن">Buy Now</a>
            <a href="https://wa.me/96555555555?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(product.name)}" class="btn btn-outline" style="background:#25d366;border-color:#25d366;color:white" target="_blank">💬 WhatsApp</a>
          </div>
          <div class="product-specs">
            <h3 data-en="Specifications" data-ar="المواصفات">Specifications</h3>
            ${specRows}
          </div>
        </div>
      </div>
      ${related.length ? `
        <h2 class="section-title" style="margin-top:3rem" data-en="Related Products" data-ar="منتجات مشابهة">Related Products</h2>
        <div class="products-grid">${related.map(productCard).join('')}</div>
      ` : ''}
    </section>
  `, product.desc))
})

// ── CART ──
app.get('/cart', (_req, res) => {
  res.type('html').send(page('My Cart', 'Cart', `
    <section>
      <h2 class="section-title">🛒 <span data-en="My Cart" data-ar="سلتي">My Cart</span></h2>
      <div id="cart-content"></div>
    </section>
    <script>
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    const el = document.getElementById('cart-content');
    if(!cart.length){
      el.innerHTML='<div style="background:var(--card);padding:3rem;border-radius:12px;text-align:center;box-shadow:var(--shadow)"><div style="font-size:4rem;margin-bottom:1rem">🛒</div><h3 style="margin-bottom:0.5rem">Your cart is empty</h3><p style="color:var(--muted);margin-bottom:1.5rem">Add some products to get started</p><a href="/products" class="btn btn-primary">Browse Products</a></div>';
    } else {
      let total=0;
      let rows=cart.map((it,idx)=>{
        const sub=it.price*it.qty; total+=sub;
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid var(--border);gap:1rem"><div style="display:flex;align-items:center;gap:1rem"><button onclick="removeItem('+idx+')" style="background:rgba(200,16,46,0.1);border:none;color:var(--primary);border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:1rem">×</button><span style="color:var(--text)">'+it.name+'</span></div><div style="display:flex;align-items:center;gap:1rem"><button onclick="changeQty('+idx+',-1)" style="background:var(--light);border:2px solid var(--border);border-radius:4px;width:28px;height:28px;cursor:pointer;color:var(--text)">−</button><span style="min-width:24px;text-align:center;font-weight:700;color:var(--text)">'+it.qty+'</span><button onclick="changeQty('+idx+',1)" style="background:var(--light);border:2px solid var(--border);border-radius:4px;width:28px;height:28px;cursor:pointer;color:var(--text)">+</button><span style="color:var(--primary);font-weight:700;min-width:80px;text-align:right">'+sub.toFixed(3)+' KD</span></div></div>';
      }).join('');
      el.innerHTML='<div style="background:var(--card);padding:2rem;border-radius:12px;box-shadow:var(--shadow)">'+rows+'<div style="display:flex;justify-content:space-between;padding:1.5rem 0 1rem;font-size:1.2rem;font-weight:700;color:var(--text)"><span>Total</span><span style="color:var(--primary)">'+total.toFixed(3)+' KD</span></div><div style="display:flex;gap:1rem;flex-wrap:wrap"><a href="/products" class="btn btn-outline" style="border-color:var(--border);color:var(--text)">← Continue Shopping</a><a href="/checkout" class="btn btn-primary" style="flex:1;text-align:center">Checkout →</a></div></div>';
    }
    function removeItem(idx){const c=JSON.parse(localStorage.getItem('cart')||'[]');c.splice(idx,1);localStorage.setItem('cart',JSON.stringify(c));location.reload();}
    function changeQty(idx,d){const c=JSON.parse(localStorage.getItem('cart')||'[]');c[idx].qty+=d;if(c[idx].qty<1)c.splice(idx,1);localStorage.setItem('cart',JSON.stringify(c));location.reload();}
    </script>
  `))
})

// ── CHECKOUT ──
app.get('/checkout', (_req, res) => {
  res.type('html').send(page('Checkout', 'Checkout', `
    <section>
      <h2 class="section-title" data-en="Checkout" data-ar="إتمام الشراء">Checkout</h2>
      <div class="checkout-grid">
        <div>
          <form class="checkout-form" id="order-form" onsubmit="submitOrder(event)">
            <h3>📍 <span data-en="Delivery Information" data-ar="معلومات التوصيل">Delivery Information</span></h3>
            <label data-en="Full Name" data-ar="الاسم الكامل">Full Name</label>
            <input type="text" id="c-name" data-en-ph="Your full name" data-ar-ph="اسمك الكامل" placeholder="Your full name" required/>
            <label data-en="Phone Number" data-ar="رقم الهاتف">Phone Number</label>
            <input type="tel" id="c-phone" placeholder="+965 XXXX XXXX" required/>
            <label data-en="Email (optional)" data-ar="البريد الإلكتروني (اختياري)">Email (optional)</label>
            <input type="email" id="c-email" placeholder="email@example.com"/>
            <div class="form-row">
              <div>
                <label data-en="Area" data-ar="المنطقة">Area</label>
                <select id="c-area">
                  <option>Kuwait City</option><option>Salmiya</option><option>Hawalli</option>
                  <option>Farwaniya</option><option>Ahmadi</option><option>Jahra</option>
                  <option>Mubarak Al-Kabeer</option>
                </select>
              </div>
              <div>
                <label data-en="Block" data-ar="القطعة">Block</label>
                <input type="text" id="c-block" data-en-ph="Block number" data-ar-ph="رقم القطعة" placeholder="Block number"/>
              </div>
            </div>
            <label data-en="Street & Building" data-ar="الشارع والمبنى">Street & Building</label>
            <input type="text" id="c-address" data-en-ph="Street name, building, apartment" data-ar-ph="اسم الشارع، المبنى، الشقة" placeholder="Street name, building, apartment" required/>
            <h3 style="margin-top:1rem">💳 <span data-en="Payment Method" data-ar="طريقة الدفع">Payment Method</span></h3>
            <div class="payment-methods">
              <div class="pay-method selected" onclick="selectPay(this)">💳 KNET</div>
              <div class="pay-method" onclick="selectPay(this)">💳 Visa/MC</div>
              <div class="pay-method" onclick="selectPay(this)" data-en="💵 Cash on Delivery" data-ar="💵 الدفع عند الاستلام">💵 Cash on Delivery</div>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:1rem;font-size:1.05rem" data-en="Place Order 🛒" data-ar="تأكيد الطلب 🛒">Place Order 🛒</button>
          </form>
        </div>
        <div class="order-summary">
          <h3 data-en="Order Summary" data-ar="ملخص الطلب">Order Summary</h3>
          <div id="summary-items"></div>
          <div class="summary-total"><span data-en="Total" data-ar="الإجمالي">Total</span><span id="summary-total" style="color:var(--primary)">0.000 KD</span></div>
        </div>
      </div>
    </section>
    <script>
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    let total = 0;
    const si = document.getElementById('summary-items');
    if(!cart.length){ si.innerHTML='<p style="color:var(--muted)">Cart is empty</p>'; }
    else {
      si.innerHTML = cart.map(i=>{total+=i.price*i.qty;return '<div class="summary-item"><span>'+i.name+' ×'+i.qty+'</span><span>'+(i.price*i.qty).toFixed(3)+' KD</span></div>';}).join('');
      document.getElementById('summary-total').textContent = total.toFixed(3)+' KD';
    }
    function selectPay(el){document.querySelectorAll('.pay-method').forEach(e=>e.classList.remove('selected'));el.classList.add('selected');}
    async function submitOrder(e){
      e.preventDefault();
      const cart = JSON.parse(localStorage.getItem('cart')||'[]');
      if(!cart.length) return;
      const pay = document.querySelector('.pay-method.selected');
      const order = {
        name: document.getElementById('c-name').value,
        phone: document.getElementById('c-phone').value,
        email: document.getElementById('c-email').value,
        area: document.getElementById('c-area').value,
        address: document.getElementById('c-address').value + (document.getElementById('c-block').value ? ', Block '+document.getElementById('c-block').value : ''),
        payment: pay ? pay.textContent.trim() : 'KNET',
        items: JSON.stringify(cart),
        total: cart.reduce((s,i)=>s+i.price*i.qty,0)
      };
      try {
        const r = await fetch('/api/orders', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(order)});
        const d = await r.json();
        const savedOrders = JSON.parse(localStorage.getItem('ks_orders')||'[]');
        savedOrders.push({id: d.orderId, total: order.total, status:'pending', date: new Date().toLocaleDateString()});
        localStorage.setItem('ks_orders', JSON.stringify(savedOrders));
      } catch(err){}
      localStorage.removeItem('cart');
      window.location.href = '/order-success?name='+encodeURIComponent(order.name);
    }
    </script>
  `))
})

// ── ORDER SUCCESS ──
app.get('/order-success', (req, res) => {
  const name = (req.query.name as string) || 'Customer'
  res.type('html').send(page('Order Placed!', 'Order Confirmation', `
    <section>
      <div class="success-box">
        <div class="checkmark">🎉</div>
        <h2 data-en="Order Placed Successfully!" data-ar="تم تأكيد طلبك!">Order Placed Successfully!</h2>
        <p>Thank you <strong>${name}</strong>! <span data-en="Your order has been received. We will contact you shortly." data-ar="تم استلام طلبك. سنتصل بك قريباً.">Your order has been received. We will contact you shortly.</span></p>
        <p style="margin-bottom:1.5rem;font-size:0.9rem;color:var(--muted)" data-en="Estimated delivery: Same day or next day" data-ar="التوصيل المتوقع: نفس اليوم أو اليوم التالي">Estimated delivery: Same day or next day</p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
          <a href="/" class="btn btn-primary" data-en="Back to Home" data-ar="العودة للرئيسية">Back to Home</a>
          <a href="https://wa.me/96555555555" class="btn btn-dark" target="_blank" data-en="Track via WhatsApp" data-ar="تتبع عبر واتساب">Track via WhatsApp</a>
        </div>
      </div>
    </section>
  `))
})

// ── LOGIN ──
app.get('/login', (req, res) => {
  res.type('html').send(page('Login', 'Login', `
    <section>
      <div class="auth-box">
        <div class="auth-icon">👤</div>
        <h2 data-en="Welcome Back" data-ar="مرحباً بعودتك">Welcome Back</h2>
        <p class="auth-sub" data-en="Login to your Kuwait Store account" data-ar="سجل دخول لحساب كويت ستور">Login to your Kuwait Store account</p>
        <form id="login-form">
          <label data-en="Email" data-ar="البريد الإلكتروني">Email</label>
          <input type="email" id="l-email" data-en-ph="email@example.com" data-ar-ph="بريدك@example.com" placeholder="email@example.com" required/>
          <label data-en="Password" data-ar="كلمة المرور">Password</label>
          <input type="password" id="l-pass" data-en-ph="Your password" data-ar-ph="كلمة مرورك" placeholder="Your password" required/>
          <div id="login-err" style="color:var(--primary);font-size:0.88rem;margin-bottom:0.8rem;display:none"></div>
          <button type="submit" class="btn btn-primary" style="width:100%" data-en="Login" data-ar="دخول">Login</button>
        </form>
        <p class="auth-switch"><span data-en="Don't have an account?" data-ar="ليس لديك حساب؟">Don't have an account?</span> <a href="/register" data-en="Register" data-ar="تسجيل">Register</a></p>
      </div>
    </section>
    <script>
    document.getElementById('login-form').onsubmit = function(e){
      e.preventDefault();
      const email = document.getElementById('l-email').value.toLowerCase();
      const pass = document.getElementById('l-pass').value;
      const users = JSON.parse(localStorage.getItem('ks_users')||'[]');
      const user = users.find(u => u.email === email && u.pass === btoa(pass));
      const err = document.getElementById('login-err');
      if(user){
        localStorage.setItem('ks_user', JSON.stringify({id:user.id, name:user.name, email:user.email}));
        window.location.href = '/account';
      } else {
        err.style.display='block';
        err.textContent='❌ Invalid email or password';
      }
    }
    </script>
  `))
})

// ── REGISTER ──
app.get('/register', (req, res) => {
  res.type('html').send(page('Register', 'Register', `
    <section>
      <div class="auth-box">
        <div class="auth-icon">📝</div>
        <h2 data-en="Create Account" data-ar="إنشاء حساب">Create Account</h2>
        <p class="auth-sub" data-en="Join Kuwait Store today" data-ar="انضم إلى كويت ستور اليوم">Join Kuwait Store today</p>
        <form id="reg-form">
          <label data-en="Full Name" data-ar="الاسم الكامل">Full Name</label>
          <input type="text" id="r-name" data-en-ph="Your full name" data-ar-ph="اسمك الكامل" placeholder="Your full name" required/>
          <label data-en="Email" data-ar="البريد الإلكتروني">Email</label>
          <input type="email" id="r-email" data-en-ph="email@example.com" data-ar-ph="بريدك@example.com" placeholder="email@example.com" required/>
          <label data-en="Password" data-ar="كلمة المرور">Password</label>
          <input type="password" id="r-pass" data-en-ph="Minimum 6 characters" data-ar-ph="6 أحرف على الأقل" placeholder="Minimum 6 characters" required minlength="6"/>
          <div id="reg-err" style="color:var(--primary);font-size:0.88rem;margin-bottom:0.8rem;display:none"></div>
          <button type="submit" class="btn btn-primary" style="width:100%" data-en="Create Account" data-ar="إنشاء الحساب">Create Account</button>
        </form>
        <p class="auth-switch"><span data-en="Already have an account?" data-ar="لديك حساب؟">Already have an account?</span> <a href="/login" data-en="Login" data-ar="دخول">Login</a></p>
      </div>
    </section>
    <script>
    document.getElementById('reg-form').onsubmit = function(e){
      e.preventDefault();
      const name = document.getElementById('r-name').value.trim();
      const email = document.getElementById('r-email').value.toLowerCase().trim();
      const pass = document.getElementById('r-pass').value;
      const err = document.getElementById('reg-err');
      const users = JSON.parse(localStorage.getItem('ks_users')||'[]');
      if(users.find(u=>u.email===email)){
        err.style.display='block'; err.textContent='❌ Email already registered'; return;
      }
      const user = {id: Date.now().toString(36), name, email, pass: btoa(pass), createdAt: new Date().toISOString()};
      users.push(user);
      localStorage.setItem('ks_users', JSON.stringify(users));
      localStorage.setItem('ks_user', JSON.stringify({id:user.id, name:user.name, email:user.email}));
      window.location.href = '/account';
    }
    </script>
  `))
})

// ── ACCOUNT ──
app.get('/account', (_req, res) => {
  res.type('html').send(page('My Account', 'Account', `
    <section>
      <div id="acct"></div>
    </section>
    <script>
    const u = JSON.parse(localStorage.getItem('ks_user')||'null');
    if(!u){ window.location.href='/login'; }
    else {
      const orders = JSON.parse(localStorage.getItem('ks_orders')||'[]');
      document.getElementById('acct').innerHTML = \`
        <h2 class="section-title">👤 \${u.name}</h2>
        <div class="account-grid">
          <div class="account-card">
            <h3>Account Info</h3>
            <p><strong>Name:</strong> \${u.name}</p>
            <p><strong>Email:</strong> \${u.email}</p>
            <a href="/products" class="btn btn-primary" style="margin-top:1rem;display:inline-block">Shop Now</a>
            <br/><button onclick="logout()" class="btn btn-outline" style="border-color:var(--primary);color:var(--primary);margin-top:0.8rem">Logout</button>
          </div>
          <div class="account-card">
            <h3>My Orders (\${orders.length})</h3>
            \${orders.length
              ? orders.map(o=>\`<div class="order-row"><span style="font-family:monospace">#\${o.id}</span><span>\${o.total?.toFixed ? o.total.toFixed(3) : o.total} KD</span><span class="order-status">\${o.status||'pending'}</span></div>\`).join('')
              : '<p style="color:var(--muted)">No orders yet. <a href="/products" style="color:var(--primary)">Start shopping!</a></p>'
            }
          </div>
        </div>
      \`
    }
    </script>
  `))
})

// ── ABOUT ──
app.get('/about', (_req, res) => {
  res.type('html').send(page('About Us', 'About Us', `
    <section>
      <h2 class="section-title" data-en="About Kuwait Store" data-ar="عن كويت ستور">About Kuwait Store</h2>
      <div class="about-content">
        <p data-en="Kuwait Store is your trusted online shopping destination in Kuwait. We offer a wide range of premium products — from fashion and accessories to beauty and lifestyle — at competitive prices." data-ar="كويت ستور هو وجهتك التسوقية الموثوقة عبر الإنترنت في الكويت. نقدم مجموعة واسعة من المنتجات الفاخرة من أزياء وإكسسوارات وجمال بأسعار تنافسية.">Kuwait Store is your trusted online shopping destination in Kuwait. We offer a wide range of premium products — from fashion and accessories to beauty and lifestyle — at competitive prices.</p>
        <p data-en="Founded with a passion for quality and customer satisfaction, we source our products from trusted local and international suppliers to ensure you always get the best." data-ar="تأسسنا بشغف نحو الجودة ورضا العملاء، ونحصل على منتجاتنا من موردين محليين ودوليين موثوقين لضمان حصولك على الأفضل دائماً.">Founded with a passion for quality and customer satisfaction, we source our products from trusted local and international suppliers.</p>
        <p data-en="We believe shopping should be easy, safe, and enjoyable. Fast delivery across Kuwait, secure payments, and a hassle-free 30-day return policy." data-ar="نؤمن أن التسوق يجب أن يكون سهلاً وآمناً وممتعاً. توصيل سريع في جميع أنحاء الكويت ومدفوعات آمنة وسياسة إرجاع مريحة لمدة 30 يوماً.">We believe shopping should be easy, safe, and enjoyable. Fast delivery across Kuwait, secure payments, and a hassle-free 30-day return policy.</p>
        <div class="info-grid">
          <div class="info-box"><h4>📦 <span data-en="Fast Delivery" data-ar="توصيل سريع">Fast Delivery</span></h4><p data-en="Same-day delivery available in Kuwait City and major areas" data-ar="توصيل في نفس اليوم متاح في الكويت والمناطق الرئيسية">Same-day delivery available in Kuwait City and major areas</p></div>
          <div class="info-box"><h4>🔒 <span data-en="Secure Payment" data-ar="دفع آمن">Secure Payment</span></h4><p data-en="KNET, Visa, Mastercard, and cash on delivery accepted" data-ar="كي نت، فيزا، ماستركارد والدفع عند الاستلام">KNET, Visa, Mastercard, and cash on delivery accepted</p></div>
          <div class="info-box"><h4>↩️ <span data-en="Easy Returns" data-ar="إرجاع سهل">Easy Returns</span></h4><p data-en="30-day return policy, no questions asked" data-ar="سياسة إرجاع 30 يوماً بدون أسئلة">30-day return policy, no questions asked</p></div>
          <div class="info-box"><h4>📞 <span data-en="7-Day Support" data-ar="دعم 7 أيام">7-Day Support</span></h4><p data-en="9am–9pm Kuwait time via WhatsApp, phone & email" data-ar="9 صباحاً - 9 مساءً بتوقيت الكويت عبر واتساب والهاتف والبريد">9am–9pm Kuwait time via WhatsApp, phone & email</p></div>
          <div class="info-box"><h4>✅ <span data-en="Authentic Products" data-ar="منتجات أصلية">Authentic Products</span></h4><p data-en="100% genuine products with quality guarantee" data-ar="منتجات أصلية 100٪ مع ضمان الجودة">100% genuine products with quality guarantee</p></div>
          <div class="info-box"><h4>🇰🇼 <span data-en="Kuwait-Based" data-ar="مقرنا الكويت">Kuwait-Based</span></h4><p data-en="Proudly serving customers across all Kuwait governorates" data-ar="نخدم بفخر العملاء في جميع محافظات الكويت">Proudly serving customers across all Kuwait governorates</p></div>
        </div>
      </div>
    </section>
  `))
})

// ── CONTACT ──
app.get('/contact', (_req, res) => {
  res.type('html').send(page('Contact Us', 'Contact', `
    <section>
      <h2 class="section-title" data-en="Contact Us" data-ar="اتصل بنا">Contact Us</h2>
      <div class="contact-grid">
        <div class="contact-form">
          <form action="/contact" method="POST">
            <label data-en="Full Name" data-ar="الاسم الكامل">Full Name</label>
            <input type="text" name="name" data-en-ph="Your name" data-ar-ph="اسمك" placeholder="Your name" required/>
            <label data-en="Email Address" data-ar="البريد الإلكتروني">Email Address</label>
            <input type="email" name="email" placeholder="email@example.com" required/>
            <label data-en="Phone (optional)" data-ar="الهاتف (اختياري)">Phone (optional)</label>
            <input type="tel" name="phone" placeholder="+965 XXXX XXXX"/>
            <label data-en="Subject" data-ar="الموضوع">Subject</label>
            <select name="subject">
              <option value="" data-en="Select subject" data-ar="اختر الموضوع">Select subject</option>
              <option data-en="Order Inquiry" data-ar="استفسار طلب">Order Inquiry</option>
              <option data-en="Return & Refund" data-ar="إرجاع واسترداد">Return & Refund</option>
              <option data-en="Product Question" data-ar="سؤال عن منتج">Product Question</option>
              <option data-en="Delivery Issue" data-ar="مشكلة توصيل">Delivery Issue</option>
              <option data-en="Other" data-ar="أخرى">Other</option>
            </select>
            <label data-en="Message" data-ar="الرسالة">Message</label>
            <textarea name="message" data-en-ph="How can we help you?" data-ar-ph="كيف يمكننا مساعدتك؟" placeholder="How can we help you?" required></textarea>
            <button type="submit" data-en="Send Message 📨" data-ar="إرسال الرسالة 📨">Send Message 📨</button>
          </form>
        </div>
        <div class="contact-info">
          <div class="contact-card"><div class="icon">📍</div><div><h4 data-en="Address" data-ar="العنوان">Address</h4><p data-en="Salmiya, Block 12, Street 5, Kuwait City" data-ar="السالمية، قطعة 12، شارع 5، الكويت">Salmiya, Block 12, Street 5, Kuwait City</p></div></div>
          <div class="contact-card"><div class="icon">📞</div><div><h4 data-en="Phone" data-ar="الهاتف">Phone</h4><p>+965 5555 5555</p></div></div>
          <div class="contact-card"><div class="icon">💬</div><div><h4>WhatsApp</h4><p><a href="https://wa.me/96555555555" style="color:var(--accent)" target="_blank" data-en="Chat with us now" data-ar="تحدث معنا الآن">Chat with us now</a></p></div></div>
          <div class="contact-card"><div class="icon">📧</div><div><h4>Email</h4><p>info@kuwait-store.com</p></div></div>
          <div class="contact-card"><div class="icon">🕐</div><div><h4 data-en="Working Hours" data-ar="ساعات العمل">Working Hours</h4><p data-en="Sun–Thu: 9am – 9pm | Fri–Sat: 10am – 8pm" data-ar="أحد–خميس: 9ص–9م | جمعة–سبت: 10ص–8م">Sun–Thu: 9am – 9pm | Fri–Sat: 10am – 8pm</p></div></div>
        </div>
      </div>
    </section>
  `))
})

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body
  console.log('Contact:', { name, email, message })
  res.type('html').send(page('Message Sent', 'Contact', `
    <section>
      <div class="success-box">
        <div class="checkmark">✅</div>
        <h2 data-en="Message Sent!" data-ar="تم إرسال الرسالة!">Message Sent!</h2>
        <p>Thank you <strong>${name}</strong>! <span data-en="We received your message and will reply within 24 hours." data-ar="استلمنا رسالتك وسنرد خلال 24 ساعة.">We received your message and will reply within 24 hours.</span></p>
        <a href="/" class="btn btn-primary" data-en="Back to Home" data-ar="العودة للرئيسية">Back to Home</a>
      </div>
    </section>
  `))
})

// ── ADMIN LOGIN ──
app.get('/admin/login', (req, res) => {
  if (isAdmin(req)) return res.redirect('/admin')
  res.type('html').send(page('Admin Login', '', `
    <section>
      <div class="auth-box">
        <div class="auth-icon">🔐</div>
        <h2>Admin Login</h2>
        <p class="auth-sub">Kuwait Store Dashboard</p>
        <form method="POST" action="/admin/login">
          <label>Password</label>
          <input type="password" name="password" placeholder="Admin password" required autofocus/>
          <button type="submit" class="btn btn-primary" style="width:100%">Login to Dashboard</button>
        </form>
      </div>
    </section>
  `))
})

app.post('/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASS) {
    res.setHeader('Set-Cookie', `ks_admin=${ADMIN_TOKEN}; Path=/; HttpOnly; Max-Age=86400`)
    return res.redirect('/admin')
  }
  res.type('html').send(page('Admin Login', '', `
    <section>
      <div class="auth-box">
        <div class="auth-icon">🔐</div>
        <h2>Admin Login</h2>
        <p style="color:var(--primary);text-align:center;margin-bottom:1rem">❌ Wrong password</p>
        <form method="POST" action="/admin/login">
          <label>Password</label>
          <input type="password" name="password" placeholder="Admin password" required autofocus/>
          <button type="submit" class="btn btn-primary" style="width:100%">Login to Dashboard</button>
        </form>
      </div>
    </section>
  `))
})

app.get('/admin/logout', (_req, res) => {
  res.setHeader('Set-Cookie', 'ks_admin=; Path=/; HttpOnly; Max-Age=0')
  res.redirect('/admin/login')
})

// ── ADMIN DASHBOARD ──
app.get('/admin', requireAdmin, (_req, res) => {
  res.type('html').send(page('Admin Dashboard', 'Admin', `
    <section>
      <h2 class="section-title">🛠️ Admin Dashboard</h2>
      <div class="admin-stats">
        <div class="stat-card"><div class="stat-num">${PRODUCTS.length}</div><div class="stat-lbl">Products</div></div>
        <div class="stat-card"><div class="stat-num">${ORDERS.length}</div><div class="stat-lbl">Orders</div></div>
        <div class="stat-card"><div class="stat-num">${ORDERS.reduce((s,o)=>s+o.total,0).toFixed(3)}</div><div class="stat-lbl">Revenue (KD)</div></div>
      </div>
      <div class="admin-nav">
        <a href="/admin/products" class="btn btn-primary">📦 Manage Products</a>
        <a href="/admin/orders" class="btn btn-dark">📋 View Orders</a>
        <a href="/" class="btn btn-outline" style="border-color:var(--border);color:var(--text)" target="_blank">🌐 View Store</a>
        <a href="/admin/logout" class="btn btn-outline" style="border-color:var(--primary);color:var(--primary)">🚪 Logout</a>
      </div>
    </section>
  `))
})

// ── ADMIN PRODUCTS ──
app.get('/admin/products', requireAdmin, (_req, res) => {
  const rows = PRODUCTS.map(p => `
    <tr>
      <td>${p.emoji} ${p.name}</td>
      <td>${p.nameAr}</td>
      <td><span class="product-tag">${p.category}</span></td>
      <td style="color:var(--primary);font-weight:700">${p.price.toFixed(3)} KD</td>
      <td>${p.badge ? `<span class="product-badge" style="background:${badgeColors[p.badge]};position:static;display:inline-block;border-radius:4px">${p.badge.toUpperCase()}</span>` : '—'}</td>
      <td>
        <form method="POST" action="/admin/products/delete/${p.id}" onsubmit="return confirm('Delete ${p.name}?')" style="display:inline">
          <button type="submit" class="btn-delete">🗑️ Delete</button>
        </form>
      </td>
    </tr>`).join('')

  res.type('html').send(page('Products — Admin', 'Admin › Products', `
    <section>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
        <h2 class="section-title" style="margin:0">📦 Products (${PRODUCTS.length})</h2>
        <a href="/admin/products/add" class="btn btn-primary">+ Add Product</a>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>Name</th><th>Arabic</th><th>Category</th><th>Price</th><th>Badge</th><th>Action</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="margin-top:1rem"><a href="/admin" class="btn btn-outline" style="border-color:var(--border);color:var(--text)">← Dashboard</a></div>
    </section>
  `))
})

app.get('/admin/products/add', requireAdmin, (_req, res) => {
  const catOptions = ['Accessories','Bags','Beauty','Fashion','Food','Home','Jewelry']
    .map(c => `<option>${c}</option>`).join('')
  res.type('html').send(page('Add Product — Admin', 'Admin › Add Product', `
    <section>
      <h2 class="section-title">➕ Add New Product</h2>
      <div class="checkout-form" style="max-width:600px">
        <form method="POST" action="/admin/products/add">
          <div class="form-row">
            <div><label>Name (English)</label><input type="text" name="name" placeholder="Product name" required/></div>
            <div><label>Name (Arabic)</label><input type="text" name="nameAr" placeholder="اسم المنتج" required style="direction:rtl"/></div>
          </div>
          <div class="form-row">
            <div><label>Price (KD)</label><input type="number" name="price" step="0.001" min="0" placeholder="0.000" required/></div>
            <div><label>Emoji Icon</label><input type="text" name="emoji" placeholder="📦" required/></div>
          </div>
          <div class="form-row">
            <div><label>Category</label><select name="category">${catOptions}</select></div>
            <div><label>Badge</label><select name="badge"><option value="">None</option><option value="new">New</option><option value="sale">Sale</option><option value="hot">Hot</option></select></div>
          </div>
          <label>Description (English)</label>
          <textarea name="desc" placeholder="Product description..." style="width:100%;padding:0.75rem;border:2px solid var(--border);border-radius:6px;background:var(--input-bg);color:var(--text);font-family:inherit;font-size:0.95rem;height:80px;resize:vertical;margin-bottom:1rem" required></textarea>
          <label>Description (Arabic)</label>
          <textarea name="descAr" placeholder="وصف المنتج..." style="width:100%;padding:0.75rem;border:2px solid var(--border);border-radius:6px;background:var(--input-bg);color:var(--text);font-family:inherit;font-size:0.95rem;height:80px;resize:vertical;margin-bottom:1rem;direction:rtl" required></textarea>
          <div style="display:flex;gap:1rem">
            <button type="submit" class="btn btn-primary" style="flex:1">Add Product</button>
            <a href="/admin/products" class="btn btn-outline" style="border-color:var(--border);color:var(--text)">Cancel</a>
          </div>
        </form>
      </div>
    </section>
  `))
})

app.post('/admin/products/add', requireAdmin, (req, res) => {
  const { name, nameAr, price, emoji, category, badge, desc, descAr } = req.body
  const newId = Math.max(...PRODUCTS.map(p => p.id), 0) + 1
  PRODUCTS.push({
    id: newId, name: name.trim(), nameAr: nameAr.trim(),
    price: parseFloat(price), emoji: emoji.trim() || '📦',
    category, categoryAr: categoryArMap[category] || category,
    badge: badge || '', desc: desc.trim(), descAr: descAr.trim(), specs: {}
  })
  res.redirect('/admin/products')
})

app.post('/admin/products/delete/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id)
  PRODUCTS = PRODUCTS.filter(p => p.id !== id)
  res.redirect('/admin/products')
})

// ── ADMIN ORDERS ──
app.get('/admin/orders', requireAdmin, (_req, res) => {
  const rows = ORDERS.length
    ? ORDERS.map(o => `<tr>
        <td style="font-family:monospace;font-size:0.8rem">${o.id}</td>
        <td>${o.name}</td><td>${o.phone}</td><td>${o.area}</td>
        <td style="color:var(--primary);font-weight:700">${o.total.toFixed(3)} KD</td>
        <td>${o.payment}</td>
        <td><span class="order-status">${o.status}</span></td>
        <td style="font-size:0.82rem">${new Date(o.createdAt).toLocaleDateString()}</td>
      </tr>`).join('')
    : '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--muted)">No orders yet</td></tr>'

  res.type('html').send(page('Orders — Admin', 'Admin › Orders', `
    <section>
      <h2 class="section-title">📋 Orders (${ORDERS.length})</h2>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Phone</th><th>Area</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="margin-top:1rem"><a href="/admin" class="btn btn-outline" style="border-color:var(--border);color:var(--text)">← Dashboard</a></div>
    </section>
  `))
})

// ── API ──
app.post('/api/orders', (req, res) => {
  const { name, phone, email, area, address, payment, items, total } = req.body
  const order: Order = {
    id: Date.now().toString(36).toUpperCase(),
    name, phone, email: email || '', area, address, payment,
    items: typeof items === 'string' ? JSON.parse(items) : (items || []),
    total: parseFloat(total) || 0,
    createdAt: new Date().toISOString(), status: 'pending'
  }
  ORDERS.push(order)
  res.json({ success: true, orderId: order.id })
})

app.get('/api/products', (_req, res) => {
  res.json({ success: true, count: PRODUCTS.length, products: PRODUCTS })
})

app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === parseInt(req.params.id))
  if (!product) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, product })
})

// ── SITEMAP ──
app.get('/sitemap.xml', (_req, res) => {
  const base = 'https://kuwait-store.com'
  const urls = [base+'/', base+'/products', base+'/about', base+'/contact', base+'/cart',
    ...PRODUCTS.map(p => `${base}/products/${p.id}`)
  ].map(u => `<url><loc>${u}</loc></url>`).join('')
  res.type('xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`)
})

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', products: PRODUCTS.length, orders: ORDERS.length })
})

// ── 404 ──
app.use((_req, res) => {
  res.status(404).type('html').send(page('404 — Not Found', '', `
    <div class="error-page">
      <h1>404</h1>
      <h2 data-en="Page Not Found" data-ar="الصفحة غير موجودة">Page Not Found</h2>
      <p data-en="The page you're looking for doesn't exist." data-ar="الصفحة التي تبحث عنها غير موجودة.">The page you're looking for doesn't exist.</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
        <a href="/" class="btn btn-primary" data-en="Go Home" data-ar="الرئيسية">Go Home</a>
        <a href="/products" class="btn btn-dark" data-en="Browse Products" data-ar="تصفح المنتجات">Browse Products</a>
      </div>
    </div>
  `))
})

export default app
