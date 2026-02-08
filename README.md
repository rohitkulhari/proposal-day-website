# Proposal Day Website

Static website for GitHub Pages.

## Local Preview

Open `index.html` directly in your browser.

## Deploy To GitHub Pages

1. Initialize Git in this folder:
   ```bash
   cd "/Users/macro/Documents/New project"
   git init
   git add .
   git commit -m "Initial Proposal Day website"
   ```
2. Create an empty GitHub repository (for example `valentine-proposal`).
3. Connect and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
4. In GitHub repo settings:
   - Open `Settings -> Pages`
   - Under `Build and deployment`, set `Source` to `Deploy from a branch`
   - Select `main` branch and `/ (root)` folder
5. Wait for Pages to build. Your link will be:
   `https://<your-username>.github.io/<repo-name>/`

## Customize Text

- Main content: `index.html`
- Styles and effects: `styles.css`
- Interactions and animations: `script.js`
