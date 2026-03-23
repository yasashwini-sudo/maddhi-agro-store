// ===== API URL =====
const API_URL = "http://localhost:5000";


// ===== CART HELPERS =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
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


// ===== GO TO CHECKOUT =====
window.goToCheckout = function () {
  console.log("Going to checkout...");
  window.location.href = "checkout.html";
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


// ===== RENDER CART =====
function renderCart() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (!container || !totalEl) return;

  const cart = getCart();
  container.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<h2>Your cart is empty 🛒</h2>"; // ✅ FIXED
    totalEl.innerText = 0;
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${API_URL}/uploads/${item.image}" />
      <div class="cart-info">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>

        <button onclick="changeQty('${item._id}',1)">+</button>
        ${item.quantity}
        <button onclick="changeQty('${item._id}',-1)">-</button>
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.innerText = total;
}


// ===== CHANGE QTY =====
window.changeQty = function(id, change) {
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
};


// ===== CHECKOUT CALCULATION =====
function calculateTotals() {
  const cart = getCart();

  let subtotal = 0;
  cart.forEach(item => subtotal += item.price * item.quantity);

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


// ===== NAVBAR =====
function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userSection = document.getElementById("userSection");

  if (!userSection) return;

  if (user) {
    userSection.innerHTML = `
      <span class="user-name">Hi, ${user.name}</span>
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


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateNavbar();
  renderCart();
});