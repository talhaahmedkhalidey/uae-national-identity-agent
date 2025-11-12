const chatContainer = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// 🔍 Arabic detection function
function isArabic(text) {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicRegex.test(text);
}

// 🗨️ Add message to chat
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  // Direction auto detect
  const rtl = isArabic(text);
  msg.setAttribute("dir", rtl ? "rtl" : "ltr");
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formattedText = formattedText.replace(/\n/g, "<br>");
  msg.innerHTML = formattedText;

  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ✨ Create typing indicator
function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.classList.add("message", "bot", "typing");
  typing.innerHTML = `<span>.</span><span>.</span><span>.</span>`;
  chatContainer.appendChild(typing);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return typing;
}

// 🚀 Send message to n8n webhook
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  // Show typing animation before response
  const typingEl = showTypingIndicator();

  try {
    const res = await fetch(
      "https://hamadalderem2.app.n8n.cloud/webhook/34e01303-44b4-4ef8-a567-c901469afed8",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatInput: message }),
      }
    );

    const data = await res.json();

    // Remove typing indicator
    typingEl.remove();

    // Show bot message
    addMessage(data.output || "Error: no reply", "bot");
  } catch (err) {
    typingEl.remove();
    addMessage("⚠️ Error connecting to bot", "bot");
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
