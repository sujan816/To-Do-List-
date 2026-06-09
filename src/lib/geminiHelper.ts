/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

export const COMPANION_PROFILES = {
  hikari: {
    name: 'Hikari',
    personality: 'Energetic, cheerful, and motivational anime girl. Uses words like "Awesome!", "You can do it, Senpai!", "Suuuuup!", and lots of cheering.'
  },
  ren: {
    name: 'Master Ren',
    personality: 'A strict, wise, and stoic Samurai Sensei. Talks about focus, discipline, the way of the warrior, and speaks brief but deep traditional master quotes.'
  },
  kuro: {
    name: 'Kuro',
    personality: 'A sly, sarcastic, lazy, but secretly caring ninja black cat companion. Uses "Meow", "Hmph, took you long enough", "Don\'t get lazy on me", and mild playful teasing.'
  }
};

/**
 * Chat with the companion in character.
 */
export async function chatWithCompanion(
  apiKey: string, 
  companionId: 'hikari' | 'ren' | 'kuro', 
  userMessage: string,
  userStatsSummary: string
) {
  try {
    const response = await fetch("/api/gemini/companion-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companionId,
        userMessage,
        userStatsSummary,
        customKey: apiKey || undefined,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.text || "Connected to my core, but I lost my train of thought! Try again, master.";
  } catch (e: any) {
    console.error("Gemini companion error:", e);
    return `Error from Guild Terminal: ${e?.message || e}`;
  }
}

/**
 * Break down a task into 3-4 subtasks automatically.
 */
export async function breakdownQuest(apiKey: string, text: string) {
  try {
    const response = await fetch("/api/gemini/breakdown-quest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        customKey: apiKey || undefined,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.steps && data.steps.length > 0 
      ? data.steps 
      : ["Start first phase", "Perform core work", "Review quality and polish"];
  } catch (e) {
    console.warn("Subtask breakdown failed", e);
    return ["Understand the goal", "Eliminate distractions and focus", "Execute of the primary phase", "Finalize and test proof"];
  }
}

/**
 * Get a random quick daily dialogue from the companion (fallback if key is not active).
 */
export function getFallbackDialogue(companionId: 'hikari' | 'ren' | 'kuro', action: 'welcome' | 'complete' | 'fail' | 'levelUp' | 'timerStart') {
  const dialogs = {
    hikari: {
      welcome: [
        "Welcome back, Senpai! Ready to slay some quests today?! Let's goooo!",
        "Yahoo! You are looking super cool today! Let's level up together!",
        "Senpai! I've been waiting for you! Let's get our stats built up today!"
      ],
      complete: [
        "KA-BOOM! That is what I call absolute perfection! You earned some gold!",
        "Yay! Quest cleared! Show them what you are made of, Senpai!",
        "Amazing work! I knew you had it in you! Onto the next one!"
      ],
      fail: [
        "Aww, don't worry Senpai! Everyone slips up. Let's try or reclaim the quest!",
        "Don't lose your smile! Tomorrow is a brand new day to conquer!",
        "Ugh, that one was tough. But we are tougher, right? Let's rally!"
      ],
      levelUp: [
        "OMG LEVEL UP!!! YOU ARE A BEAST, SENPAI! I'm so proud of you!",
        "Whoaaaa! Do you feel that power surge?! You are getting super strong!",
        "Yaaas! New heights unlocked! What stats are we boosting next?!"
      ],
      timerStart: [
        "Focus protocol activated! Put on your absolute best study tunes, Senpai!",
        "Time for some deep concentration! Don't look at social media, I'm watching you! Hehe.",
        "Let's enter the zone! 25 minutes of full-power focus, start!"
      ]
    },
    ren: {
      welcome: [
        "Greetings, warrior. Let your discipline be your weapon today.",
        "The mind must be forged like iron. What is our duty today?",
        "Do not seek an easy path. Seek the discipline to conquer a hard path."
      ],
      complete: [
        "An honorable victory. The path of focus rewards the diligent.",
        "Well executed. Another step closer to mastery.",
        "Duty complete. Maintain your composure, there are still valleys to cross."
      ],
      fail: [
        "A defeat is merely a lesson. Reforge your resolve and stand again.",
        "Discipline is a continuous climb. Forgive the fall, but resume the climb.",
        "Do not despair. A broken sword can be reforged in fire."
      ],
      levelUp: [
        "Mastery is a lifelong mountain. Today, your footing is elevated.",
        "Your armor is hardened. Your blade is sharper. You have ascended, young warrior.",
        "A significant breakthrough. But do not let pride cloud your vision. Keep training."
      ],
      timerStart: [
        "Enter the dojo. Let the outside noise fade into nothingness.",
        "Sit upright, clear your breath, and dedicate this session to pure execution.",
        "The clock is your anvil. Let's forge."
      ]
    },
    kuro: {
      welcome: [
        "Oh, you finally showed up. I guess we can do some work... if I must.",
        "Hmph. Don\'t slack off today, okay? Lazy people don\'t buy me luxury catnip.",
        "Meow. You look like you need some discipline. Let\'s get this over with."
      ],
      complete: [
        "Mmm. Not bad at all. Now give me my share of the gold!",
        "Fine, fine, you actually did it. I suppose I can compliment you... once.",
        "Target down. See? It\'s easy when you don\'t lay around like a sleeping cat."
      ],
      fail: [
        "Really? You missed that quest? Even my clumsy toy mouse could do better.",
        "Unbelievable. Well, pet me and we can forget this ever happened.",
        "Sigh. I guess I have to motivate you again. Stand up and do better!"
      ],
      levelUp: [
        "Level up, huh? Don\'t let it go to your head, you are still a novice to me! *yawns*",
        "Whoa, look at you! You\'re actually becoming a respectable master. Respect.",
        "More power, more gold. Perfect. Now, where is my special royal feast?"
      ],
      timerStart: [
        "Fine. I\'ll take a nap while you do the hard work. No slacking!",
        "Focus mode? Good, don\'t speak to me until the bell ring-meows.",
        "Starting the clock. I expect total silent mastery."
      ]
    }
  };

  const pool = dialogs[companionId]?.[action] || dialogs.hikari[action];
  return pool[Math.floor(Math.random() * pool.length)];
}
