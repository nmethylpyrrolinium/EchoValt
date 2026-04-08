/* =========================================================
   EchoVault — ui.js
   UI helper functions (chat bubbles, typing fx)
========================================================= */

// Create chat bubble element
function createChatBubble(message, isUser = false) {
    const bubble = document.createElement("div");
    bubble.className = "ev-chat-msg " + (isUser ? "msg-user" : "msg-ai");
    bubble.textContent = message;
    return bubble;
}

// Append bubble with animation
function appendChatBubble(bubble) {
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Show "typing…" indicator
function createTypingIndicator() {
    const bubble = document.createElement("div");
    bubble.className = "ev-chat-msg msg-ai";
    bubble.textContent = "typing...";
    return bubble;
}

function replaceTypingWithMessage(typingEl, message) {
    typingEl.textContent = message;
}
