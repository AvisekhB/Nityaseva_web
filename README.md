# Nityaseva website

Eternal service, Timeless care.

A static website (plain HTML, CSS and JavaScript). No build step needed.

## Files
- `index.html` : all page text and sections
- `css/style.css` : colours and fonts are at the top (`:root`)
- `js/main.js` : phone, email, address, hours and plan prices are in the `CONFIG` block at the top
- `assets/` : your logo in different sizes and the favicon

## Publish on GitHub Pages
1. Create a new repository on github.com (for example `nityaseva`), set to Public.
2. Upload all files from this folder to the repository root (drag and drop works on the GitHub website).
3. Open Settings > Pages.
4. Under "Build and deployment", choose "Deploy from a branch", branch `main`, folder `/ (root)`, then Save.
5. After a minute your site appears at `https://YOUR-USERNAME.github.io/nityaseva/`.

Using the command line instead:

    git init
    git add .
    git commit -m "Nityaseva website"
    git branch -M main
    git remote add origin https://github.com/YOUR-USERNAME/nityaseva.git
    git push -u origin main

## Custom domain (optional)
Settings > Pages > Custom domain, then point your domain's DNS to GitHub Pages.
