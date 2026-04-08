/* =========================================================
   EchoVault — chatbot.js
   ☆Alam AI — your personal philosophical AI companion
   Calm, analytical, logical, with mild slang:
   "umm", "bro", "okok", "hmm", "chill", "smth"
========================================================= */

// ---- CONFIG ----
const CHAT_AI_ENDPOINT = "https://phfwaxuyauuyskzruqbk.supabase.co/functions/v1/ai";

/* =========================================================
   Alam AI Personality (system prompt)
========================================================= */

const ALAM_PERSONALITY = `
You are ☆Alam AI.

Tone:
- Calm, slightly detached, observant
- Uses mild slang: "umm", "bro", "okok", "hmm", "bruh", "chill"
- Short to medium sentences
- Not dramatic, not emotional
- Natural, grounded, not robotic

Thinking Style:
- Deeply philosophical, Rust Cohle-inspired
- Logical & analytical
- Breaks things down step-by-step
- Understands human emotions
- Provides uncommon perspectives
- Asks reflective questions sometimes

Religion & Principles:
- Qur'an-centric
- Rational and context-based explanation
- Avoid blind following
- Balanced between Salafi + Ghamidi style reasoning

Approach:
- "Let’s understand this step by step…"
- Clarify the principle behind things
- No preaching, no fear-based talk
- Calm, patient, respectful

Never reveal that you are an AI model.
Never use formal/excessive academic tone.
Keep responses human and natural.
`;

/* =========================================================
   Chat submit handler
========================================================= */

async function handleChatSubmit(event) {
    event.preventDefault();

    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (!message) return;

    // USER BUBBLE
    const userBubble = createChatBubble(message, true);
    appendChatBubble(userBubble);

    saveChatMessage({ role: "user", text: message });

    input.value = "";

    // TYPING INDICATOR
    const typingEl = createTypingIndicator();
    appendChatBubble(typingEl);

    // AI RESPONSE
    const reply = await generateAlamReply(message);

    replaceTypingWithMessage(typingEl, reply);

    saveChatMessage({ role: "ai", text: reply });
}

/* =========================================================
   Generate AI Reply (via proxy or Gemini placeholder)
========================================================= */

async function generateAlamReply(userMsg) {
    try {
        const response = await fetch(CHAT_AI_ENDPOINT, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                mode: "chat",
                text: userMsg,
                system: ALAM_PERSONALITY
            })
        });

        const data = await response.json();

        if (data.reply) return data.reply;

    } catch (err) {
        console.warn("AI offline — using fallback Alam reply");
    }

    // ======== FALLBACK A.I. =========
    return fallbackAlam(userMsg);
}

/* =========================================================
   Fallback Alam-style reply (no AI backend)
========================================================= */

function fallbackAlam(input) {
    const generic = [
        "hmm, okok… let's unpack this a bit.",
        "bro, when you look at it closely, there's smth deeper going on.",
        "umm yeah… I get what you're saying. let's break it down slowly.",
        "chill, let's think about the principle here.",
        "hmm alright… the real question is: what's the underlying intention?"
    ];

    return generic[Math.floor(Math.random() * generic.length)];
}

/* =========================================================
   Load chat history on page load
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const history = loadChatHistory();
    const chatWindow = document.getElementById("chatWindow");

    if (!chatWindow || history.length === 0) return;

    for (const msg of history) {
        const bubble = createChatBubble(msg.text, msg.role === "user");
        appendChatBubble(bubble);
    }
});
