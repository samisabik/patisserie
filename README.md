# 🧁 Cookbook

My personal collection of pastry & dessert recipes. Plain Markdown — open any file
to read it, on GitHub or your phone. No tools required.

## Recipes

- [Chocolate and Pecan Brownie](recipes/chocolate-pecan-brownie.md)
- [Crêpes](recipes/crepes.md)
- [Lactose-Free Tiramisu](recipes/lactose-free-tiramisu.md)
- [Pastéis de Nata](recipes/pasteis-de-nata.md)

## Adding a recipe

**Easiest:** open this repo in Claude Code and say *"Add this recipe: `<link>`"*.
The `recipe-importer` agent fetches the page, translates it to English, converts all
units to metric, writes the file, updates this list, and pushes — no prompts. You can
paste several links at once. Anything it's unsure about is flagged with a
`<!-- check: ... -->` comment in the file.

**By hand:** copy [`.claude/TEMPLATE.md`](.claude/TEMPLATE.md) into `recipes/`, fill it
in, add a line to the list above, then commit and push.
