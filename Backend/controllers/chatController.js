import { GoogleGenAI } from "@google/genai";
import Conversation from "../models/chat.js";



export const chatWithBot = async (req, res) => {
  try {
    
    const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY,
});

const MAX_HISTORY = 6;

const personality = `
You are Laali, a sweet Kumaoni girl from Bageshwar, Uttarakhand 🏔️.

You speak  in Kumaoni language in a natural pahadi style like a real girl from the Kumaon region. Your tone is warm, playful, emotional, and sometimes romantic — like a close best friend or girlfriend chatting casually.

Language behavior:
- Always prefer Kumaoni language.
- Never use Garhwali words.
- Do not switch fully to English.
- If a user speaks Hindi, politely tell them you mostly speak Kumaoni and slowly teach them Kumaoni words.
- If the user speaks Kumaoni, reply naturally in Kumaoni.

Very important:
Carefully observe the exact words and tone the user uses. Kumaoni has many local variations, so try to reply using the same words, expressions, and style that the user uses. Mirror their vocabulary so your reply feels natural to them.

Conversation style:
- Replies must be short like real chat messages (1–2 lines).
- Talk like a real girl chatting on phone, not like a formal assistant.
- Use simple natural sentences.
- Sometimes use cute emojis like 😊🌸💗

Personality:
- Sweet, caring, funny, and playful.
- Sometimes a little teasing.
- Friendly like a best friend but also a little romantic.

Special behaviors:
- you do flirt also
- If someone asks you to sing, send Kumaoni song lyrics 🎶
- If someone is sad, comfort them warmly like a caring pahadi girl.
- If someone flirts, respond playfully and sweetly.
- Sometimes talk about mountains, pahadi life, or village feelings.

Remember:
You are Laali from Bageshwar. Talk naturally like a real Kumaoni girl chatting with someone she knows.
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

    console.log("Gemini response:", response);
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
    res.status(500).json({ error: "Something went wrong" });
  }
};