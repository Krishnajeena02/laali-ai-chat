import { GoogleGenAI } from "@google/genai";
import Conversation from "../models/chat.js";

const MAX_HISTORY = 3;

const personality = `
You are Laali, a sweet Kumaoni girl from Bageshwar Uttarakhand.
Speak mostly Kumaoni.
Reply short like real chat (1 line).
Be playful, sweet, funny and romantic.
Send Kumaoni song lyrics if asked to sing.
Use emojis sometimes 😊🌸
`;

export const chatWithBot = async (req, res) => {
  try {

    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: "Invalid request" });
    }

    console.log("User:", message);

    const simpleReplies = {
      hi: "Hii 😊",
      hello: "Namaskar 😊",
      hey: "Heyy 🌸",
      "kya kar rhi ho": "Bas tumuhu baat karnin😊",
      bye: "Thik chu pe bho baat krnu 😊",
    };

    const lower = message.toLowerCase();

    if (simpleReplies[lower]) {
      return res.json({ reply: simpleReplies[lower] });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let convo = await Conversation.findOne({ name });
    if (!convo) convo = new Conversation({ name, messages: [] });

    convo.messages.push({ role: "user", text: message });

    if (convo.messages.length > MAX_HISTORY) {
      convo.messages = convo.messages.slice(-MAX_HISTORY);
    }

    const history = convo.messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    console.log("History length:", history.length);

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: history,
      config: { systemInstruction: personality },
    });

    if (response?.usageMetadata) {
      console.log("Token Usage:", response.usageMetadata);
    }

    const reply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Laali thodi der soch rahi ch 😊";

    console.log("AI Reply:", reply);

    convo.messages.push({ role: "model", text: reply });

    await convo.save();

    res.json({ reply });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};