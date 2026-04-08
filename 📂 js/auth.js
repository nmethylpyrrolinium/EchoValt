/* =========================================================
   EchoVault — auth.js
   Supabase authentication (hybrid: guest + login)
========================================================= */

// ---- Supabase Client (replace with your credentials) ----
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON = "YOUR_PUBLIC_ANON_KEY";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ---- Global state ----
let currentUser = null;

// ---- Check login state on page load ----
async function checkAuthState() {
    const { data } = await supabaseClient.auth.getUser();

    if (data.user) {
        currentUser = data.user;
        updateAuthUI(true);
    } else {
        currentUser = null;
        updateAuthUI(false);
    }
}

// ---- Update UI based on login state ----
function updateAuthUI(isLoggedIn) {
    const statusEl = document.getElementById("authStatus");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!statusEl) return;

    if (isLoggedIn) {
        statusEl.textContent = "Logged in as: " + currentUser.email;
        if (logoutBtn) logoutBtn.classList.remove("hidden");
    } else {
        statusEl.textContent = "Using guest mode";
        if (logoutBtn) logoutBtn.classList.add("hidden");
    }
}

// ---- Login ----
async function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

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

// ---- Signup ----
async function signup() {
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    const { error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Signup successful. Check your email to confirm.");
}

// ---- Logout ----
async function logout() {
    await supabaseClient.auth.signOut();
    location.reload();
      }
