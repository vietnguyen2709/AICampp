const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const API_KEY = "AIzaSyCRc1f6L3NwUHglxK7JIh78cz-X0aHVWo0";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Store full conversation context
const conversationHistory = [];

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  const formatted = marked.parse(text);
  div.innerHTML = `<span class="${sender === "user" ? "user" : "ai"}">${
    sender === "user" ? "You" : "🤖 AI"
  }:</span><br>${formatted}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage("user", input);
  userInput.value = "";

  conversationHistory.push({ role: "user", text: input });

  try {
    const contents = conversationHistory.map((msg) => ({
      parts: [{ text: msg.text }],
      role: msg.role,
    }));
    // Send API request
    // code here
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents}),
    });

    const data = await res.json();


    const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (aiReply) {
      // Add AI reply to conversation history and display it
      conversationHistory.push({ role:"model", text: aiReply});
      appendMessage("ai", aiReply);
    } else {
      // Display error if there are AI errors
      appendMessage("ai", "I'm sorry I can't understand the question")
    }
  } catch (err) {
    // Display error if there are user errors
    appendMessage("ai","There is an error");
  }
}

// Handle user input
sendBtn.onlick = sendMessage;
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage(); 
});