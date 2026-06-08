# 🌌 AniTask - Anime-Themed To-Do App

A clean task manager with a subtle anime dark minimal vibe.

## 🚀 How to fix the "Blank Screen" on GitHub Pages

If your site is blank, it's because raw React/Vite code cannot be run directly by the browser without compiling first (the browser tries to load `/src/main.tsx` and 404s). 

To fix this automatically, I have added of a professional **GitHub Actions deployment workflow** at `.github/workflows/deploy.yml`:

1. **Commit & Push all files**: Export your workspace to your GitHub repository `To-Do-List-`.
2. **Enable GitHub Actions**:
   - Open your repository on GitHub.
   - Go to **Settings** (top navigation bar).
   - Click **Pages** in the left sidebar.
   - Under **Build and deployment > Source**, change the dropdown selection from **"Deploy from a branch"** to **"GitHub Actions"**.
3. **Watch it Deploy!**
   - Click the **Actions** tab on GitHub.
   - You will see a live workflow running! It automatically installs dependencies, compiles your code with Vite, and hosts it on GitHub Pages within 1 minute. Every subsequent push or commit will auto-deploy!

### 🔧 Base Directory Check
The base path in `vite.config.ts` is configured as `base: '/To-Do-List-/'`. If your GitHub repository name is spelled exactly as `To-Do-List-` (with the ending hyphen), you do not need to change anything. If your repository name is spelled differently (e.g. `To-Do-List` of `todo-list`), simply update the `base` in your `vite.config.ts` to match!

## 🔒 Firebase Security
The API key is public by design for client-side apps, but your data is protected by the `firestore.rules` file in this repo.

## ✨ Features
- Modern Anime Dark Theme
- Google Authentication
- Real-time Cloud Sync
- Priority & Due Dates
- Smooth Framer Motion Animations
