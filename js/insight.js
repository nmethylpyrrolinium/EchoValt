/* =========================================================
   EchoVault — insight.js
   AI-powered insight generator (modular backend)
   Uses Gemini Free API or Supabase Edge Function
========================================================= */

// ---- CONFIG ----
const AI_ENDPOINT = "https://phfwaxuyauuyskzruqbk.supabase.co/functions/v1/ai";
// Or:
// const AI_ENDPOINT = "https://<your-supabase>.supabase.co/functions/v1/ai";

/* =========================================================
   Generate Insight (AI or fallback rule-based)
========================================================= */

async function generateInsightText(moment, feeling) {
    const userText = `Moment: ${moment}\nFeeling: ${feeling}`;

    try {
        const response = await fetch(AI_ENDPOINT, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                mode: "insight",
                text: userText
            })
        });

        const data = await response.json();

        if (data.insight) return data.insight;

    } catch (err) {
        console.warn("AI unavailable — using fallback insight");
    }

    // ======== Fallback Insight Logic ======== //
    const combined = (moment + " " + feeling).toLowerCase();

    const pos = ["happy", "joy", "grateful", "excited", "peace"];
    const neg = ["sad", "tired", "angry", "anxious", "lost", "empty"];

    let tone = "neutral";

    if (pos.some(w => combined.includes(w))) tone = "positive";
    if (neg.some(w => combined.includes(w))) tone = "negative";

    const fallback = {
        positive: "It seems today carried a sense of lightness. Hold onto that clarity — it shapes your inner rhythm.",
        negative: "You're carrying something heavy today. Notice it gently, without judgment. Meaning grows from awareness.",
        neutral:  "Your day seems quiet, but meaningful in subtle ways. Often the soft moments reveal the real patterns."
    };

    return fallback[tone];
}

/* =========================================================
   Reflection Form Handler
========================================================= */

async function handleReflectionSubmit(event) {
    event.preventDefault();

    const moment = document.getElementById("momentInput").value.trim();
    const feeling = document.getElementById("feelingInput").value.trim();

    if (!moment || !feeling) {
        alert("Please fill all fields.");
        return;
    }

    // Generate insight
    const insightText = await generateInsightText(moment, feeling);

    const entry = {
        moment,
        feeling,
        insight: insightText,
        ts: Date.now()
    };

    // Save locally
    saveLocalReflection(entry);
    saveLocalInsight(entry);

    // Show latest insight if on reflection page
    const lastInsightText = document.getElementById("lastInsightText");
    const lastInsightCard = document.getElementById("lastInsight");
    if (lastInsightText && lastInsightCard) {
        lastInsightText.textContent = insightText;
        lastInsightCard.classList.remove("hidden");
    }

    // Clear form
    document.getElementById("momentInput").value = "";
    document.getElementById("feelingInput").value = "";
}

/* =========================================================
   Load Insights (local/cloud hybrid)
========================================================= */

async function loadInsights() {
    let local = loadLocalInsights();
    let cloud = [];

    if (currentUser) {
        cloud = await loadCloudReflections();
    }

    const combined = [...cloud, ...local];

    const list = document.getElementById("insightList");

    if (combined.length === 0) {
        list.innerHTML = "<p>No insights yet.</p>";
        return;
    }

    list.innerHTML = combined
        .map(entry => `
        <div class="item fade-up">
            <strong>${new Date(entry.ts || entry.created_at).toLocaleString()}</strong>
            <p>${entry.insight}</p>
        </div>
    `)
        .join("");
          }
