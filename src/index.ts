import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'public')))

// ── PRODUCTS DATA ──
const PRODUCTS = [
  { id: 1,  name: 'Premium Watch',      price: 12.5,  emoji: '⌚', category: 'Accessories', badge: 'hot',  desc: 'Elegant design, water resistant 50m, stainless steel case with sapphire glass.',  specs: { Brand: 'Kuwait Timepieces', Material: 'Stainless Steel', Water: '50m resistant', Warranty: '2 years' } },
  { id: 2,  name: 'Leather Bag',         price: 8.75,  emoji: '👜', category: 'Bags',        badge: '',     desc: 'Handcrafted genuine leather bag with multiple compartments and gold-tone hardware.', specs: { Material: 'Genuine Leather', Size: '35x25x12 cm', Color: 'Brown/Black', Pockets: '5 compartments' } },
  { id: 3,  name: 'Sunglasses',          price: 5.5,   emoji: '🕶️', category: 'Accessories', badge: 'sale', desc: 'UV400 protection, polarized lenses, lightweight titanium frame, comes with case.',    specs: { Lenses: 'Polarized UV400', Frame: 'Titanium', Colors: 'Black/Gold', Warranty: '1 year' } },
  { id: 4,  name: 'Perfume Set',         price: 15.0,  emoji: '🌸', category: 'Beauty',      badge: 'new',  desc: 'Luxury Arabian perfume set, 3 bottles 50ml each. Floral, Musk, and Oud.',             specs: { Bottles: '3 × 50ml', Notes: 'Floral, Musk, Oud', Origin: 'Kuwait', Type: 'EDP' } },
  { id: 5,  name: 'Silk Scarf',          price: 6.25,  emoji: '🧣', category: 'Fashion',     badge: '',     desc: '100% pure silk scarf with vibrant hand-painted pattern, gift box included.',          specs: { Material: '100% Silk', Size: '90x90 cm', Care: 'Dry clean only', Gift: 'Box included' } },
  { id: 6,  name: 'Gold Bracelet',       price: 45.0,  emoji: '📿', category: 'Jewelry',     badge: 'hot',  desc: '18k gold plated bracelet, adjustable size 16-20cm, hypoallergenic.',                  specs: { Material: '18k Gold Plated', Size: '16-20 cm', Hypoallergenic: 'Yes', Warranty: '1 year' } },
  { id: 7,  name: 'Oud Perfume',         price: 22.0,  emoji: '🪵', category: 'Beauty',      badge: 'new',  desc: 'Authentic Kuwaiti oud, aged 10 years, rich and long-lasting 24h fragrance.',          specs: { Volume: '50ml', Type: 'Pure Oud', Lasting: '24 hours', Origin: 'Kuwait' } },
  { id: 8,  name: 'Abaya',              price: 18.5,  emoji: '👗', category: 'Fashion',     badge: '',     desc: 'Premium quality fabric abaya with elegant silver embroidery, available in all sizes.', specs: { Fabric: 'Nida', Sizes: 'XS – 3XL', Color: 'Black', Care: 'Hand wash' } },
  { id: 9,  name: 'Date Gift Box',       price: 9.0,   emoji: '🎁', category: 'Food',        badge: 'new',  desc: 'Premium Kuwaiti Medjool dates, luxury handcrafted box, 500g.',                         specs: { Weight: '500g', Type: 'Medjool', Box: 'Luxury wood', Shelf: '3 months' } },
  { id: 10, name: 'Pearl Necklace',      price: 35.0,  emoji: '💎', category: 'Jewelry',     badge: 'sale', desc: 'Freshwater pearl necklace, 45cm, sterling silver clasp, velvet pouch included.',       specs: { Pearls: 'Freshwater', Length: '45 cm', Clasp: 'Sterling Silver', Includes: 'Velvet pouch' } },
  { id: 11, name: 'Arabic Coffee Set',   price: 28.0,  emoji: '☕', category: 'Home',        badge: 'hot',  desc: 'Traditional dallah coffee pot + 6 cups, handcrafted brass with engraving.',             specs: { Material: 'Brass', Set: '1 dallah + 6 cups', Origin: 'Kuwait', Weight: '1.2 kg' } },
  { id: 12, name: 'Kandura Fabric',      price: 14.0,  emoji: '🧵', category: 'Fashion',     badge: '',     desc: 'High quality white kandura fabric, 3 meters, wrinkle-resistant, machine washable.',    specs: { Length: '3 meters', Width: '150 cm', Material: 'Cotton blend', Care: 'Machine wash' } },
]

// ── HELPERS ──
const badgeColors: Record<string, string> = { new: '#007a3d', sale: '#c8102e', hot: '#f4a800' }

const navHTML = `
<nav>
  <a class="logo" href="/">Kuwait<span>Store</span></a>
  <button class="hamburger" onclick="this.parentNode.querySelector('.nav-links').classList.toggle('open')" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/products">Products</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/cart" class="nav-cart">🛒 Cart <span class="cart-count" id="cart-count">0</span></a>
  </div>
</nav>
<script>
(function(){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const total = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = total;
})();
</script>`

const topbarHTML = `<div class="topbar">🚚 Free delivery across Kuwait on orders over 10 KD &nbsp;|&nbsp; 📞 +965 5555 5555</div>`
const whatsappHTML = `<a href="https://wa.me/96555555555?text=Hello%20Kuwait%20Store!" class="whatsapp-btn" target="_blank" title="Chat on WhatsApp">💬</a>`

const toastScript = `
<div class="toast" id="toast"></div>
<script>
function addToCart(name, price, qty) {
  qty = qty || 1;
  let cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const ex = cart.find(i=>i.name===name);
  if(ex) ex.qty += qty; else cart.push({name, price, qty});
  localStorage.setItem('cart', JSON.stringify(cart));
  const total = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = total;
  const t = document.getElementById('toast');
  t.textContent = '✅ '+name+' added to cart!';
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}
</script>`

const footerHTML = `
<div class="newsletter">
  <h2>Stay Updated</h2>
  <p>Subscribe for exclusive deals and new arrivals</p>
  <form class="newsletter-form" onsubmit="this.innerHTML='<p style=color:white>✅ Subscribed!</p>';return false;">
    <input type="email" placeholder="Your email address" required/>
    <button type="submit">Subscribe</button>
  </form>
</div>
<footer>
  <div class="footer-grid">
    <div class="footer-col">
      <h4>Kuwait Store</h4>
      <p>Your trusted online shopping destination in Kuwait since 2020. Quality products, fast delivery, best prices.</p>
      <div class="footer-social">
        <a class="social-icon" href="#" title="Instagram">📸</a>
        <a class="social-icon" href="#" title="Twitter">🐦</a>
        <a class="social-icon" href="#" title="Snapchat">👻</a>
        <a class="social-icon" href="#" title="TikTok">🎵</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <a href="/">Home</a>
      <a href="/products">All Products</a>
      <a href="/about">About Us</a>
      <a href="/contact">Contact</a>
      <a href="/cart">My Cart</a>
    </div>
    <div class="footer-col">
      <h4>Categories</h4>
      <a href="/products?cat=Accessories">Accessories</a>
      <a href="/products?cat=Fashion">Fashion</a>
      <a href="/products?cat=Beauty">Beauty</a>
      <a href="/products?cat=Jewelry">Jewelry</a>
      <a href="/products?cat=Home">Home</a>
      <a href="/products?cat=Food">Food</a>
    </div>
    <div class="footer-col">
      <h4>Customer Service</h4>
      <a href="/contact">Contact Us</a>
      <a href="/about">Return Policy</a>
      <a href="https://wa.me/96555555555" target="_blank">WhatsApp Support</a>
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
  <meta name="description" content="${meta || 'Kuwait Store - Premium online shopping in Kuwait. Fast delivery, best prices.'}"/>
  <meta property="og:title" content="${title} | Kuwait Store"/>
  <meta property="og:description" content="${meta || 'Shop premium products at Kuwait Store'}"/>
  <title>${title} | Kuwait Store</title>
  <link rel="stylesheet" href="/style.css"/>
  <link rel="icon" href="/logo.png"/>
</head>
<body>
  ${topbarHTML}
  ${navHTML}
  ${breadcrumb ? `<div class="breadcrumb"><a href="/">Home</a> › ${breadcrumb}</div>` : ''}
  ${body}
  ${whatsappHTML}
  ${toastScript}
  ${footerHTML}
</body>
</html>`

const productCard = (p: typeof PRODUCTS[0]) => `
<div class="product-card">
  <div class="product-img" onclick="location.href='/products/${p.id}'">
    ${p.badge ? `<div class="product-badge" style="background:${badgeColors[p.badge]}">${p.badge.toUpperCase()}</div>` : ''}
    ${p.emoji}
  </div>
  <div class="product-info">
    <div class="product-tag">${p.category}</div>
    <h3 onclick="location.href='/products/${p.id}'">${p.name}</h3>
    <p>${p.desc.slice(0, 80)}...</p>
    <div class="product-footer">
      <span class="price">${p.price.toFixed(3)} KD</span>
      <button class="add-cart" onclick="addToCart('${p.name}',${p.price})">+ Cart</button>
    </div>
  </div>
</div>`

// ── ROUTES ──

// HOME
app.get('/', (_req, res) => {
  const featured = PRODUCTS.filter(p => p.badge).slice(0, 6)
  res.type('html').send(page('Home', '', `
    <div class="hero">
      <h1>Welcome to <span>Kuwait Store</span> 🇰🇼</h1>
      <p>Your trusted online store in Kuwait. Premium products, fast delivery, unbeatable prices.</p>
      <div class="hero-btns">
        <a href="/products" class="btn btn-primary">Shop Now</a>
        <a href="/about" class="btn btn-outline">About Us</a>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><div class="num">500+</div><div class="lbl">Products</div></div>
        <div class="hero-stat"><div class="num">10K+</div><div class="lbl">Customers</div></div>
        <div class="hero-stat"><div class="num">4.9★</div><div class="lbl">Rating</div></div>
        <div class="hero-stat"><div class="num">Same Day</div><div class="lbl">Delivery</div></div>
      </div>
    </div>
    <div class="search-bar">
      <form action="/products" method="GET" style="display:flex;width:100%;max-width:500px">
        <input type="text" name="q" placeholder="Search for products..."/>
        <button type="submit">🔍</button>
      </form>
    </div>
    <div class="features">
      <div class="features-grid">
        <div class="feature-item"><div class="feature-icon">🚚</div><h3>Free Delivery</h3><p>On orders over 10 KD across Kuwait</p></div>
        <div class="feature-item"><div class="feature-icon">🔒</div><h3>Secure Payment</h3><p>KNET, Visa, Mastercard & Cash</p></div>
        <div class="feature-item"><div class="feature-icon">↩️</div><h3>30-Day Returns</h3><p>Hassle-free return policy</p></div>
        <div class="feature-item"><div class="feature-icon">📞</div><h3>24/7 Support</h3><p>WhatsApp & phone support</p></div>
      </div>
    </div>
    <section>
      <h2 class="section-title">🔥 Featured Products</h2>
      <div class="products-grid">${featured.map(productCard).join('')}</div>
      <div style="text-align:center;margin-top:2rem">
        <a href="/products" class="btn btn-primary">View All Products →</a>
      </div>
    </section>
    <div class="testimonials">
      <div class="testimonials-inner">
        <h2>What Our Customers Say</h2>
        <div class="reviews-grid">
          <div class="review-card"><div class="review-stars">★★★★★</div><p class="review-text">"Amazing quality and super fast delivery! Got my order the same day. Will definitely shop again."</p><div class="review-author">Fatima Al-Rashidi</div><div class="review-loc">Kuwait City</div></div>
          <div class="review-card"><div class="review-stars">★★★★★</div><p class="review-text">"The gold bracelet is even more beautiful in person. Great packaging and very responsive customer service."</p><div class="review-author">Mohammed Al-Sabah</div><div class="review-loc">Salmiya</div></div>
          <div class="review-card"><div class="review-stars">★★★★★</div><p class="review-text">"Best online store in Kuwait! Great prices, authentic products, and the WhatsApp support is excellent."</p><div class="review-author">Nour Hassan</div><div class="review-loc">Hawalli</div></div>
        </div>
      </div>
    </div>
  `))
})

// PRODUCTS LIST
app.get('/products', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase()
  const cat = (req.query.cat as string) || ''
  const sort = (req.query.sort as string) || ''
  const categories = [...new Set(PRODUCTS.map(p => p.category))]

  let filtered = PRODUCTS
  if (query) filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
  if (cat) filtered = filtered.filter(p => p.category === cat)
  if (sort === 'asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sort === 'desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))

  const catBtns = ['All', ...categories].map(c =>
    `<button class="cat-btn ${cat === c || (c === 'All' && !cat) ? 'active' : ''}" onclick="location.href='/products${c === 'All' ? '' : '?cat=' + c}'">${c}</button>`
  ).join('')

  const cards = filtered.length
    ? filtered.map(productCard).join('')
    : '<p style="color:#666;grid-column:1/-1;text-align:center;padding:3rem">No products found. <a href="/products" style="color:var(--primary)">Clear search</a></p>'

  res.type('html').send(page('Products', 'Products', `
    <section>
      <h2 class="section-title">All Products ${query ? `— "${query}"` : ''} <span style="font-size:1rem;font-weight:400;color:var(--muted)">(${filtered.length} items)</span></h2>
      <div class="search-bar" style="padding:0 0 1.5rem;background:none;box-shadow:none;justify-content:flex-start">
        <form action="/products" method="GET" style="display:flex;width:100%;max-width:500px">
          ${cat ? `<input type="hidden" name="cat" value="${cat}"/>` : ''}
          <input type="text" name="q" placeholder="Search products..." value="${query}"/>
          <button type="submit">🔍</button>
        </form>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1rem">
        <div class="categories">${catBtns}</div>
        <select onchange="location.href='/products?${cat ? 'cat=' + cat + '&' : ''}${query ? 'q=' + query + '&' : ''}sort='+this.value" style="padding:0.4rem 0.8rem;border:2px solid var(--border);border-radius:6px;font-size:0.88rem">
          <option value="" ${!sort ? 'selected' : ''}>Sort: Default</option>
          <option value="asc" ${sort === 'asc' ? 'selected' : ''}>Price: Low to High</option>
          <option value="desc" ${sort === 'desc' ? 'selected' : ''}>Price: High to Low</option>
          <option value="name" ${sort === 'name' ? 'selected' : ''}>Name A-Z</option>
        </select>
      </div>
      <div class="products-grid">${cards}</div>
    </section>
  `))
})

// PRODUCT DETAIL
app.get('/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === parseInt(req.params.id))
  if (!product) return res.redirect('/products')

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)
  const specRows = Object.entries(product.specs).map(([k, v]) =>
    `<div class="spec-row"><span class="spec-key">${k}</span><span class="spec-val">${v}</span></div>`
  ).join('')

  res.type('html').send(page(product.name, `<a href="/products">Products</a> › ${product.name}`, `
    <section>
      <div class="product-detail">
        <div class="product-detail-img">${product.emoji}</div>
        <div class="product-detail-info">
          <div class="product-tag">${product.category}</div>
          <h1>${product.name}</h1>
          <div class="review-stars" style="font-size:1.1rem">★★★★★ <span style="color:#666;font-size:0.9rem">(48 reviews)</span></div>
          <span class="price">${product.price.toFixed(3)} KD</span>
          <p>${product.desc}</p>
          <div class="qty-control">
            <button onclick="if(parseInt(document.getElementById('qty').textContent)>1)document.getElementById('qty').textContent=parseInt(document.getElementById('qty').textContent)-1">−</button>
            <span id="qty">1</span>
            <button onclick="document.getElementById('qty').textContent=parseInt(document.getElementById('qty').textContent)+1">+</button>
          </div>
          <div class="detail-actions">
            <button class="btn btn-primary" onclick="addToCart('${product.name}',${product.price},parseInt(document.getElementById('qty').textContent))">🛒 Add to Cart</button>
            <a href="/checkout" class="btn btn-dark">Buy Now</a>
            <a href="https://wa.me/96555555555?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(product.name)}" class="btn btn-outline" style="background:#25d366;border-color:#25d366;color:white" target="_blank">💬 WhatsApp</a>
          </div>
          <div class="product-specs">
            <h3>Specifications</h3>
            ${specRows}
          </div>
        </div>
      </div>
      ${related.length ? `
        <h2 class="section-title" style="margin-top:3rem">Related Products</h2>
        <div class="products-grid">${related.map(productCard).join('')}</div>
      ` : ''}
    </section>
  `, product.desc))
})

// CART
app.get('/cart', (_req, res) => {
  res.type('html').send(page('My Cart', 'Cart', `
    <section>
      <h2 class="section-title">🛒 My Cart</h2>
      <div id="cart-content"></div>
    </section>
    <script>
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    const el = document.getElementById('cart-content');
    if(!cart.length){
      el.innerHTML='<div style="background:white;padding:3rem;border-radius:12px;text-align:center;box-shadow:var(--shadow)"><div style="font-size:4rem;margin-bottom:1rem">🛒</div><h3 style="margin-bottom:0.5rem">Your cart is empty</h3><p style="color:#666;margin-bottom:1.5rem">Add some products to get started</p><a href="/products" class="btn btn-primary">Browse Products</a></div>';
    } else {
      let total=0;
      let rows=cart.map((it,idx)=>{
        const sub=it.price*it.qty; total+=sub;
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid #eee;gap:1rem"><div style="display:flex;align-items:center;gap:1rem"><button onclick="removeItem('+idx+')" style="background:#fee;border:none;color:var(--primary);border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:1rem">×</button><span>'+it.name+'</span></div><div style="display:flex;align-items:center;gap:1rem"><button onclick="changeQty('+idx+',-1)" style="background:var(--light);border:2px solid var(--border);border-radius:4px;width:28px;height:28px;cursor:pointer">−</button><span style="min-width:24px;text-align:center;font-weight:700">'+it.qty+'</span><button onclick="changeQty('+idx+',1)" style="background:var(--light);border:2px solid var(--border);border-radius:4px;width:28px;height:28px;cursor:pointer">+</button><span style="color:var(--primary);font-weight:700;min-width:80px;text-align:right">'+sub.toFixed(3)+' KD</span></div></div>';
      }).join('');
      el.innerHTML='<div style="background:white;padding:2rem;border-radius:12px;box-shadow:var(--shadow)">'+rows+'<div style="display:flex;justify-content:space-between;padding:1.5rem 0 1rem;font-size:1.2rem;font-weight:700"><span>Total</span><span style="color:var(--primary)">'+total.toFixed(3)+' KD</span></div><div style="display:flex;gap:1rem;flex-wrap:wrap"><a href="/products" class="btn btn-outline" style="border-color:var(--dark);color:var(--dark)">← Continue Shopping</a><a href="/checkout" class="btn btn-primary" style="flex:1;text-align:center">Checkout →</a></div></div>';
    }
    function removeItem(idx){const c=JSON.parse(localStorage.getItem('cart')||'[]');c.splice(idx,1);localStorage.setItem('cart',JSON.stringify(c));location.reload();}
    function changeQty(idx,d){const c=JSON.parse(localStorage.getItem('cart')||'[]');c[idx].qty+=d;if(c[idx].qty<1)c.splice(idx,1);localStorage.setItem('cart',JSON.stringify(c));location.reload();}
    </script>
  `))
})

// CHECKOUT
app.get('/checkout', (_req, res) => {
  res.type('html').send(page('Checkout', 'Checkout', `
    <section>
      <h2 class="section-title">Checkout</h2>
      <div class="checkout-grid">
        <div>
          <form class="checkout-form" id="order-form" onsubmit="submitOrder(event)">
            <h3>📍 Delivery Information</h3>
            <label>Full Name</label>
            <input type="text" id="c-name" placeholder="Your full name" required/>
            <label>Phone Number</label>
            <input type="tel" id="c-phone" placeholder="+965 XXXX XXXX" required/>
            <label>Email</label>
            <input type="email" id="c-email" placeholder="email@example.com"/>
            <div class="form-row">
              <div>
                <label>Area</label>
                <select id="c-area">
                  <option>Kuwait City</option><option>Salmiya</option><option>Hawalli</option>
                  <option>Farwaniya</option><option>Ahmadi</option><option>Jahra</option>
                  <option>Mubarak Al-Kabeer</option>
                </select>
              </div>
              <div>
                <label>Block</label>
                <input type="text" id="c-block" placeholder="Block number"/>
              </div>
            </div>
            <label>Street & Building</label>
            <input type="text" id="c-address" placeholder="Street name, building, apartment" required/>
            <h3 style="margin-top:1rem">💳 Payment Method</h3>
            <div class="payment-methods">
              <div class="pay-method selected" onclick="selectPay(this)">💳 KNET</div>
              <div class="pay-method" onclick="selectPay(this)">💳 Visa/MC</div>
              <div class="pay-method" onclick="selectPay(this)">💵 Cash on Delivery</div>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:1rem;font-size:1.05rem">Place Order 🛒</button>
          </form>
        </div>
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div id="summary-items"></div>
          <div class="summary-total"><span>Total</span><span id="summary-total" style="color:var(--primary)">0.000 KD</span></div>
          <p style="color:#666;font-size:0.82rem;margin-top:1rem">🚚 Free delivery on this order</p>
        </div>
      </div>
    </section>
    <script>
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    let total = 0;
    const si = document.getElementById('summary-items');
    if(!cart.length){si.innerHTML='<p style="color:#666">Cart is empty</p>';}
    else {
      si.innerHTML = cart.map(i=>{total+=i.price*i.qty;return '<div class="summary-item"><span>'+i.name+' ×'+i.qty+'</span><span>'+( i.price*i.qty).toFixed(3)+' KD</span></div>';}).join('');
      document.getElementById('summary-total').textContent = total.toFixed(3)+' KD';
    }
    function selectPay(el){document.querySelectorAll('.pay-method').forEach(e=>e.classList.remove('selected'));el.classList.add('selected');}
    function submitOrder(e){
      e.preventDefault();
      localStorage.removeItem('cart');
      window.location.href = '/order-success?name='+encodeURIComponent(document.getElementById('c-name').value);
    }
    </script>
  `))
})

// ORDER SUCCESS
app.get('/order-success', (req, res) => {
  const name = (req.query.name as string) || 'Customer'
  res.type('html').send(page('Order Placed!', 'Order Confirmation', `
    <section>
      <div class="success-box">
        <div class="checkmark">🎉</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you <strong>${name}</strong>! Your order has been received.<br/>We will contact you shortly to confirm delivery details.</p>
        <p style="margin-bottom:1.5rem;font-size:0.9rem;color:#888">Estimated delivery: <strong>Same day or next day</strong></p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
          <a href="/" class="btn btn-primary">Back to Home</a>
          <a href="https://wa.me/96555555555" class="btn btn-dark" target="_blank">Track via WhatsApp</a>
        </div>
      </div>
    </section>
  `))
})

// ABOUT
app.get('/about', (_req, res) => {
  res.type('html').send(page('About Us', 'About Us', `
    <section>
      <h2 class="section-title">About Kuwait Store</h2>
      <div class="about-content">
        <p>Kuwait Store is your trusted online shopping destination in Kuwait. We offer a wide range of premium products — from fashion and accessories to beauty and lifestyle — at competitive prices.</p>
        <p>Founded with a passion for quality and customer satisfaction, we source our products from trusted local and international suppliers to ensure you always get the best. Every item is carefully selected and quality-checked before reaching you.</p>
        <p>We believe shopping should be easy, safe, and enjoyable. That's why we offer fast delivery across Kuwait, secure payments via KNET and credit cards, and a hassle-free 30-day return policy.</p>
        <p>Our customer support team is available 7 days a week via WhatsApp, phone, and email to help you with any questions or concerns.</p>
        <div class="info-grid">
          <div class="info-box"><h4>📦 Fast Delivery</h4><p>Same-day delivery available in Kuwait City and major areas</p></div>
          <div class="info-box"><h4>🔒 Secure Payment</h4><p>KNET, Visa, Mastercard, and cash on delivery accepted</p></div>
          <div class="info-box"><h4>↩️ Easy Returns</h4><p>30-day return policy, no questions asked</p></div>
          <div class="info-box"><h4>📞 7-Day Support</h4><p>9am–9pm Kuwait time via WhatsApp, phone & email</p></div>
          <div class="info-box"><h4>✅ Authentic Products</h4><p>100% genuine products with quality guarantee</p></div>
          <div class="info-box"><h4>🇰🇼 Kuwait-Based</h4><p>Proudly serving customers across all Kuwait governorates</p></div>
        </div>
      </div>
    </section>
  `))
})

// CONTACT GET
app.get('/contact', (_req, res) => {
  res.type('html').send(page('Contact Us', 'Contact', `
    <section>
      <h2 class="section-title">Contact Us</h2>
      <div class="contact-grid">
        <div class="contact-form">
          <form action="/contact" method="POST">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Your name" required/>
            <label>Email Address</label>
            <input type="email" name="email" placeholder="email@example.com" required/>
            <label>Phone (optional)</label>
            <input type="tel" name="phone" placeholder="+965 XXXX XXXX"/>
            <label>Subject</label>
            <select name="subject">
              <option value="">Select subject</option>
              <option>Order Inquiry</option>
              <option>Return & Refund</option>
              <option>Product Question</option>
              <option>Delivery Issue</option>
              <option>Other</option>
            </select>
            <label>Message</label>
            <textarea name="message" placeholder="How can we help you?" required></textarea>
            <button type="submit">Send Message 📨</button>
          </form>
        </div>
        <div class="contact-info">
          <div class="contact-card"><div class="icon">📍</div><div><h4>Address</h4><p>Salmiya, Block 12, Street 5<br/>Kuwait City, Kuwait</p></div></div>
          <div class="contact-card"><div class="icon">📞</div><div><h4>Phone</h4><p>+965 5555 5555</p></div></div>
          <div class="contact-card"><div class="icon">💬</div><div><h4>WhatsApp</h4><p><a href="https://wa.me/96555555555" style="color:var(--accent)" target="_blank">Chat with us now</a></p></div></div>
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
  console.log('Contact form:', { name, email, message })
  res.type('html').send(page('Message Sent', 'Contact', `
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

// API ENDPOINTS
app.get('/api/products', (_req, res) => {
  res.json({ success: true, count: PRODUCTS.length, products: PRODUCTS })
})

app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === parseInt(req.params.id))
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
  res.json({ success: true, product })
})

// SITEMAP
app.get('/sitemap.xml', (_req, res) => {
  const base = 'https://kuwait-store.com'
  const urls = [
    `${base}/`, `${base}/products`, `${base}/about`, `${base}/contact`, `${base}/cart`,
    ...PRODUCTS.map(p => `${base}/products/${p.id}`)
  ].map(u => `<url><loc>${u}</loc></url>`).join('\n')
  res.type('xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`)
})

// HEALTH
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), products: PRODUCTS.length })
})

// 404
app.use((_req, res) => {
  res.status(404).type('html').send(page('Page Not Found', '', `
    <div class="error-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
        <a href="/" class="btn btn-primary">Go Home</a>
        <a href="/products" class="btn btn-dark">Browse Products</a>
      </div>
    </div>
  `))
})

export default app
