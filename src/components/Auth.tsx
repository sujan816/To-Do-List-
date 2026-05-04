/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { LogIn, Sparkles, LayoutList } from 'lucide-react';
import { signIn } from '../lib/firebase';

export default function Auth() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 text-center"
      >
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl glow-primary transform -rotate-6">
            <LayoutList className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">
          AniTask
        </h1>
        <p className="text-slate-400 mb-12 text-lg font-mono uppercase tracking-[0.2em]">
          Efficiency Protocol: Initialize
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={signIn}
          className="w-full flex items-center justify-center gap-4 bg-white text-slate-900 font-bold py-4 px-8 rounded-2xl shadow-2xl transition-all hover:bg-slate-100 group"
          id="google-login-btn"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          Sign in with Google
          <LogIn className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </motion.button>

        <div className="mt-12 flex items-center justify-center gap-2 text-slate-600">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] uppercase font-mono tracking-widest">Minimal. Aesthetic. Productive.</span>
        </div>
      </motion.div>
    </div>
  );
}
