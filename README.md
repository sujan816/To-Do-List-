# 🌌 AniTask - Anime-Themed To-Do App

A clean task manager with a subtle anime dark minimal vibe.

## 🚀 GitHub Pages Deployment Steps

1. **Export to GitHub**: Use the AI Studio export feature to push this code to your `To-Do-List-` repository.
2. **Configure Base Path**: The `vite.config.ts` is already set with `base: '/To-Do-List-/'`.
3. **Deploy**:
   - If you want to deploy manually: Run `npm run build` and upload the contents of the `dist` folder to your `gh-pages` branch.
   - **Recommended**: Go to **Settings > Pages** on GitHub and select **GitHub Actions** as the source. GitHub will suggest a custom workflow for "Static HTML" or "Vite".

## 🔒 Security Note
The Firebase API key in `firebase-applet-config.json` is safe to be public. Your data is secured by the **Firestore Security Rules** found in `firestore.rules`.

## ✨ Features
- Modern Anime Dark Theme
- Google Authentication
- Real-time Cloud Sync
- Priority & Due Dates
- Smooth Framer Motion Animations
