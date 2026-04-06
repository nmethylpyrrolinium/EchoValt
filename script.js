// ============================================
// EchoVault - Enhanced JavaScript
// Premium interactions, sentiment analysis, and localStorage management
// Inspired by Stripe, Apple, Framer, Airbnb Design patterns
// ============================================

// ============================================
// DOM ELEMENT REFERENCES
// ============================================

const reflectionForm = document.getElementById("reflection-form");
const meaningfulMomentInput = document.getElementById("meaningful-moment");
const dominantFeelingInput = document.getElementById("dominant-feeling");
const generateBtn = document.getElementById("generate-btn");
const insightCard = document.getElementById("insight-card");
const insightText = document.getElementById("insight-text");
const insightTimestamp = document.getElementById("insight-timestamp");
const sentimentIndicator = document.getElementById("sentiment-indicator");

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

const STORAGE_KEY_MEANINGFUL = "echovault_meaningful";
const STORAGE_KEY_FEELING = "echovault_feeling";
const STORAGE_KEY_TIMESTAMP = "echovault_timestamp";

// Sentiment Analysis: Keyword mapping for emotional intelligence
const SENTIMENT_KEYWORDS = {
    positive: [
        "happy", "excited", "proud", "joyful", "grateful", "blessed",
        "accomplished", "confident", "energized", "inspired", "delighted",
        "wonderful", "amazing", "fantastic", "great", "excellent", "love",
        "loved", "beautiful", "success", "achieved", "accomplished", "joy",
        "celebrate", "triumph", "grateful", "thankful", "blessed", "radiant",
        "brilliant", "outstanding", "superb", "magnificent", "incredible",
        "awesome", "nice", "good", "better", "best", "perfect", "succeed"
    ],
    negative: [
        "stressed", "tired", "sad", "anxious", "worried", "frustrated",
        "angry", "overwhelmed", "exhausted", "lonely", "disappointed",
        "scared", "afraid", "depressed", "unhappy", "struggling", "pain",
        "hurt", "confused", "lost", "doubt", "failure", "failed", "sick",
        "ill", "weak", "helpless", "desperate", "miserable", "grief",
        "broken", "shattered", "devastated", "crushed", "tormented",
        "anguish", "despair", "hopeless", "useless", "worthless"
    ],
    neutral: [
        "reflect", "think", "consider", "ponder", "realize", "discover",
        "understand", "learn", "grow", "experience", "moment", "time",
        "day", "journey", "path", "way", "question", "wonder", "curious",
        "process", "change", "shift", "transition", "development", "progress"
    ]
};

// Dynamic insight messages based on sentiment
const INSIGHT_TEMPLATES = {
    positive: [
        "Your day radiated positivity. Hold onto this energy—it's a reminder of what brings you alive. These moments are the golden thread in your story.",
        "What a beautiful day you've had. These moments of joy are the chapters worth remembering. You've found something worth celebrating.",
        "Your spirit shines through your words. You've tasted success and gratitude today. That's the essence of a well-lived day.",
        "Happiness looks good on you. Cherish this feeling and let it illuminate your path forward. You deserve this brightness.",
        "You've discovered something precious today. Let this feeling guide your steps. Joy is both a reward and a compass."
    ],
    negative: [
        "Today was heavy, and you carried it with grace. Remember: difficult days pass, but the strength you're building stays. You're stronger than you think.",
        "Your struggles are real, and acknowledging them takes courage. This moment won't define you. Better days are waiting, and you'll reach them.",
        "You're weathering a storm right now. This feeling won't last, but your resilience will. You've weathered storms before—you'll weather this one too.",
        "In this moment of difficulty, know that you're stronger than you think. Rest when you need to. This is temporary. You are not alone.",
        "Stress and exhaustion are signals. Listen to them. You deserve kindness—starting with yourself. Pause. Breathe. You're doing better than you think."
    ],
    neutral: [
        "Your reflections reveal a life in motion. Each moment, even the ordinary ones, shapes who you're becoming. You're exactly where you need to be.",
        "There's wisdom in how you see your day. Trust your instincts about what matters. Your awareness is your superpower.",
        "Today was uniquely yours. Every experience, taken together, is writing your story. You're the author of your narrative.",
        "You're aware, thoughtful, and present. That's where true insight begins. Keep noticing. Keep reflecting. Keep growing.",
        "Keep reflecting. In these quiet moments of self-awareness, you'll find clarity. Your inner voice knows the way forward."
    ]
};

// Sentiment indicators for visual feedback
const SENTIMENT_COLORS = {
    positive: { label: "Grateful", icon: "✨", color: "#10B981" },
    negative: { label: "Resilient", icon: "💪", color: "#F59E0B" },
    neutral: { label: "Reflective", icon: "🌙", color: "#8B7C7C" }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Analyzes text for keyword presence
 * @param {string} text - Text to analyze
 * @param {array} keywords - Keywords to search for
 * @returns {number} - Count of keywords found
 */
function countKeywords(text, keywords) {
    const lowerText = text.toLowerCase();
    return keywords.reduce((count, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "g");
        return count + (lowerText.match(regex) || []).length;
    }, 0);
}

/**
 * Determines sentiment based on keyword analysis
 * @param {string} text1 - First text input
 * @param {string} text2 - Second text input
 * @returns {object} - Sentiment analysis result with type and confidence
 */
function analyzeSentiment(text1, text2) {
    const combinedText = `${text1} ${text2}`;

    const positiveCount = countKeywords(combinedText, SENTIMENT_KEYWORDS.positive);
    const negativeCount = countKeywords(combinedText, SENTIMENT_KEYWORDS.negative);
    const neutralCount = countKeywords(combinedText, SENTIMENT_KEYWORDS.neutral);

    let sentiment = "neutral";
    let confidence = 0;

    if (positiveCount > negativeCount && positiveCount > neutralCount && positiveCount > 0) {
        sentiment = "positive";
        confidence = Math.min(positiveCount / (positiveCount + negativeCount + neutralCount), 1);
    } else if (negativeCount > positiveCount && negativeCount > neutralCount && negativeCount > 0) {
        sentiment = "negative";
        confidence = Math.min(negativeCount / (positiveCount + negativeCount + neutralCount), 1);
    } else {
        sentiment = "neutral";
        confidence = 0.5;
    }

    console.log(`📊 Sentiment Analysis:`, {
        sentiment,
        confidence: (confidence * 100).toFixed(0) + "%",
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount
    });

    return { sentiment, confidence };
}

/**
 * Selects a random insight message from the appropriate template
 * @param {string} sentiment - Sentiment type
 * @returns {string} - Selected insight message
 */
function getInsightMessage(sentiment) {
    const messages = INSIGHT_TEMPLATES[sentiment] || INSIGHT_TEMPLATES.neutral;
    return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Formats timestamp for display
 * @returns {string} - Formatted timestamp
 */
function formatTimestamp() {
    const now = new Date();
    return now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

// ============================================
// CORE FUNCTIONS: Reflection Management
// ============================================

/**
 * Saves user reflection to localStorage
 * @param {string} meaningful - Meaningful moment text
 * @param {string} feeling - Dominant feeling text
 * @param {string} sentiment - Sentiment type
 * @returns {boolean} - Success status
 */
function saveReflection(meaningful, feeling, sentiment = null) {
    try {
        localStorage.setItem(STORAGE_KEY_MEANINGFUL, meaningful);
        localStorage.setItem(STORAGE_KEY_FEELING, feeling);
        localStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());
        if (sentiment) {
            localStorage.setItem("echovault_sentiment", sentiment);
        }
        console.log("✓ Reflection saved to localStorage");
        return true;
    } catch (error) {
        console.error("✗ Error saving to localStorage:", error);
        return false;
    }
}

/**
 * Loads user reflection from localStorage
 * @returns {object|null} - Loaded reflection data or null
 */
function loadReflection() {
    try {
        const meaningful = localStorage.getItem(STORAGE_KEY_MEANINGFUL);
        const feeling = localStorage.getItem(STORAGE_KEY_FEELING);
        const timestamp = localStorage.getItem(STORAGE_KEY_TIMESTAMP);
        const sentiment = localStorage.getItem("echovault_sentiment");

        if (meaningful && feeling) {
            console.log("✓ Reflection loaded from localStorage");
            return { meaningful, feeling, timestamp, sentiment };
        }
        return null;
    } catch (error) {
        console.error("✗ Error loading from localStorage:", error);
        return null;
    }
}

/**
 * Generates insight based on user input
 * @param {string} meaningful - Meaningful moment text
 * @param {string} feeling - Dominant feeling text
 * @returns {object} - Insight data with message and sentiment
 */
function generateInsight(meaningful, feeling) {
    // Analyze sentiment
    const { sentiment, confidence } = analyzeSentiment(meaningful, feeling);

    // Get appropriate insight message
    const message = getInsightMessage(sentiment);

    console.log(`💡 Insight generated with ${(confidence * 100).toFixed(0)}% confidence`);

    return {
        message,
        sentiment,
        confidence,
        timestamp: new Date().toISOString()
    };
}

/**
 * Displays insight card with premium animations
 * @param {object} insightData - Insight data to display
 */
function showInsight(insightData) {
    // Update sentiment badge
    const sentimentData = SENTIMENT_COLORS[insightData.sentiment];
    sentimentIndicator.textContent = sentimentData.icon;
    sentimentIndicator.parentElement.style.setProperty(
        '--badge-color',
        sentimentData.color
    );
    const badgeLabel = insightCard.querySelector('.insight-badge');
    badgeLabel.innerHTML = `<span id="sentiment-indicator">${sentimentData.icon}</span> ${sentimentData.label}`;

    // Update insight text
    insightText.textContent = insightData.message;

    // Update timestamp
    const timestamp = new Date(insightData.timestamp);
    const timeString = timestamp.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    insightTimestamp.textContent = `Generated ${timeString}`;
    insightTimestamp.dateTime = insightData.timestamp;

    // Show card with animation
    insightCard.style.display = "block";

    // Force reflow to trigger animation
    insightCard.offsetHeight;

    // Scroll into view smoothly
    setTimeout(() => {
        insightCard.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }, 100);

    console.log("✓ Insight displayed with animation");
}

/**
 * Clears form fields for new entry
 */
function clearForm() {
    meaningfulMomentInput.value = "";
    dominantFeelingInput.value = "";
    meaningfulMomentInput.focus();
    console.log("Form cleared");
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Form submission handler
 * Validates, saves, generates, and displays insight
 */
reflectionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("📝 Form submitted");

    const meaningful = meaningfulMomentInput.value.trim();
    const feeling = dominantFeelingInput.value.trim();

    // Validation
    if (!meaningful || !feeling) {
        console.warn("⚠ Validation failed: Empty fields");
        alert("Please fill in both fields to generate your insight. Your reflections matter.");
        return;
    }

    if (meaningful.length < 5 || feeling.length < 5) {
        console.warn("⚠ Validation failed: Inputs too short");
        alert("Please provide more detailed responses for deeper insights.");
        return;
    }

    // Add visual feedback: disable button during processing
    generateBtn.disabled = true;
    generateBtn.style.opacity = "0.7";

    // Simulate processing delay for premium feel
    setTimeout(() => {
        // Generate insight
        const insightData = generateInsight(meaningful, feeling);

        // Save to localStorage
        saveReflection(meaningful, feeling, insightData.sentiment);

        // Display insight
        showInsight(insightData);

        // Re-enable button
        generateBtn.disabled = false;
        generateBtn.style.opacity = "1";

        console.log("✓ Reflection processed successfully");
    }, 400); // Subtle delay for polish
});

/**
 * Page load handler
 * Restores previous reflection if available
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("🏛️ EchoVault initialized");

    // Check for saved reflection
    const savedReflection = loadReflection();

    if (savedReflection) {
        // Populate form with saved data
        meaningfulMomentInput.value = savedReflection.meaningful;
        dominantFeelingInput.value = savedReflection.feeling;

        // Regenerate and display insight
        const insightData = generateInsight(
            savedReflection.meaningful,
            savedReflection.feeling
        );

        showInsight(insightData);

        console.log("✓ Previous reflection restored");
    }

    // Add input event listeners for real-time feedback
    addInputFeedback();
});

/**
 * Adds real-time feedback for form inputs
 */
function addInputFeedback() {
    const textareas = [meaningfulMomentInput, dominantFeelingInput];

    textareas.forEach(textarea => {
        // Track character count for UX feedback
        textarea.addEventListener("input", () => {
            const charCount = textarea.value.length;
            if (charCount < 10) {
                textarea.style.borderColor = "#D8D8D8";
            } else if (charCount < 50) {
                textarea.style.borderColor = "#B8D0E8";
            } else {
                textarea.style.borderColor = "#6A8CAF";
            }
        });

        // Handle paste events with grace
        textarea.addEventListener("paste", () => {
            setTimeout(() => {
                textarea.style.borderColor = "#6A8CAF";
            }, 10);
        });
    });
}

// ============================================
// OPTIONAL: Supabase Integration Placeholders
// Uncomment and configure when ready to sync with database
// ============================================

/*
// Initialize Supabase (configure with your credentials)
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign in with Supabase OAuth
async function supabaseSignIn() {
    try {
        const { user, session, error } = await supabase.auth.signIn({
            provider: "google"
        });
        if (error) throw error;
        console.log("✓ Signed in:", user.email);
        syncReflectionsToSupabase();
    } catch (error) {
        console.error("✗ Sign in error:", error);
    }
}

// Save reflection to Supabase database
async function saveReflectionToSupabase(meaningful, feeling, sentiment) {
    try {
        const { data: user } = await supabase.auth.user();
        if (!user) return;

        const { data, error } = await supabase
            .from("reflections")
            .insert({
                user_id: user.id,
                meaningful_moment: meaningful,
                dominant_feeling: feeling,
                sentiment: sentiment,
                created_at: new Date().toISOString()
            });

        if (error) throw error;
        console.log("✓ Reflection synced to Supabase");
    } catch (error) {
        console.error("✗ Error syncing to Supabase:", error);
    }
}

// Load reflections from Supabase
async function loadReflectionsFromSupabase() {
    try {
        const { data: user } = await supabase.auth.user();
        if (!user) return [];

        const { data, error } = await supabase
            .from("reflections")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;
        console.log("✓ Reflections loaded from Supabase:", data);
        return data;
    } catch (error) {
        console.error("✗ Error loading from Supabase:", error);
        return [];
    }
}

// Attach to sign-in button (uncomment in HTML when ready)
// document.getElementById("supabase-login-btn")?.addEventListener("click", supabaseSignIn);
*/

// ============================================
// ACCESSIBILITY & PERFORMANCE
// ============================================

// Announce dynamic content to screen readers
function announceToScreenReaders(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.textContent = message;
    announcement.style.position = "absolute";
    announcement.style.left = "-10000px";
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// ============================================
// CONSOLE BRANDING & DEBUG INFO
// ============================================

console.log(
    "%c🏛️ Welcome to EchoVault %c\n" +
    "Discover your hidden life patterns — no login required\n" +
    "Reflect freely. Discover silently.\n\n" +
    "📊 Features: Sentiment Analysis, localStorage Persistence, Premium Animations",
    "font-size: 18px; font-weight: bold; color: #6A8CAF; text-shadow: 0 2px 4px rgba(0,0,0,0.1);",
    "font-size: 12px; color: #666; line-height: 1.8;"
);

console.log(
    "%cBuilt with ❤️ using HTML, CSS, and vanilla JavaScript\n" +
    "No frameworks. No dependencies. Just pure elegance.",
    "font-size: 11px; color: #999; font-style: italic;"
);
