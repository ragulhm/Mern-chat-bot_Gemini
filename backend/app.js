import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Conversation history
let conversationHistory = [
  { role: "model", parts: [{ text: "You are a helpful assistant." }] },
];

app.get("/", (req, res) => {
  res.send("✅ Gemini Chatbot backend is running!");
});

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationHistory,
    });

    const botReply = response.text;

    conversationHistory.push({ role: "model", parts: [{ text: botReply }] });

    res.json({ message: botReply });
  } catch (error) {
    console.error("Error calling Gemini:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.toString(),
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
