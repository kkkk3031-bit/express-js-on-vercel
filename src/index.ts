import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'public')))

const PRODUCTS = [
  { id: 1, name: 'Premium Watch', price: 12.5, currency: 'KD', emoji: '⌚', category: 'Accessories', desc: 'Elegant design, water resistant 50m, stainless steel case.' },
  { id: 2, name: 'Leather Bag', price: 8.75, currency: 'KD', emoji: '👜', category: 'Bags', desc: 'Handcrafted genuine leather, multiple compartments.' },
  { id: 3, name: 'Sunglasses', price: 5.5, currency: 'KD', emoji: '🕶️', category: 'Accessories', desc: 'UV400 protection, polarized lenses, comes with case.' },
  { id: 4, name: 'Perfume Set', price: 15.0, currency: 'KD', emoji: '🌸', category: 'Beauty', desc: 'Luxury Arabian perfume set, 3 bottles, 50ml each.' },
  { id: 5, name: 'Silk Scarf', price: 6.25, currency: 'KD', emoji: '🧣', category: 'Fashion', desc: '100% pure silk, vibrant colors, gift box included.' },
  { id: 6, name: 'Gold Bracelet', price: 45.0, currency: 'KD', emoji: '📿', category: 'Jewelry', desc: '18k gold plated, adjustable size, hypoallergenic.' },
  { id: 7, name: 'Oud Perfume', price: 22.0, currency: 'KD', emoji: '🪵', category: 'Beauty', desc: 'Authentic Kuwaiti oud, rich and long-lasting fragrance.' },
  { id: 8, name: 'Abaya', price: 18.5, currency: 'KD', emoji: '👗', category: 'Fashion', desc: 'Premium quality fabric, elegant embroidery, all sizes.' },
  { id: 9, name: 'Date Box', price: 9.0, currency: 'KD', emoji: '🎁', category: 'Food', desc: 'Premium Kuwaiti dates, luxury gift box, 500g.' },
]

const nav = () => `
<nav>
  <a class="logo" href="/">Kuwait<span>Store</span></a>
  <button class="hamburger" onclick="this.classList.toggle('open');document.querySelector('.nav-links').classList.toggle('open')" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/products">Products</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/cart" class="nav-cart">🛒 Cart</a>
  </div>
</nav>`

const topbar = `<div class="topbar">🚚 Free delivery across Kuwait on orders over 10 KD &nbsp;|&nbsp; 📞 +965 0000 0000</div>`

const whatsapp = `<a href="https://wa.me/96500000000" class="whatsapp-btn" target="_blank" title="Chat on WhatsApp">💬</a>`

const toast = `<div class="toast" id="toast"></div>
<script>
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(i => i.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  const t = document.getElementById('toast');
  t.textContent = name + ' added to cart!';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
</script>`

const footer = () => `
<footer>
  <div class="footer-grid">
    <div class="footer-col">
      <h4>Kuwait Store</h4>
      <p>Your trusted online shopping destination in Kuwait. Quality products, fast delivery.</p>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <a href="/">Home</a>
      <a href="/products">Products</a>
      <a href="/about">About Us</a>
      <a href="/contact">Contact</a>
    </div>
    <div class="footer-col">
      <h4>Categories</h4>
      <a href="/products?cat=Accessories">Accessories</a>
      <a href="/products?cat=Fashion">Fashion</a>
      <a href="/products?cat=Beauty">Beauty</a>
      <a href="/products?cat=Jewelry">Jewelry</a>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <a href="mailto:info@kuwait-store.com">info@kuwait-store.com</a>
      <a href="tel:+96500000000">+965 0000 0000</a>
      <a href="https://wa.me/96500000000" target="_blank">WhatsApp</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; ${new Date().getFullYear()} <span>Kuwait Store</span>. All rights reserved.</p>
  </div>
</footer>`

const html = (title: string, body: string) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="description" content="Kuwait Store - Premium online shopping in Kuwait"/>
  <title>${title} | Kuwait Store</title>
  <link rel="stylesheet" href="/style.css"/>
</head>
<body>
  ${topbar}
  ${nav()}
  ${body}
  ${whatsapp}
  ${toast}
  ${footer()}
</body>
</html>`

// HOME
app.get('/', (req, res) => {
  const featured = PRODUCTS.slice(0, 6)
  const cards = featured.map(p => `
    <div class="product-card">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-tag">${p.category}</div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-footer">
          <span class="price">${p.price.toFixed(3)} KD</span>
          <button class="add-cart" onclick="addToCart('${p.name}', ${p.price})">+ Cart</button>
        </div>
      </div>
    </div>`).join('')

  res.type('html').send(html('Home', `
    <div class="hero">
      <h1>Welcome to <span>Kuwait Store</span></h1>
      <p>Your trusted online store in Kuwait. Premium products, fast delivery, best prices.</p>
      <div class="hero-btns">
        <a href="/products" class="btn btn-primary">Shop Now</a>
        <a href="/about" class="btn btn-outline">Learn More</a>
      </div>
    </div>
    <div class="search-bar">
      <form action="/products" method="GET" style="display:flex;width:100%;max-width:500px">
        <input type="text" name="q" placeholder="Search products..."/>
        <button type="submit">🔍</button>
      </form>
    </div>
    <div class="features">
      <div class="features-grid">
        <div class="feature-item"><div class="feature-icon">🚚</div><h3>Free Delivery</h3><p>On orders over 10 KD across Kuwait</p></div>
        <div class="feature-item"><div class="feature-icon">🔒</div><h3>Secure Payment</h3><p>100% secure transactions</p></div>
        <div class="feature-item"><div class="feature-icon">↩️</div><h3>Easy Returns</h3><p>30-day hassle-free returns</p></div>
        <div class="feature-item"><div class="feature-icon">⭐</div><h3>Quality Products</h3><p>Curated premium selection</p></div>
      </div>
    </div>
    <section>
      <h2 class="section-title">Featured Products</h2>
      <div class="products-grid">${cards}</div>
      <div style="text-align:center;margin-top:2rem">
        <a href="/products" class="btn btn-primary">View All Products</a>
      </div>
    </section>
  `))
})

// PRODUCTS
app.get('/products', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase()
  const cat = (req.query.cat as string) || ''
  const categories = [...new Set(PRODUCTS.map(p => p.category))]

  let filtered = PRODUCTS
  if (query) filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query))
  if (cat) filtered = filtered.filter(p => p.category === cat)

  const catBtns = ['All', ...categories].map(c =>
    `<button class="cat-btn ${cat === c || (c === 'All' && !cat) ? 'active' : ''}" onclick="location.href='/products${c === 'All' ? '' : '?cat=' + c}'">${c}</button>`
  ).join('')

  const cards = filtered.length ? filtered.map(p => `
    <div class="product-card">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-tag">${p.category}</div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-footer">
          <span class="price">${p.price.toFixed(3)} KD</span>
          <button class="add-cart" onclick="addToCart('${p.name}', ${p.price})">+ Cart</button>
        </div>
      </div>
    </div>`).join('') : '<p style="color:#666;grid-column:1/-1">No products found.</p>'

  res.type('html').send(html('Products', `
    <section>
      <h2 class="section-title">Our Products ${query ? '— "' + query + '"' : ''}</h2>
      <div class="search-bar" style="padding:0 0 1.5rem;background:none;box-shadow:none;justify-content:flex-start">
        <form action="/products" method="GET" style="display:flex;width:100%;max-width:500px">
          <input type="text" name="q" placeholder="Search products..." value="${query}"/>
          <button type="submit">🔍</button>
        </form>
      </div>
      <div class="categories">${catBtns}</div>
      <div class="products-grid">${cards}</div>
    </section>
  `))
})

// ABOUT
app.get('/about', (req, res) => {
  res.type('html').send(html('About Us', `
    <section>
      <h2 class="section-title">About Us</h2>
      <div class="about-content">
        <p>Kuwait Store is your trusted online shopping destination in Kuwait. We offer a wide range of premium products — from fashion and accessories to beauty and lifestyle — at competitive prices.</p>
        <p>Founded with a passion for quality and customer satisfaction, we source our products from trusted suppliers to ensure you always get the best. Every item is carefully selected and quality-checked before reaching you.</p>
        <p>We believe shopping should be easy, safe, and enjoyable. That's why we offer fast delivery across Kuwait, secure payments, and a hassle-free 30-day return policy.</p>
        <div class="info-grid">
          <div class="info-box"><h4>📦 Fast Delivery</h4><p>Same-day delivery available in Kuwait City</p></div>
          <div class="info-box"><h4>🔒 Secure Payment</h4><p>KNET, credit card, and cash on delivery</p></div>
          <div class="info-box"><h4>↩️ Easy Returns</h4><p>30-day return policy, no questions asked</p></div>
          <div class="info-box"><h4>📞 Support</h4><p>7 days a week, 9am–9pm Kuwait time</p></div>
        </div>
      </div>
    </section>
  `))
})

// CONTACT GET
app.get('/contact', (req, res) => {
  res.type('html').send(html('Contact Us', `
    <section>
      <h2 class="section-title">Contact Us</h2>
      <div class="contact-grid">
        <div class="contact-form">
          <form action="/contact" method="POST">
            <input type="text" name="name" placeholder="Your Name" required/>
            <input type="email" name="email" placeholder="Your Email" required/>
            <select name="subject">
              <option value="">Select Subject</option>
              <option>Order Inquiry</option>
              <option>Return & Refund</option>
              <option>Product Question</option>
              <option>Other</option>
            </select>
            <textarea name="message" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message 📨</button>
          </form>
        </div>
        <div class="contact-info">
          <div class="contact-card"><div class="icon">📍</div><div><h4>Address</h4><p>Salmiya, Block 12<br/>Kuwait City, Kuwait</p></div></div>
          <div class="contact-card"><div class="icon">📞</div><div><h4>Phone</h4><p>+965 0000 0000</p></div></div>
          <div class="contact-card"><div class="icon">📧</div><div><h4>Email</h4><p>info@kuwait-store.com</p></div></div>
          <div class="contact-card"><div class="icon">🕐</div><div><h4>Working Hours</h4><p>Sun–Thu: 9am – 9pm<br/>Fri–Sat: 10am – 8pm</p></div></div>
        </div>
      </div>
    </section>
  `))
})

// CONTACT POST
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body
  console.log('Contact:', { name, email, message })
  res.type('html').send(html('Message Sent', `
    <section>
      <div class="success-box">
        <div class="checkmark">✅</div>
        <h2>Message Sent!</h2>
        <p>Thank you <strong>${name}</strong>! We received your message and will reply to <strong>${email}</strong> within 24 hours.</p>
        <a href="/" class="btn btn-primary">Back to Home</a>
      </div>
    </section>
  `))
})

// CART PAGE
app.get('/cart', (req, res) => {
  res.type('html').send(html('My Cart', `
    <section>
      <h2 class="section-title">My Cart</h2>
      <div id="cart-content" style="background:white;padding:2rem;border-radius:12px;box-shadow:var(--shadow)">
        <p style="color:var(--muted)">Loading cart...</p>
      </div>
    </section>
    <script>
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const el = document.getElementById('cart-content');
    if (!cart.length) {
      el.innerHTML = '<p style="text-align:center;color:#666;padding:2rem">Your cart is empty. <a href="/products" style="color:var(--primary)">Browse products</a></p>';
    } else {
      let total = 0;
      let rows = cart.map(i => {
        total += i.price * i.qty;
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid #eee"><span>' + i.name + ' x' + i.qty + '</span><span style="color:var(--primary);font-weight:700">' + (i.price * i.qty).toFixed(3) + ' KD</span></div>';
      }).join('');
      el.innerHTML = rows + '<div style="display:flex;justify-content:space-between;align-items:center;padding:1.5rem 0;font-size:1.2rem;font-weight:700"><span>Total</span><span style="color:var(--primary)">' + total.toFixed(3) + ' KD</span></div><button onclick="alert(\'Order placed! We will contact you soon.\\nشكراً لطلبك!');localStorage.removeItem(\'cart\');location.href=\'/\';" class="btn btn-primary" style="width:100%;text-align:center;border:none;cursor:pointer;font-size:1rem">Place Order 🛒</button>';
    }
    </script>
  `))
})

// API
app.get('/api/products', (req, res) => {
  res.json({ products: PRODUCTS })
})

// HEALTH
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404
app.use((req, res) => {
  res.status(404).type('html').send(html('Page Not Found', `
    <div class="error-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" class="btn btn-primary">Go Home</a>
    </div>
  `))
})

export default app
