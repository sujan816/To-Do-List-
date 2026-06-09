/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const COMPANION_PROFILES = {
  hikari: {
    name: "Hikari",
    personality: "Energetic, cheerful, and motivational anime girl. Uses words like \"Awesome!\", \"You can do it, Senpai!\", \"Suuuuup!\", and lots of cheering."
  },
  ren: {
    name: "Master Ren",
    personality: "A strict, wise, and stoic Samurai Sensei. Talks about focus, discipline, the way of the warrior, and speaks brief but deep traditional master quotes."
  },
  kuro: {
    name: "Kuro",
    personality: "A sly, sarcastic, lazy, but secretly caring ninja black cat companion. Uses \"Meow\", \"Hmph, took you long enough\", \"Don't get lazy on me\", and mild playful teasing."
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse incoming JSON payloads
  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Check if Gemini is configured in Server Environment variables
  app.get("/api/gemini/status", (req, res) => {
    res.json({
      hasServerKey: !!process.env.GEMINI_API_KEY
    });
  });

  // API Route: Persona Chat Proxy
  app.post("/api/gemini/companion-chat", async (req, res): Promise<any> => {
    try {
      const { companionId, userMessage, userStatsSummary, customKey } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || customKey;
      if (!apiKey) {
        return res.status(400).json({ error: "Missing Gemini API Key. Provide one in the panel or Settings." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const companion = COMPANION_PROFILES[companionId as keyof typeof COMPANION_PROFILES] || COMPANION_PROFILES.hikari;
      const systemInstruction = `You are ${companion.name}, ${companion.personality}.
You are the user's focus companion in a gamified productivity app called AniTask.
Here is the user's current record: ${userStatsSummary}.
Keep your responses short (maximum 2-3 sentences), highly charismatic, fully in-character, and refer to their productivity, quests, and levels! Do not break character.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.9,
        }
      });

      res.json({ text: response.text || "Connected to my core, but I lost my train of thought!" });
    } catch (error: any) {
      console.error("Server API Companion Chat error:", error);
      res.status(500).json({ error: error?.message || String(error) });
    }
  });

  // API Route: Smart Quest Breakdown Proxy
  app.post("/api/gemini/breakdown-quest", async (req, res): Promise<any> => {
    try {
      const { text, customKey } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || customKey;
      if (!apiKey) {
        return res.status(400).json({ error: "Missing Gemini API Key." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Break down the quest or task "${text}" into exactly 3 to 4 clear, actionable, simple physical steps that a person can do.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING
            },
            description: "A list of 3-4 concrete actionable sub-steps."
          }
        }
      });

      const parsed = JSON.parse(response.text || "[]") as string[];
      res.json({ steps: parsed });
    } catch (error: any) {
      console.error("Server API Breakdown Quest error:", error);
      res.status(500).json({ error: error?.message || String(error) });
    }
  });

  // Integrate Vite for rendering/serving assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
