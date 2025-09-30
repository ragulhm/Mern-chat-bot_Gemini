import React, { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 I'm Gemini Chatbot. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, { role: "bot", text: data.message }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "⚠️ No reply received." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "bot", text: "❌ Error contacting server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 500,
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "660px",
      display: "flex",
      flexDirection: "column",
      height: "80vh",
      textAlign:"center"
    }}>
      <h2 style={{ textAlign: "center" }}>💬 Gemini Chatbot</h2>

      <div style={{
        flex: 1,
        overflowY: "auto",
        marginBottom: "1rem",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fafafa"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            marginBottom: "0.8rem",
            textAlign: m.role === "user" ? "right" : "left"
          }}>
            <span style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: "12px",
              background: m.role === "user" ? "#4f93ff" : "#e5e5e5",
              color: m.role === "user" ? "#fff" : "#333",
              maxWidth: "80%",
              wordBreak: "break-word"
            }}>
              {m.text}
            </span>
          </div>
        ))}
        {loading && <p>🤖 Typing...</p>}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px" }}>
        <input
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#4f93ff",
            color: "#fff",
            cursor: "pointer"
          }}
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}
