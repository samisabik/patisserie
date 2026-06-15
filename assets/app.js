"use strict";

const app = document.getElementById("app");

marked.setOptions({ gfm: true, breaks: false });

// Cache the parsed recipe index so we don't re-fetch the README on every view.
let recipeIndex = null;

async function loadIndex() {
  if (recipeIndex) return recipeIndex;
  const res = await fetch("README.md", { cache: "no-cache" });
  if (!res.ok) throw new Error("Could not load recipe list.");
  const md = await res.text();

  // Pull the bullet links out of the "## Recipes" section only.
  const lines = md.split("\n");
  const recipes = [];
  let inSection = false;
  for (const line of lines) {
    if (/^##\s+Recipes\s*$/i.test(line)) { inSection = true; continue; }
    if (inSection && /^##\s+/.test(line)) break;
    const m = inSection && line.match(/^\s*[-*]\s*\[([^\]]+)\]\(([^)]+)\)/);
    if (m) recipes.push({ title: m[1].trim(), path: m[2].trim() });
  }
  recipeIndex = recipes;
  return recipes;
}

function renderHome(recipes) {
  const items = recipes.map(r =>
    `<li><a href="#${encodeURI(r.path)}">
       <span class="name">${escapeHtml(r.title)}</span>
       <span class="arrow">&rarr;</span>
     </a></li>`
  ).join("");

  app.innerHTML = `
    <p class="intro">A personal collection of pastry &amp; dessert recipes.
    Pick one below, or browse the plain Markdown on GitHub.</p>
    <ul class="recipe-list">${items}</ul>`;
  document.title = "🧁 Cookbook";
}

async function renderRecipe(path) {
  app.innerHTML = `<p class="loading">Loading…</p>`;
  let recipes;
  try { recipes = await loadIndex(); } catch (_) { recipes = []; }

  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) {
    app.innerHTML = `<a class="back" href="#">&larr; All recipes</a>
      <p class="error">Sorry, that recipe could not be found.</p>`;
    return;
  }
  let md = await res.text();

  // Drop the trailing HTML photo-placeholder comment block.
  md = md.replace(/<!--[\s\S]*?-->/g, "").trim();

  const meta = recipes.find(r => r.path === path);
  const ghUrl = `https://github.com/samisabik/patisserie/blob/main/${path}`;

  app.innerHTML = `
    <a class="back" href="#">&larr; All recipes</a>
    <article class="recipe">${marked.parse(md)}</article>
    <p class="recipe-source">
      <a href="${ghUrl}" target="_blank" rel="noopener">View this recipe on GitHub</a>
    </p>`;

  document.title = (meta ? meta.title : "Recipe") + " · 🧁 Cookbook";
  window.scrollTo(0, 0);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

async function route() {
  const hash = decodeURI(location.hash.replace(/^#/, "")).trim();
  try {
    if (hash && /\.md$/i.test(hash)) {
      await renderRecipe(hash);
    } else {
      renderHome(await loadIndex());
    }
  } catch (err) {
    app.innerHTML = `<p class="error">${escapeHtml(err.message || "Something went wrong.")}</p>`;
  }
}

window.addEventListener("hashchange", route);
route();
