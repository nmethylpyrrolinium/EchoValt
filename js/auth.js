/* =========================================================
   EchoVault — auth.js (FINAL)
   Supabase authentication (login/signup/logout + state)
========================================================= */

// ✅ Supabase CDN must be loaded in HTML before this file

// ---- Supabase Config ----
const SUPABASE_URL = "https://phfwaxuyauuyskzruqbk.supabase.co";
const SUPABASE_ANON = "sb_publishable_L1KAnz1Y3hM0inwbCjv-8g_uDYg7eAv";

// ---- Create Client ----
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ---- Global State ----
let currentUser = null;

/* =========================================================
   Check Auth State
========================================================= */
async function checkAuthState() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
        console.error("Auth error:", error.message);
        return;
    }

    if (data.user) {
        currentUser = data.user;
        updateAuthUI(true);
    } else {
        currentUser = null;
        updateAuthUI(false);
    }
}

/* =========================================================
   Update UI
========================================================= */
function updateAuthUI(isLoggedIn) {
    const statusEl = document.getElementById("authStatus");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!statusEl) return;

    if (isLoggedIn) {
        statusEl.textContent = "Logged in as: " + currentUser.email;
        if (logoutBtn) logoutBtn.classList.remove("hidden");
    } else {
        statusEl.textContent = "Not logged in";
        if (logoutBtn) logoutBtn.classList.add("hidden");
    }
}

/* =========================================================
   Signup
========================================================= */
async function signup() {
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!email || !password) {
        alert("Enter email and password");
        return;
    }

    const { error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if (error) {
        alert("Signup failed: " + error.message);
    } else {
        alert("Signup successful. Check your email.");
    }
}

/* =========================================================
   Login
========================================================= */
async function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Enter email and password");
        return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert("Login failed: " + error.message);
    } else {
        location.reload();
    }
}

/* =========================================================
   Logout
========================================================= */
async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout error:", error.message);
    }

    location.reload();
}

/* =========================================================
   Attach Logout Button
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});
