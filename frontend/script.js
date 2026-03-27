// ===== API URL =====
window.API_URL = "https://maddhi-agro-store.onrender.com";


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

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#2e7d32";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

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


// ===== AUTH (CLEAN VERSION) =====
function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userSection = document.getElementById("userSection");

  if (!userSection) return;

  if (user) {
    userSection.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-weight:500;">👋 ${user.name}</span>
        <button onclick="logout()" style="
          background:#e53935;
          color:white;
          border:none;
          padding:6px 10px;
          border-radius:6px;
          cursor:pointer;
        ">Logout</button>
      </div>
    `;
  } else {
    userSection.innerHTML = `
      <button onclick="loginUser()" style="
        background:#2e7d32;
        color:white;
        border:none;
        padding:6px 12px;
        border-radius:6px;
        cursor:pointer;
      ">Login</button>
    `;
  }
}


// ===== LOGIN =====
window.loginUser = async function () {
  const email = prompt("Enter email");
  const password = prompt("Enter password");

  if (!email || !password) return;

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      showToast("Login successful 🎉");
      location.reload();
    } else {
      showToast(data.msg || "Login failed ❌");
    }
  } catch (err) {
    console.error(err);
    showToast("Server error ❌");
  }
};


// ===== LOGOUT =====
window.logout = function () {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  location.reload();
};


// ===== LOAD PRODUCTS =====
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    const products = await res.json();

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

  renderProducts(filtered);
}


// ===== ACTIVE BUTTON =====
function setActive(btn) {
  document.querySelectorAll(".category-btn")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateNavbar();
  renderCart();
  loadProducts();
});