/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";

interface ThemeBackgroundProps {
  themeId: string;
}

export default function ThemeBackground({ themeId }: ThemeBackgroundProps) {
  // Generate random values on load so they persist and don't re-render/flicker
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      left: `${(i * 7 + 13) % 100}%`,
      delay: `${(i * 1.7) % 12}s`,
      duration: `${10 + (i % 3) * 5}s`,
      size: `${6 + (i * 3) % 14}px`,
      opacity: 0.1 + (i % 5) * 0.12,
    }));
  }, []);

  switch (themeId) {
    case "sakura":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Soft ambient violet-to-pink gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-pink-950/15 via-transparent to-rose-950/20" />
          
          {/* Floating animated Sakura petals */}
          {particles.map((p, idx) => (
            <svg
              key={`sakura-petal-${idx}`}
              className="absolute text-pink-400/30 fill-current animate-fall-down-medium"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: p.size,
                height: p.size,
                top: "-5%",
              }}
              viewBox="0 0 24 24"
            >
              <path d="M12,2C12,2 6.5,7.5 6.5,11.5C6.5,15.5 12,21.5 12,21.5C12,21.5 17.5,15.5 17.5,11.5C17.5,7.5 12,2 12,2M12,4.8C14.2,7.3 15.7,10 15.7,11.5C15.7,13.6 14.1,15 12,15C9.9,15 8.3,13.6 8.3,11.5C8.3,10 9.8,7.3 12,4.8Z" />
            </svg>
          ))}
        </div>
      );

    case "tokyo":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Neon digital laser grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          {/* Glowing cyberpunk scanner beam */}
          <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-500/45 to-transparent shadow-[0_0_12px_#06b6d4] animate-scanline" />
          
          {/* Holographic light dots */}
          {particles.slice(0, 8).map((p, idx) => (
            <div
              key={`holo-dot-${idx}`}
              className="absolute rounded-full bg-cyan-400/20 shadow-[0_0_8px_#22d3ee] animate-drift-slow"
              style={{
                left: p.left,
                top: `${(idx * 12 + 15) % 90}%`,
                width: "4px",
                height: "4px",
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      );

    case "dungeon":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Deep abyssal fog */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-black to-black" />
          
          {/* Demonic embers rising */}
          {particles.map((p, idx) => (
            <div
              key={`ember-${idx}`}
              className="absolute rounded-full bg-gradient-to-t from-red-500 to-amber-500/80 shadow-[0_0_10px_rgba(220,38,38,0.7)] animate-float-up-medium"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: `${parseInt(p.size) / 2}px`,
                height: `${parseInt(p.size) / 2}px`,
                bottom: "-5%",
              }}
            />
          ))}
        </div>
      );

    case "retro":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Arcade synthwave landscape representation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,63,94,0.03)_1px,transparent_1px)] bg-[size:40px_20px]" />
          
          {/* Retro scanlines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />

          {/* Warm neon floating pixels */}
          {particles.slice(0, 10).map((p, idx) => (
            <div
              key={`retro-pixel-${idx}`}
              className="absolute rounded-none border border-amber-500/20 bg-amber-500/10 animate-float-up-slow"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: "8px",
                height: "8px",
                bottom: "-5%",
              }}
            />
          ))}
        </div>
      );

    case "onepiece":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Grand ocean nautical glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020914] via-[#05152c] to-[#01060f]" />
          
          {/* Spinning Navigation Compass Rose watermark */}
          <div className="absolute right-[-10%] bottom-[-10%] w-[380px] h-[380px] opacity-[0.03] text-amber-400">
            <svg
              className="w-full h-full animate-[spin_180s_linear_infinite]"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
              <path d="M50 5 L53 45 L93 47 L53 53 L50 93 L47 53 L7 47 L47 45 Z" />
              <path d="M50 15 L51.5 45 L81.5 47 L51.5 51.5 L50 81.5 L48.5 51.5 L18.5 47 L48.5 45 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Glowing sea sparkles / pirate gold bubbles */}
          {particles.map((p, idx) => (
            <div
              key={`sea-sparkle-${idx}`}
              className="absolute rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300/60 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-float-up-slow"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: `${parseInt(p.size) / 2.5}px`,
                height: `${parseInt(p.size) / 2.5}px`,
                bottom: "-5%",
              }}
            />
          ))}
        </div>
      );

    case "naruto":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Will of Fire orange smoke glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-950/15 via-[#0d0703] to-slate-950" />
          
          {/* Animated Chakra swirling lines or Uzumaki spirals */}
          <div className="absolute left-[5%] top-[15%] w-[180px] h-[180px] opacity-[0.02] text-orange-500">
            <svg className="w-full h-full animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50,50 C30,30 20,40 20,50 C20,70 40,80 50,80 C70,80 80,60 80,50 C80,30 60,20 50,20 C35,20 30,35 40,40" />
            </svg>
          </div>

          {/* Konoha leaf sparks rising */}
          {particles.map((p, idx) => (
            <svg
              key={`leaf-spark-${idx}`}
              className="absolute text-orange-500/25 fill-current animate-float-up-medium"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: `${parseInt(p.size) * 1.1}px`,
                height: `${parseInt(p.size) * 1.1}px`,
                bottom: "-5%",
              }}
              viewBox="0 0 24 24"
            >
              {/* Leaf-like fiery path representation */}
              <path d="M17,8C15,6 12,6 10,7C8,8 7,10 8,12C9,14 11,14 13,13C15,12 16,10 17,8M2,22C2,22 10,18 15,18C20,18 22,12 22,10C22,8 20,4 17,2C15,1 12,2 9,4C6,6 4,10 4,14C4,17 2,22 2,22Z" />
            </svg>
          ))}
        </div>
      );

    case "deathnote":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Gothic monochromatic layout */}
          <div className="absolute inset-0 bg-neutral-950" />
          
          {/* Bleak vertical rain scanline patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_100%]" />
          
          {/* Floating red apple outlines or dark shinigami feathers */}
          {particles.map((p, idx) => (
            <svg
              key={`feather-${idx}`}
              className={`absolute fill-current animate-fall-down-medium ${
                idx % 4 === 0 ? "text-rose-600/30" : "text-neutral-500/20"
              }`}
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: p.size,
                height: p.size,
                top: "-5%",
              }}
              viewBox="0 0 24 24"
            >
              {idx % 4 === 0 ? (
                // Apple outline for Death Note
                <path d="M12,2C11.5,2 10.3,2.5 10,3.5C8,3.5 6,5 5,7C4,9 4,12 6,15C7.5,17.2 9.5,19 12,19C14.5,19 16.5,17.2 18,15C20,12 20,9 19,7C18,5 16,3.5 14,3.5C13.7,2.5 12.5,2 12,2M12,1C12,1 13.5,1 14.5,2.5C14.5,2.5 18,3 19.5,5.5C21,8 21,12 19,15.5C17,19 14.5,20.5 12,20.5C9.5,20.5 7,19 5,15.5C3,12 3,8 4.5,5.5C6,3 9.5,2.5 9.5,2.5C10.5,1 12,1 12,1Z" />
              ) : (
                // Gothic feather
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C14.5,4 16,5.5 16,7.5C16,9.5 13.5,13.5 12,17C10.5,13.5 8,9.5 8,7.5C8,5.5 9.5,4 12,4Z" />
              )}
            </svg>
          ))}
        </div>
      );

    case "breakingbad":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Radioactive hazmat green/blue glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#03130a] via-[#091f13] to-black" />
          
          {/* Periodic Elements Watermark symbols */}
          <div className="absolute left-[8%] bottom-[12%] py-2 px-3 border-2 border-lime-500/20 bg-lime-950/10 text-lime-400/15 font-mono font-bold text-center rounded-sm">
            <div className="text-[10px] leading-none text-left">35</div>
            <div className="text-3xl leading-none font-bold">Br</div>
            <div className="text-[8px] mt-1 uppercase tracking-wide">Bromine</div>
          </div>

          <div className="absolute right-[12%] top-[14%] py-2 px-3 border-2 border-cyan-500/20 bg-cyan-950/10 text-cyan-400/15 font-mono font-bold text-center rounded-sm">
            <div className="text-[10px] leading-none text-left">56</div>
            <div className="text-3xl leading-none font-bold">Ba</div>
            <div className="text-[8px] mt-1 uppercase tracking-wide font-sans">Barium</div>
          </div>

          {/* Sizzling beaker gas bubbles rising */}
          {particles.map((p, idx) => (
            <div
              key={`chemical-bubble-${idx}`}
              className={`absolute rounded-full border opacity-40 animate-float-up-slow ${
                idx % 2 === 0 
                  ? "bg-lime-500/10 border-lime-400/40 shadow-[0_0_8px_rgba(132,204,22,0.3)]" 
                  : "bg-cyan-500/10 border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
              }`}
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: p.size,
                height: p.size,
                bottom: "-5%",
              }}
            />
          ))}
        </div>
      );

    case "got":
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {/* Westeros Ice & Fire storm layout */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#02050b] via-[#0a0f18] to-black" />
          
          {/* Crown / Iron Throne silhouette or medieval runes watermark */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-900/10 to-transparent flex justify-center items-end" />

          {/* Falling snow crystals */}
          {particles.map((p, idx) => (
            <div
              key={`snow-${idx}`}
              className="absolute rounded-full bg-white shadow-[0_0_10px_white] animate-fall-down-slow"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: `${parseInt(p.size) / 3}px`,
                height: `${parseInt(p.size) / 3}px`,
                top: "-5%",
                opacity: 0.2 + (idx % 3) * 0.25,
              }}
            />
          ))}

          {/* Searing dragon amber ash rising up of House Targaryen */}
          {particles.slice(0, 6).map((p, idx) => (
            <div
              key={`dragon-ash-${idx}`}
              className="absolute rounded-sm bg-amber-600/30 rotate-45 border border-red-500/10 shadow-[0_0_6px_rgba(239,68,68,0.4)] animate-float-up-fast"
              style={{
                left: `${(idx * 19 + 7) % 95}%`,
                animationDelay: p.delay,
                animationDuration: "7s",
                width: "4px",
                height: "4px",
                bottom: "-5%",
              }}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
}
