/* =========================================================
   EchoVault — app.js
   Global initializer for all pages
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    highlightActiveNav();
    smoothPageEnter();

    // Check user login state (Supabase)
    if (window.checkAuthState) {
        await checkAuthState();
    }

    // Sync local reflections to Supabase (if logged in)
    if (window.syncStoredReflections) {
        await syncStoredReflections();
    }

    // Load insights when in insights page
    if (document.getElementById("insightList") && window.loadInsights) {
        loadInsights();
    }

    // Initialize reflection form if present
    const reflectionForm = document.getElementById("reflectionForm");
    if (reflectionForm && window.handleReflectionSubmit) {
        reflectionForm.addEventListener("submit", handleReflectionSubmit);
    }

    // Initialize chat if on chat page
    const chatForm = document.getElementById("chatForm");
    if (chatForm && window.handleChatSubmit) {
        chatForm.addEventListener("submit", handleChatSubmit);
    }
});
