/**
 * Techzyncmedia E-Commerce Cart Manager & Slide-over Cart Drawer
 */

const CART_KEY = "techzync_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function addToCart(pkgId, name, price, description) {
  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === pkgId);
  
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: pkgId,
      name: name,
      price: price,
      description: description,
      qty: 1
    });
  }
  
  saveCart(cart);
  openCartDrawer();
}

function updateCartQty(pkgId, delta) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === pkgId);
  if (index > -1) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }
  saveCart(cart);
}

function removeFromCart(pkgId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== pkgId);
  saveCart(cart);
}

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badges = document.querySelectorAll(".cart-badge-count");
  badges.forEach(b => {
    b.innerText = totalCount;
  });
}

function openCartDrawer() {
  const drawer = document.getElementById("techzyncCartDrawer");
  const overlay = document.getElementById("techzyncCartOverlay");
  if (drawer && overlay) {
    drawer.style.transform = "translateX(0)";
    overlay.style.display = "block";
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("techzyncCartDrawer");
  const overlay = document.getElementById("techzyncCartOverlay");
  if (drawer && overlay) {
    drawer.style.transform = "translateX(100%)";
    overlay.style.display = "none";
  }
}

function renderCartDrawer() {
  const cart = getCart();
  const itemsContainer = document.getElementById("cartDrawerItems");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div style="text-align:center; padding:60px 20px; color:#94a3b8;">
        <div style="font-size:3rem; margin-bottom:12px;">🛒</div>
        <div style="font-weight:700; color:#ffffff; font-size:1.1rem; margin-bottom:6px;">Your Cart is Empty</div>
        <p style="font-size:0.88rem;">Select a service package to add it to your order.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.innerText = "₹0.00";
    if (totalEl) totalEl.innerText = "₹0.00";
    return;
  }

  let subtotal = 0;
  itemsContainer.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <div style="background:#0f172a; border:1px solid #334155; border-radius:12px; padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <div style="flex:1;">
          <div style="font-weight:700; color:#ffffff; font-size:0.95rem;">${item.name}</div>
          <div style="font-size:0.8rem; color:#94a3b8; margin-top:2px;">₹${item.price.toLocaleString('en-IN')} each</div>
          <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
            <button onclick="updateCartQty('${item.id}', -1)" style="background:#1e293b; color:#ffffff; border:1px solid #334155; border-radius:4px; width:26px; height:26px; font-weight:800; cursor:pointer;">-</button>
            <span style="font-weight:700; color:#38bdf8; font-size:0.9rem;">${item.qty}</span>
            <button onclick="updateCartQty('${item.id}', 1)" style="background:#1e293b; color:#ffffff; border:1px solid #334155; border-radius:4px; width:26px; height:26px; font-weight:800; cursor:pointer;">+</button>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:800; color:#38bdf8; font-size:1.05rem;">₹${itemTotal.toLocaleString('en-IN')}</div>
          <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#ef4444; font-size:0.8rem; cursor:pointer; margin-top:8px; text-decoration:underline;">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  const total = subtotal;

  if (subtotalEl) subtotalEl.innerText = "₹" + subtotal.toLocaleString('en-IN') + ".00";
  if (totalEl) totalEl.innerText = "₹" + total.toLocaleString('en-IN') + ".00";
}

function initCartUI() {
  // Inject Cart Drawer CSS & DOM if not present
  if (!document.getElementById("techzyncCartDrawer")) {
    const style = document.createElement("style");
    style.innerHTML = `
      .cart-overlay {
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 99998;
      }
      .cart-drawer {
        position: fixed;
        top: 0; right: 0; width: 420px; max-width: 90vw; height: 100%;
        background: #1e293b;
        border-left: 1px solid #334155;
        box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        z-index: 99999;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        color: #ffffff;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "techzyncCartOverlay";
    overlay.className = "cart-overlay";
    overlay.onclick = closeCartDrawer;
    document.body.appendChild(overlay);

    const drawer = document.createElement("div");
    drawer.id = "techzyncCartDrawer";
    drawer.className = "cart-drawer";
    drawer.innerHTML = `
      <div style="padding:20px 24px; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center; background:#0f172a;">
        <div style="font-weight:800; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
          <span>🛒 Your Service Cart</span>
        </div>
        <button onclick="closeCartDrawer()" style="background:none; border:none; color:#cbd5e1; font-size:1.5rem; cursor:pointer;">&times;</button>
      </div>

      <div id="cartDrawerItems" style="flex:1; overflow-y:auto; padding:20px 24px;"></div>

      <div style="padding:20px 24px; border-top:1px solid #334155; background:#0f172a;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem; color:#94a3b8;">
          <span>Subtotal</span>
          <span id="cartSubtotal" style="color:#ffffff;">₹0.00</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.9rem; color:#94a3b8;">
          <span>Taxes</span>
          <span style="color:#10b981; font-weight:700;">Included</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:1.15rem; font-weight:800;">
          <span>Total Amount</span>
          <span id="cartTotal" style="color:#38bdf8;">₹0.00</span>
        </div>
        <a href="/checkout.html" class="btn btn-primary" style="display:block; text-align:center; background:linear-gradient(135deg, #2563eb 0%, #0284c7 100%); color:#ffffff; font-weight:800; padding:14px; border-radius:8px; text-decoration:none; box-shadow:0 4px 15px rgba(37,99,235,0.3);">
          Proceed to Checkout &rarr;
        </a>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  updateCartBadge();
  renderCartDrawer();
}

document.addEventListener("DOMContentLoaded", initCartUI);
