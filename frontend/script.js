// ===== GLOBAL SAFE API =====
window.API_URL = "https://maddhi-agro-store.onrender.com";


// ===== GLOBAL PRODUCTS STORE =====
window.allProducts = [];


// ===== CART HELPERS =====
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
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


// ===== CART COUNT =====
function updateCartCount() {
  const cart = getCart();
  let count = 0;

  cart.forEach(item => count += item.quantity);

  const el = document.getElementById("cartCount");
  if (el) el.innerText = count;
}


// ===============================
// ✅ CATEGORY FILTER (FIXED)
// ===============================
window.filterProducts = function(category) {
  let filtered = window.allProducts;

  if (category !== "All") {
    filtered = window.allProducts.filter(p => {
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
};


// ===============================
// ✅ BUTTON ACTIVE STYLE (FIXED)
// ===============================
window.setActive = function(btn) {
  document.querySelectorAll(".category-btn").forEach(b => {
    b.classList.remove("active");
  });

  btn.classList.add("active");
};


// ===============================
// ===== AUTH SYSTEM =====
// ===============================
let isSignup = false;

window.openAuth = function () {
  const modal = document.getElementById("authModal");
  if (modal) modal.style.display = "flex";
};

window.closeAuth = function () {
  const modal = document.getElementById("authModal");
  if (modal) modal.style.display = "none";
};

window.toggleAuth = function () {
  isSignup = !isSignup;

  const title = document.getElementById("authTitle");
  const nameField = document.getElementById("authName");

  if (!title || !nameField) return;

  title.innerText = isSignup ? "Signup" : "Login";
  nameField.style.display = isSignup ? "block" : "none";
};


// ===== SUBMIT AUTH =====
window.submitAuth = async function () {

  const name = document.getElementById("authName")?.value.trim();
  const email = document.getElementById("authEmail")?.value.trim();
  const password = document.getElementById("authPassword")?.value.trim();

  if (!email || !password || (isSignup && !name)) {
    alert("Fill all fields");
    return;
  }

  const url = isSignup
    ? window.API_URL + "/api/signup"
    : window.API_URL + "/api/login";

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

    if (!res.ok) {
      alert(data.msg || "Error ❌");
      return;
    }

    if (isSignup) {
      alert("Signup successful 🎉");
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


// ===== NAVBAR =====
function updateNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userSection = document.getElementById("userSection");

  if (!userSection) return;

  if (user) {
    userSection.innerHTML =
      "<span>👋 " + user.name + "</span> " +
      "<button onclick='logout()'>Logout</button>";
  } else {
    userSection.innerHTML =
      "<button onclick='openAuth()'>Login</button>";
  }
}


// ===== LOGOUT =====
window.logout = function () {
  localStorage.clear();
  location.reload();
};


// ===============================
// ===== LOAD PRODUCTS =====
// ===============================
async function loadProducts() {
  try {
    const res = await fetch(window.API_URL + "/api/products");
    const products = await res.json();

    if (!Array.isArray(products)) return;

    window.allProducts = products;

    renderProducts(products);

  } catch (err) {
    console.error("Products error:", err);
  }
}


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateNavbar();
  loadProducts();
});