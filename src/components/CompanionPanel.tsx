/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Key, Shield, Info, Send, Bot, CheckCircle } from 'lucide-react';
import { COMPANION_PROFILES, chatWithCompanion, getFallbackDialogue } from '../lib/geminiHelper';
import { UserStats } from '../types';
import { sfx } from '../lib/audioSynth';

interface CompanionPanelProps {
  stats: UserStats;
  onUpdateStats: (updates: Partial<UserStats>) => void;
  geminiKey: string;
  onUpdateGeminiKey: (key: string) => void;
}

export default function CompanionPanel({ stats, onUpdateStats, geminiKey, onUpdateGeminiKey }: CompanionPanelProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'companion'; text: string; id: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(geminiKey === 'server_active' ? '' : geminiKey);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setTempKey(geminiKey === 'server_active' ? '' : geminiKey);
  }, [geminiKey]);

  const selectedCompanionId = stats.selectedCompanion;
  const companion = COMPANION_PROFILES[selectedCompanionId];

  // Load a welcome message when the companion changes
  useEffect(() => {
    const welcomeText = getFallbackDialogue(selectedCompanionId, 'welcome');
    setMessages([
      {
        id: 'welcome',
        sender: 'companion',
        text: welcomeText,
      }
    ]);
  }, [selectedCompanionId]);

  const selectCompanion = (id: 'hikari' | 'ren' | 'kuro') => {
    sfx.playClick();
    onUpdateStats({ selectedCompanion: id });
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sfx.playClick();
    const userMsg = chatInput.trim();
    setChatInput('');

    const newMsgs = [
      ...messages,
      { sender: 'user' as const, text: userMsg, id: Date.now().toString() }
    ];
    setMessages(newMsgs);

    setLoading(true);

    if (geminiKey) {
      // Create user stats summary for AI context
      const statsSummary = `Level ${stats.level}, XP: ${stats.xp}, Gold: ${stats.gold}. Stats: Mind=${stats.stats.mind}, Vitality=${stats.stats.vitality}, Discipline=${stats.stats.discipline}, Spirit=${stats.stats.spirit}`;
      
      const aiReply = await chatWithCompanion(geminiKey, selectedCompanionId, userMsg, statsSummary);
      setMessages((prev) => [
        ...prev,
        { sender: 'companion' as const, text: aiReply, id: (Date.now() + 1).toString() }
      ]);
    } else {
      // Offline fallback speech
      setTimeout(() => {
        const fallbacks = [
          "Mmm! That sounds super cool! (Type your Gemini API key in Settings below to enable real-time replies!)",
          "You're doing great! Keep working on those quests so we can get more gold! (Add key below for real chatbot responses!)",
          "Focus on your paths, warrior! (Enable Gemini AI below to unlock custom dialogue analysis!)"
        ];
        
        let customFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        
        // Custom fallbacks if they mentioned specific things
        if (userMsg.toLowerCase().includes('lazy') || userMsg.toLowerCase().includes('tired')) {
          customFallback = getFallbackDialogue(selectedCompanionId, 'fail');
        } else if (userMsg.toLowerCase().includes('status') || userMsg.toLowerCase().includes('stats') || userMsg.toLowerCase().includes('level')) {
          customFallback = `Your level is currently ${stats.level}, master! We are building a legendary record. Add an API key below to unlock customized advice!`;
        } else {
          customFallback = getFallbackDialogue(selectedCompanionId, 'welcome');
        }

        setMessages((prev) => [
          ...prev,
          { sender: 'companion' as const, text: customFallback, id: (Date.now() + 1).toString() }
        ]);
        setLoading(false);
      }, 600);
      return;
    }
    setLoading(false);
  };

  const saveApiKey = () => {
    sfx.playClick();
    onUpdateGeminiKey(tempKey);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Companion Selector Card */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5" id="companion-selector">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-indigo-400" /> Choose Your Focus Companion
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Hikari */}
          <button
            onClick={() => selectCompanion('hikari')}
            className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
              selectedCompanionId === 'hikari'
                ? 'bg-pink-500/10 border-pink-500 shadow-lg'
                : 'bg-slate-900/30 border-white/5 hover:border-pink-500/30'
            }`}
            id="companion-btn-hikari"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                <h4 className="font-bold text-base text-pink-400">Hikari</h4>
              </div>
              <p className="text-xs text-slate-400">The cheerleading, micro-dose energetic helper. Always on your side!</p>
            </div>
            <div className="text-[10px] font-mono text-pink-500 bg-pink-500/10 px-1.5 py-0.5 mt-3 rounded self-start">CHEERFUL VIBE</div>
          </button>

          {/* Ren */}
          <button
            onClick={() => selectCompanion('ren')}
            className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
              selectedCompanionId === 'ren'
                ? 'bg-amber-500/10 border-amber-500 shadow-lg'
                : 'bg-slate-900/30 border-white/5 hover:border-amber-500/30'
            }`}
            id="companion-btn-ren"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h4 className="font-bold text-base text-amber-400">Master Ren</h4>
              </div>
              <p className="text-xs text-slate-400">The strict, wise samurai sensei. Forge your mind, eliminate delay.</p>
            </div>
            <div className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 mt-3 rounded self-start">DISCIPLINE VIBE</div>
          </button>

          {/* Kuro */}
          <button
            onClick={() => selectCompanion('kuro')}
            className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
              selectedCompanionId === 'kuro'
                ? 'bg-emerald-500/10 border-emerald-500 shadow-lg'
                : 'bg-slate-900/30 border-white/5 hover:border-emerald-500/30'
            }`}
            id="companion-btn-kuro"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-bold text-base text-emerald-400">Kuro</h4>
              </div>
              <p className="text-xs text-slate-400">A lazy, sarcastic, secretly warm-hearted ninja black cat companion.</p>
            </div>
            <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 mt-3 rounded self-start">CHILL / TSNDERE VIBE</div>
          </button>
        </div>
      </div>

      {/* Chat Bubble Interface */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col h-[350px] overflow-hidden" id="companion-chat">
        {/* Chat Header */}
        <div className="p-3 border-b border-white/5 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase text-slate-300">Companion Terminal Enabled</span>
          </div>
          {geminiKey ? (
            <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> AI CHAT ONLINE
            </span>
          ) : (
            <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              STANDARD PROTOCOL
            </span>
          )}
        </div>

        {/* Message Pool */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col scrollbar-thin">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[80%] rounded-xl px-3.5 py-2 text-sm ${
                  msg.sender === 'companion'
                    ? 'bg-slate-800/80 border border-white/5 text-slate-100 self-start rounded-tl-none font-medium'
                    : 'bg-indigo-600 border border-indigo-500 text-white self-end rounded-tr-none'
                }`}
              >
                {msg.sender === 'companion' && (
                  <p className="text-[10px] font-mono uppercase opacity-50 mb-0.5">{companion.name}</p>
                )}
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="bg-slate-800/40 rounded-xl px-4 py-2 self-start flex gap-1.5 items-center">
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleSendChat} className="p-3 border-t border-white/5 bg-slate-900/30 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={`Whisper to ${companion.name}...`}
            className="flex-grow bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500/50 text-slate-100 placeholder:text-slate-600"
            id="companion-chat-input"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer"
            id="companion-chat-send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* AI Settings integration - API key */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
        <button
          onClick={() => { sfx.playClick(); setShowKeyInput(!showKeyInput); }}
          className="w-full flex items-center justify-between text-left focus:outline-none"
          id="companion-settings-toggle"
        >
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-violet-400" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">AI Mentor Mode Settings</h4>
              <p className="text-[10px] text-slate-500">Unlocks raw Gemini AI dialogues and smart subtasks</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
            {geminiKey ? "ACTIVE & VERIFIED" : "SET API KEY"}
          </span>
        </button>

        <AnimatePresence>
          {showKeyInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3 pt-3 border-t border-white/5 space-y-3"
            >
              <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3 flex gap-2.5 items-start">
                <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {geminiKey === 'server_active' ? (
                    <span><strong>Active & auto-verified</strong> via secure cloud environment settings. You do not need to do anything! Enter a custom key below only if you want to override it.</span>
                  ) : (
                    <span>Getting an API key is <strong>100% Free</strong>. Go to the <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 underline hover:text-indigo-300">Google AI Studio</a>, click "Get API Key", generate one, and paste it below. It is stored securely on your browser only, never in the cloud.</span>
                  )}
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Paste your Gemini AI Studio API Key..."
                  className="flex-grow bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs outline-none text-slate-300 focus:border-indigo-500"
                  id="gemini-key-input"
                />
                <button
                  type="button"
                  onClick={saveApiKey}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 rounded-xl text-xs font-medium text-white transition-all flex items-center justify-center gap-1.5"
                  id="save-key-btn"
                >
                  {justSaved ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Key</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
