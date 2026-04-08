// =========================================================
// EchoVault — AI Proxy (Supabase Edge Function)
// Gemini Free Tier + Modular AI Layer
// ---------------------------------------------------------
// Modes:
//  - "insight" → Generate deep reflection insights
//  - "chat"    → ☆Alam AI chatbot response
// ---------------------------------------------------------
// Environment variables (set in Supabase Dashboard):
//   GEMINI_API_KEY
//   OPENAI_API_KEY       (optional)
//   MODEL_PROVIDER       ("gemini" | "openai" | "local")
// =========================================================

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";

// ---------------------------------------------------------
// Load environment variables
// ---------------------------------------------------------
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const PROVIDER = Deno.env.get("MODEL_PROVIDER") ?? "gemini";

// ---------------------------------------------------------
// AI Provider Interface (modular)
// ---------------------------------------------------------
async function runAI(provider: string, system: string, text: string) {
  switch (provider) {
    case "openai":
      return openaiCompletion(system, text);
    case "local":
      return localFallback(system, text);
    default:
      return geminiCompletion(system, text);
  }
}

// ---------------------------------------------------------
// Gemini API (Free Tier Placeholder)
// ---------------------------------------------------------
async function geminiCompletion(system: string, userText: string) {
  if (!GEMINI_API_KEY) return localFallback(system, userText);

  const prompt = `
System: ${system}
User: ${userText}
Generate a natural, grounded, insightful response.
`;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await res.json();

  try {
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch {
    return localFallback(system, userText);
  }
}

// ---------------------------------------------------------
// OpenAI API (Optional)
// ---------------------------------------------------------
async function openaiCompletion(system: string, userText: string) {
  if (!OPENAI_API_KEY) return localFallback(system, userText);

  const body = {
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: userText }
    ]
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  try {
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return localFallback(system, userText);
  }
}

// ---------------------------------------------------------
// Local Fallback (No external AI)
// ---------------------------------------------------------
function localFallback(system: string, userText: string) {
  const canned = [
    "umm yeah… let's slow down and look at this from another angle.",
    "okok, so the underlying principle here is kinda interesting.",
    "bro, when you take a step back, the pattern gets clearer.",
    "hmm alright… there's smth deeper beneath what you're saying.",
    "chill, let's unpack this slowly and logically."
  ];

  return canned[Math.floor(Math.random() * canned.length)];
}

// ---------------------------------------------------------
// Main HTTP Handler
// ---------------------------------------------------------
serve({
  "/": async (req) => {
    try {
      const body = await req.json();

      const mode = body.mode || "chat"; // chat | insight
      const text = body.text || "";
      const system = body.system || "";

      // ------------------------------
      // Generate AI output
      // ------------------------------
      const output = await runAI(PROVIDER, system, text);

      if (mode === "insight") {
        return new Response(JSON.stringify({ insight: output }), {
          headers: { "Content-Type": "application/json" },
          status: 200
        });
      }

      return new Response(JSON.stringify({ reply: output }), {
        headers: { "Content-Type": "application/json" },
        status: 200
      });

    } catch (err) {
      return new Response(
        JSON.stringify({ error: "AI processing failed", details: err.message }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }
  }
});
