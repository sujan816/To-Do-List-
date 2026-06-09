/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Coins, ShieldAlert, CheckCircle, Sparkles, ShoppingBag, Volume2 } from 'lucide-react';
import { UserStats } from '../types';
import { sfx } from '../lib/audioSynth';

interface GuildShopProps {
  stats: UserStats;
  onUpdateStats: (updates: Partial<UserStats>) => void;
}

export default function GuildShop({ stats, onUpdateStats }: GuildShopProps) {
  const shopThemes = [
    { id: 'retro', name: 'Sunset Retro Arcade', cost: 100, desc: 'A nostalgic warm neon orange theme featuring high-contrast arcade vibes.' },
    { id: 'dungeon', name: 'Mystic Dungeon', cost: 150, desc: 'A dark cyber-medieval crimson layout styled for deep focused combat.' },
    { id: 'tokyo', name: 'Cyberpunk Neo-Tokyo', cost: 200, desc: 'An immersive cyan and purple hacker layout reflecting high-tech aesthetics.' },
    { id: 'onepiece', name: 'Grand Line (One Piece)', cost: 250, desc: 'A gorgeous marine gold-yellow and Straw Hat red sea theme. Sail into deep focus across the Grand Line!' },
    { id: 'naruto', name: 'Will of Fire (Naruto)', cost: 250, desc: 'An energetic Kyuubi orange and scroll-green layout. Awaken your inner ninja focus scroll!' },
    { id: 'deathnote', name: 'Shinigami Realm (Death Note)', cost: 300, desc: 'A gothic high-contrast monochrome terminal with apple-red accents. Slay distractions with finality.' },
    { id: 'breakingbad', name: 'Heisenberg Lab (Breaking Bad)', cost: 300, desc: 'A chemical hazmat yellow and 99.1% pure meth-blue theme for lab-clean productivity.' },
    { id: 'got', name: 'Westeros Iron (Game of Thrones)', cost: 350, desc: 'A weathered iron, Targaryen crimson, and icy northern blue layout. Win the game of focus.' },
  ];

  const shopTitles = [
    { name: 'Straw Hat Captain 🏴‍☠', cost: 150, desc: 'Declare yourself King of the Quest Seas! Plays the heroic "We Are!" opening hook.', themeId: 'onepiece' },
    { name: 'Hokage of Focus 🌀', cost: 200, desc: 'Awaken your Will of Fire and lead your tasks. Plays the famous Flute battle theme.', themeId: 'naruto' },
    { name: 'God of the New World 🍎', cost: 250, desc: 'Slay distractions from your ledger with absolute finality. Plays Death Note\'s L Theme.', themeId: 'deathnote' },
    { name: 'The Danger (Heisenberg) 🧪', cost: 250, desc: 'You are the one who knocks... out quests. Plays the dark desert slide chemistry chime.', themeId: 'breakingbad' },
    { name: 'Heir to the Iron Throne 👑', cost: 300, desc: 'Win the great war of focus before Winter Comes. Plays the legendary cello arpeggio song.', themeId: 'got' },
    { name: 'Dungeon Raider ⚔️', cost: 50, desc: 'A dungeon-crawler honorific badge showing pristine dungeon level focus.', themeId: 'dungeon' },
    { name: 'Neo-Tokyo Hacker 💻', cost: 100, desc: 'A high-tech title representing cybernetic concentration and clean code sprints.', themeId: 'tokyo' },
    { name: 'The S-Rank Legend 🎖️', cost: 150, desc: 'The absolute pinnacle of focus. Reserved for ultimate masters of the Guild.', themeId: 'retro' },
  ];

  const buyTheme = (id: string, cost: number) => {
    sfx.playClick();
    if (stats.gold < cost) {
      alert("❌ Insolent traveler! You do not possess enough gold coins for this purchase. Slay more quests first.");
      return;
    }

    const updatedGold = stats.gold - cost;
    const updatedOwned = [...stats.ownedThemes, id];
    
    onUpdateStats({
      gold: updatedGold,
      ownedThemes: updatedOwned,
    });
    
    sfx.playThemeSong(id);
    alert(`🎉 Success! You unlocked the theme "${id.toUpperCase()}"! You can equip it now.`);
  };

  const buyTitle = (name: string, cost: number, themeId?: string) => {
    sfx.playClick();
    if (stats.gold < cost) {
      alert("❌ You lack the gold coins required to unlock this prestigious title. Grind more goals!");
      return;
    }

    const updatedGold = stats.gold - cost;
    const updatedOwned = [...stats.ownedTitles, name];

    onUpdateStats({
      gold: updatedGold,
      ownedTitles: updatedOwned,
    });

    if (themeId) {
      sfx.playThemeSong(themeId);
    } else {
      sfx.playLevelUp();
    }
    alert(`🎉 Victory! You unlocked the title "${name}"! Equip it in your stats tab.`);
  };

  const equipTheme = (id: string) => {
    sfx.playClick();
    onUpdateStats({ activeTheme: id as any });
    sfx.playThemeSong(id);
  };

  const previewThemeSong = (themeId: string) => {
    sfx.playClick();
    sfx.playThemeSong(themeId);
  };

  return (
    <div className="space-y-6" id="guild-merchant">
      {/* Gold summary head */}
      <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/15">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Guild Merchant Shop</h3>
            <p className="text-[10px] text-slate-400">Unlock luxury skins and titles using your hard-earned gold coins</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/60 border border-white/5 rounded-xl font-mono">
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-amber-400">{stats.gold} gp</span>
        </div>
      </div>

      {/* Premium Themes Shop Section */}
      <div className="space-y-3" id="shop-themes-list">
        <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Premium Interface Themes
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {shopThemes.map((theme) => {
            const isOwned = stats.ownedThemes.includes(theme.id);
            const isEquipped = stats.activeTheme === theme.id;

            return (
              <div 
                key={theme.id}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isEquipped 
                    ? 'bg-indigo-500/10 border-indigo-500 shadow-lg' 
                    : 'bg-slate-900/40 border-white/5'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h5 className="font-bold text-sm text-slate-100 mb-1 capitalize">{theme.name}</h5>
                    <button
                      onClick={() => previewThemeSong(theme.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-500/20 border border-white/5 text-indigo-400 transition-all cursor-pointer"
                      title="Preview Theme Soundtrack"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{theme.desc}</p>
                </div>

                <div>
                  {isEquipped ? (
                    <div className="w-full text-center py-2 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 uppercase">
                      Active Theme
                    </div>
                  ) : isOwned ? (
                    <button
                      onClick={() => equipTheme(theme.id)}
                      className="w-full py-2 text-xs font-mono font-bold bg-slate-950 text-slate-300 border border-white/5 hover:border-slate-400/40 rounded-lg transition-all cursor-pointer"
                    >
                      Equip Theme
                    </button>
                  ) : (
                    <button
                      onClick={() => buyTheme(theme.id, theme.cost)}
                      className="w-full py-2 text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 fill-current" />
                      <span>Unlock ({theme.cost}gp)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prestige Titles Section */}
      <div className="space-y-3 pt-2" id="shop-titles-list">
        <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-amber-500" /> Prestige Title Badges
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {shopTitles.map((title) => {
            const isOwned = stats.ownedTitles.includes(title.name);

            return (
              <div 
                key={title.name}
                className="p-4 bg-slate-900/40 border border-white/5 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h5 className="font-bold text-sm text-amber-400 mb-1">{title.name}</h5>
                    <button
                      onClick={() => previewThemeSong(title.themeId)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 border border-white/5 text-amber-400 transition-all cursor-pointer"
                      title="Preview Title Badge Melodic Anthem"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{title.desc}</p>
                </div>

                <div>
                  {isOwned ? (
                    <div className="w-full text-center py-2 text-xs font-mono bg-slate-950 text-slate-500 rounded-lg border border-white/5 uppercase">
                      Purchased
                    </div>
                  ) : (
                    <button
                      onClick={() => buyTitle(title.name, title.cost, title.themeId)}
                      className="w-full py-2 text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 fill-current" />
                      <span>Unlock ({title.cost}gp)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
