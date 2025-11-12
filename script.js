const chatContainer = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// 🔍 Arabic detection function
// function isArabic(text) {
//   const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
//   return arabicRegex.test(text);
// }

// 🗨️ Add message to chat
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  // Direction auto detect
  // const rtl = isArabic(text);
  // msg.setAttribute("dir", rtl ? "rtl" : "ltr");
  msg.textContent = text;

  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 🚀 Send message to n8n webhook
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  // Send to n8n webhook
  const res = await fetch(
    "https://hamadalderem2.app.n8n.cloud/webhook/34e01303-44b4-4ef8-a567-c901469afed8",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatInput: message }),
    }
  );

  const data = await res.json();
  addMessage(data.output || "Error: no reply", "bot");
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
