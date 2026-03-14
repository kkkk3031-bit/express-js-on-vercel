import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'public')))

const nav = `
<nav>
  <a class="logo" href="/">🛍️ Kuwait Store</a>
  <a href="/">Home</a>
  <a href="/products">Products</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>`

const footer = `
<footer>
  <p>&copy; ${new Date().getFullYear()} <span>Kuwait Store</span>. All rights reserved.</p>
</footer>`

// HOME
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Kuwait Store - Home</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        ${nav}
        <div class="hero">
          <h1>Welcome to Kuwait Store</h1>
          <p>Your trusted online store in Kuwait. Quality products, fast delivery.</p>
          <a href="/products" class="btn">Shop Now</a>
        </div>
        <section>
          <h2>Featured Products</h2>
          <div class="products-grid">
            <div class="product-card">
              <h3>Premium Watch</h3>
              <div class="price">12.500 KD</div>
              <p>Elegant design with high quality materials.</p>
            </div>
            <div class="product-card">
              <h3>Leather Bag</h3>
              <div class="price">8.750 KD</div>
              <p>Handcrafted genuine leather bag.</p>
            </div>
            <div class="product-card">
              <h3>Sunglasses</h3>
              <div class="price">5.500 KD</div>
              <p>UV400 protection, stylish frames.</p>
            </div>
          </div>
        </section>
        ${footer}
      </body>
    </html>
  `)
})

// PRODUCTS
app.get('/products', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Kuwait Store - Products</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        ${nav}
        <section>
          <h2>All Products</h2>
          <div class="products-grid">
            <div class="product-card">
              <h3>Premium Watch</h3>
              <div class="price">12.500 KD</div>
              <p>Elegant design with high quality materials. Water resistant up to 50m.</p>
            </div>
            <div class="product-card">
              <h3>Leather Bag</h3>
              <div class="price">8.750 KD</div>
              <p>Handcrafted genuine leather bag. Multiple compartments.</p>
            </div>
            <div class="product-card">
              <h3>Sunglasses</h3>
              <div class="price">5.500 KD</div>
              <p>UV400 protection, stylish frames. Comes with a case.</p>
            </div>
            <div class="product-card">
              <h3>Perfume Set</h3>
              <div class="price">15.000 KD</div>
              <p>Luxury Arabian perfume set, 3 bottles.</p>
            </div>
            <div class="product-card">
              <h3>Silk Scarf</h3>
              <div class="price">6.250 KD</div>
              <p>100% pure silk, vibrant colors.</p>
            </div>
            <div class="product-card">
              <h3>Gold Bracelet</h3>
              <div class="price">45.000 KD</div>
              <p>18k gold plated bracelet, adjustable size.</p>
            </div>
          </div>
        </section>
        ${footer}
      </body>
    </html>
  `)
})

// ABOUT
app.get('/about', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Kuwait Store - About</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        ${nav}
        <section>
          <h2>About Us</h2>
          <div class="about-content">
            <p>Kuwait Store is your trusted online shopping destination in Kuwait. We offer a wide range of premium products at competitive prices.</p>
            <p>Founded with a passion for quality and customer satisfaction, we source our products from trusted suppliers to ensure you always get the best.</p>
            <p>We offer fast delivery across Kuwait and a hassle-free return policy. Your satisfaction is our priority.</p>
            <p><strong>Contact us:</strong> info@kuwait-store.com</p>
          </div>
        </section>
        ${footer}
      </body>
    </html>
  `)
})

// CONTACT
app.get('/contact', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Kuwait Store - Contact</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        ${nav}
        <section>
          <h2>Contact Us</h2>
          <div class="contact-form">
            <form action="/contact" method="POST">
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
              <textarea name="message" placeholder="Your Message" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </section>
        ${footer}
      </body>
    </html>
  `)
})

// CONTACT POST
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body
  console.log('Contact form:', { name, email, message })
  res.type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Kuwait Store - Message Sent</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        ${nav}
        <section>
          <h2>Message Sent!</h2>
          <div class="about-content">
            <p>Thank you <strong>${name}</strong>! We received your message and will reply to <strong>${email}</strong> soon.</p>
            <br/>
            <a href="/" class="btn">Back to Home</a>
          </div>
        </section>
        ${footer}
      </body>
    </html>
  `)
})

// HEALTH CHECK
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API
app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Premium Watch', price: 12.5, currency: 'KD' },
      { id: 2, name: 'Leather Bag', price: 8.75, currency: 'KD' },
      { id: 3, name: 'Sunglasses', price: 5.5, currency: 'KD' },
      { id: 4, name: 'Perfume Set', price: 15.0, currency: 'KD' },
      { id: 5, name: 'Silk Scarf', price: 6.25, currency: 'KD' },
      { id: 6, name: 'Gold Bracelet', price: 45.0, currency: 'KD' },
    ]
  })
})

export default app
