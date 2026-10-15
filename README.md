# snippets

Reusable JavaScript snippets for Webflow and front-end projects. Copy, paste, ship.

<p>
  <img src="https://img.shields.io/badge/Webflow-146EF5?style=flat-square&logo=webflow&logoColor=white" alt="Webflow">
  <img src="https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="Vanilla JS">
  <img src="https://img.shields.io/badge/GSAP-66F28E?style=flat-square&logo=gsap&logoColor=black" alt="GSAP">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square" alt="MIT License">
</p>

No build step, no dependencies unless stated. Every snippet is a single file with a header that tells you where it goes and what markup it expects.

## Structure

| Folder | What's inside |
|---|---|
| [`webflow/`](webflow) | Footer scripts and Embeds for Webflow: UI components, forms, sliders, animations |
| [`js/`](js) | Framework-agnostic JavaScript utilities |
| [`shell/`](shell) | Terminal scripts for everyday dev tasks |
| [`_template/`](_template) | Starting points for new snippets |

## Index

### Webflow

<!-- Add one row per snippet:
| [faq-accordion](webflow/faq-accordion.js) | Accessible accordion on <details>/<summary> with smooth height animation | — |
-->

_Coming soon._

### JavaScript

<!-- | [name](js/name.js) | What it does | Dependencies | -->

_Coming soon._

### Shell

<!-- | [name](shell/name.sh) | What it does | Requirements | -->

_Coming soon._

## Using a snippet in Webflow

1. Open the snippet and read its header: **Where**, **Requires** and **Depends**.
2. Add the classes or `data-` attributes from **Requires** to your elements in the Designer.
3. Paste the code into **Page settings → Custom code → Before `</body>` tag**
   (or **Site settings → Custom code** to run it on every page), wrapped in `<script></script>`.
4. If the snippet depends on GSAP, enable it in **Site settings → GSAP** with the plugins listed in the header.
   No CDN tags needed.
5. Publish and open the browser console: each snippet logs its progress with a `[snippet-name]` prefix.

Snippets meant for an **Embed inside a section** (not the footer) use a self-invoking function instead of `Webflow.push`,
because the Webflow runtime isn't loaded yet at that point. See [`_template/webflow-embed.js`](_template/webflow-embed.js).

## Conventions

- One snippet per file, named in `kebab-case`
- Every file starts with a header block: what it does, where it goes, required markup, dependencies
- Vanilla JS, ES2020+, no build step
- Markup hooks use `data-` attributes where possible, so renaming classes in the Designer doesn't break scripts
- Console logs are prefixed with the snippet name

## License

[MIT](LICENSE): free to use in personal and commercial projects.
