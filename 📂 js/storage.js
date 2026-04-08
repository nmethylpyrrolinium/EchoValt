/* =========================================================
   EchoVault — storage.js
   Local storage + cloud sync
========================================================= */

const LS_REFLECTIONS = "ev_reflections";
const LS_INSIGHTS = "ev_insights";
const LS_CHAT = "ev_chat_history";

// Utility: load JSON safely
function lsLoad(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

// Utility: save JSON safely
function lsSave(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ==========================
   REFLECTIONS (Local)
========================== */

function saveLocalReflection(entry) {
    const list = lsLoad(LS_REFLECTIONS);
    list.unshift(entry);
    lsSave(LS_REFLECTIONS, list);
}

function loadLocalReflections() {
    return lsLoad(LS_REFLECTIONS);
}

/* ==========================
   INSIGHTS (Local)
========================== */

function saveLocalInsight(entry) {
    const list = lsLoad(LS_INSIGHTS);
    list.unshift(entry);
    lsSave(LS_INSIGHTS, list);
}

function loadLocalInsights() {
    return lsLoad(LS_INSIGHTS);
}

/* ==========================
   CHAT HISTORY (Local)
========================== */

function saveChatMessage(msg) {
    const list = lsLoad(LS_CHAT);
    list.push(msg);
    lsSave(LS_CHAT, list);
}

function loadChatHistory() {
    return lsLoad(LS_CHAT);
}

/* ==========================
   CLOUD SYNC (Supabase)
========================== */

async function syncStoredReflections() {
    if (!currentUser) return;

    const local = loadLocalReflections();
    if (local.length === 0) return;

    for (const entry of local) {
        await supabaseClient.from("reflections").insert({
            user_id: currentUser.id,
            moment: entry.moment,
            feeling: entry.feeling,
            insight: entry.insight,
            created_at: entry.ts
        });
    }
}

/* ==========================
   LOAD CLOUD REFLECTIONS
========================== */

async function loadCloudReflections() {
    if (!currentUser) return [];

    const { data } = await supabaseClient
        .from("reflections")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

    return data || [];
}
