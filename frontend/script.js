/ ===== API URL =====
const API_URL = "https://maddhi-agro-store.onrender.com";


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
  showToast("Added to cart ✅");
};


// ===== TOAST =====
function showToast(msg) {
  const toast = document.createElement("div");
  toast.innerText = msg;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#2e7d32",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    zIndex: 9999
  });

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


// ===== NAVIGATION =====
window.goToCheckout = () => window.location.href = "checkout.html";

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
    container.innerHTML = "<h2>Your cart is empty 🛒</h2>";
    totalEl.innerText = 0;
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${API_URL}/uploads/${item.image || 'default.png'}"
      onerror="this.src='https://via.placeholder.com/150'" />
      
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

  showToast("Cart updated 🔄");
};


// ===============================
// ===== AUTH SYSTEM =====
// ===============================
let isSignup = false;


// OPEN MODAL
window.openAuth = function () {
  const modal = document.getElementById("authModal");
  if (modal) modal.style.display = "flex";
};

// CLOSE MODAL
window.closeAuth = function () {
  const modal = document.getElementById("authModal");
  if (modal) modal.style.display = "none";
};


// TOGGLE LOGIN ↔ SIGNUP
window.toggleAuth = function () {
  isSignup = !isSignup;

  const title = document.getElementById("authTitle");
  const nameField = document.getElementById("authName");
  const switchText = document.querySelector(".switch-text");

  if (!title || !nameField || !switchText) return;

  title.innerText = isSignup ? "Signup" : "Login";
  nameField.style.display = isSignup ? "block" : "none";

  switchText.innerText =
    isSignup ? "Already have account? Login" : "Don't have account? Signup";
};


// SUBMIT AUTH
window.submitAuth = async function () {

  const name = document.getElementById("authName")?.value.trim();
  const email = document.getElementById("authEmail")?.value.trim();
  const password = document.getElementById("authPassword")?.value.trim();

  if (!email || !password || (isSignup && !name)) {
    alert("Fill all fields");
    return;
  }

  const url = isSignup
    ? ${API_URL}/api/register
    : ${API_URL}/api/login;

  const body = isSignup
    ? { name, email, password }
    : { email, password };

  try {

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log("AUTH RESPONSE:", data);

    if (!res.ok) {
      alert(data.msg || data.message || "Error ❌");
      return;
    }

    if (isSignup) {
      alert("Signup successful 🎉 Now login");
      toggleAuth();
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login successful 🎉");

    closeAuth();
    updateNavbar();

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};


// ===== NAVBAR UPDATE =====
function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userSection = document.getElementById("userSection");

  if (!userSection) return;

  if (user) {
    userSection.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <span>👋 ${user.name}</span>
        <button onclick="logout()">Logout</button>
      </div>
    `;
  } else {
    userSection.innerHTML = `
      <button onclick="openAuth()">Login</button>
    `;
  }
}


// ===== LOGOUT =====
window.logout = function () {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  location.reload();
};


// ===== LOAD PRODUCTS =====
async function loadProducts() {
  try {
    console.log("Fetching from:", ${API_URL}/api/products);

    const res = await fetch(${API_URL}/api/products);
    const products = await res.json();

    console.log("Products:", products);

    window.allProducts = products;

    if (typeof renderProducts === "function") {
      renderProducts(products);
    }

  } catch (err) {
    console.error("Error loading products:", err);
  }
}


// ===== FILTER =====
function filterProducts(category) {
  const allProducts = window.allProducts || [];

  let filtered = allProducts;

  if (category !== "All") {
    filtered = allProducts.filter(p => {
      const cat = p.category?.toLowerCase();

      if (category === "Oils") return cat === "oil";
      if (category === "Spices") return cat === "spice";
      if (category === "Ghee") return cat === "ghee";
      if (category === "Salt") return cat === "salt";

      return true;
    });
  }

  if (typeof renderProducts === "function") {
    renderProducts(filtered);
  }
}


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateNavbar();
  renderCart();
  loadProducts();
});