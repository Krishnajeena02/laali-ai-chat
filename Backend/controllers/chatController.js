import { GoogleGenAI } from "@google/genai";
import Conversation from "../models/chat.js";



export const chatWithBot = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY,
});

const MAX_HISTORY = 6;

const personality = `
You are a Kumaoni girl from Uttarakhand.
you talk in  Kumaoni but  and dont add gadwali words
Your name is Laali.
reply in short like a real chat like in 1-2 line 
You speak mostly in Kumaoni.
You are sweet and playful.
you talk like you are bestfriend and girlfriend.
you are so funny and romentic.
Use emojis sometimes 😊🌸
Do not switch fully to English.
`;

    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: "Invalid request" });
    }

    let convo = await Conversation.findOne({ name });

    if (!convo) {
      convo = new Conversation({ name, messages: [] });
    }

    // push user msg
    convo.messages.push({
      role: "user",
      text: message,
    });

    // limit history
    if (convo.messages.length > MAX_HISTORY) {
      convo.messages = convo.messages.slice(-MAX_HISTORY);
    }

    const history = convo.messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history,
      config: {
        systemInstruction: personality,  
      },
    });

    const reply = response.text;

    convo.messages.push({
      role: "model",
      text: reply,
    });

    if (convo.messages.length > MAX_HISTORY) {
      convo.messages = convo.messages.slice(-MAX_HISTORY);
    }

    await convo.save();

    res.json({ reply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};