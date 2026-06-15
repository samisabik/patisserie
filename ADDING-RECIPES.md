# Adding a recipe

The easy way — just hand Claude Code a link (or pasted text) and it does the rest.

## With Claude Code

From this repo, say:

> Add this recipe: <paste a URL>

Claude runs the **recipe-importer** agent (`.claude/agents/recipe-importer.md`), which:

1. Fetches the page (handles dense, ad-heavy, any-layout sites — falls back to `curl`
   or asks you to paste if a site blocks it).
2. **Translates to English** if it's in another language.
3. **Converts all units to metric** — g / kg / ml / L / tsp / tbsp, °C, cm. Cup
   measures of dry ingredients are converted by weight.
4. Writes a clean `recipes/<name>.md` from `TEMPLATE.md`, with the source URL in Notes.
5. Adds it to the list in `README.md` and pushes to GitHub.

You can pass several links at once. Anything the importer wasn't sure about is flagged
with a `<!-- check: ... -->` comment in the file for you to confirm.

## By hand

Copy `TEMPLATE.md` into `recipes/`, fill it in, add a line to the list in `README.md`,
then `git add -A && git commit -m "Add ..." && git push`.
