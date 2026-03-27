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
  toast.style.background = "green";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// ===== GO TO CHECKOUT =====
window.goToCheckout = function () {
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

  showToast("Cart updated 🔄"); // ✅ FIXED
};

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
      <a href="#" onclick="loginUser()">Login</a>
    `;
  }
}

// ===== LOGIN =====
window.loginUser = async function () {
  const email = prompt("Enter email");
  const password = prompt("Enter password");

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

// ===== INIT =====
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    const products = await res.json();

    // 🔥 IMPORTANT
    window.allProducts = products;

    renderProducts(products);
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateNavbar();
  renderCart();
  loadProducts();
});
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

function setActive(btn) {
  document.querySelectorAll(".category-btn")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

function checkAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const userSection = document.getElementById("userSection");

  if (token && user) {
    userSection.innerHTML = `
      <span>Hi, ${user.email}</span>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    userSection.innerHTML = `
      <button onclick="openAuth()">Login</button>
    `;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.reload();
}