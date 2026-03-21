// ===== CART HELPERS =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== RENDER CART =====
function renderCart() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (!container || !totalEl) return;

  const cart = getCart();

  container.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;margin-top:60px;">
        <h2>Your cart is empty 🛒</h2>
        <a href="index.html" style="
          display:inline-block;
          margin-top:15px;
          padding:10px 18px;
          background:#2e7d32;
          color:white;
          border-radius:8px;
          text-decoration:none;">
          Shop Now
        </a>
      </div>
    `;
    totalEl.innerText = 0;
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="http://localhost:5000/uploads/${item.image}" />
      <div class="cart-info">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>

        <button class="qty-btn" onclick="changeQty('${item._id}',1)">+</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty('${item._id}',-1)">-</button>
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.innerText = total;
}

// ===== CHANGE QTY =====
function changeQty(id, change) {
  let cart = getCart();

  const item = cart.find(p => p._id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p._id !== id);
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

// ===== ADD TO CART =====
window.addToCart = function (product) {
  if (!product) return;

  let cart = getCart();

  const existing = cart.find(item => item._id === product._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();

  alert("Added to cart ✅");
};

// ===== BUY NOW =====
window.buyNow = function (product) {
  if (!product) return;

  saveCart([{ ...product, quantity: 1 }]);
  window.location.href = "checkout.html";
};

// ===== CART COUNT =====
function updateCartCount() {
  const cart = getCart();

  let count = 0;
  cart.forEach(item => count += item.quantity);

  const el = document.getElementById("cartCount");
  if (el) el.innerText = count;
}

// ===== CHECKOUT CALCULATION =====
function calculateTotals() {
  const cart = getCart();

  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const isNewUser = !localStorage.getItem("hasOrdered");

  let discount = 0;
  if (isNewUser && subtotal > 0) {
    discount = Math.floor(subtotal * 0.10);

    const box = document.getElementById("discountBox");
    if (box) box.style.display = "flex";

    const discountEl = document.getElementById("discount");
    if (discountEl) discountEl.innerText = discount;
  }

  const finalTotal = subtotal - discount;

  const subtotalEl = document.getElementById("subtotal");
  const finalEl = document.getElementById("finalTotal");

  if (subtotalEl) subtotalEl.innerText = subtotal;
  if (finalEl) finalEl.innerText = finalTotal;

  return { subtotal, discount, finalTotal };
}

// ===== USER SYSTEM =====
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

// ===== NAVBAR =====
function updateNavbar() {
  const user = getUser();
  const userSection = document.getElementById("userSection");

  if (!userSection) return;

  if (user) {
    userSection.innerHTML = `
      <span>Hi, ${user.name}</span>
      <a href="orders.html">My Orders</a>
      <a href="#" onclick="logout()">Logout</a>
    `;
  } else {
    userSection.innerHTML = `
      <a href="#" onclick="fakeLogin()">Login</a>
    `;
  }
}

// ===== LOGIN =====
window.fakeLogin = function () {
  const name = prompt("Enter your name");

  if (name) {
    localStorage.setItem("user", JSON.stringify({ name }));
    location.reload();
  }
};

// ===== LOGOUT =====
window.logout = function () {
  localStorage.removeItem("user");
  location.reload();
};

// ===== CHECKOUT BUTTON =====
window.goToCheckout = function () {
  window.location.href = "checkout.html";
};

// ===== AUTO RUN =====
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  updateNavbar();

  if (document.getElementById("cartItems")) {
    renderCart();
  }

  if (document.getElementById("orderItems")) {
    renderCheckoutItems();
    calculateTotals();
  }
});

// ===== CHECKOUT ITEMS =====
function renderCheckoutItems() {
  const container = document.getElementById("orderItems");
  if (!container) return;

  const cart = getCart();

  container.innerHTML = "";

  cart.forEach(item => {
    const total = item.price * item.quantity;

    container.innerHTML += `
      <p>${item.name} x ${item.quantity} = ₹${total}</p>
    `;
  });
}