# apaunov.github.io

Personal website for Alex Paunov. Custom static site, served by GitHub Pages at https://apaunov.github.io.

The build pipeline lives in the parent folder (`../code/website/`), not in this repo. See **`../README.md`** for the full setup, build, and deployment workflow. This README covers only what's *inside* the repo.

## Layout

```
apaunov.github.io/
├── _src/               # source files (not served by GitHub Pages)
│   ├── posts/          # post Markdown files (with YAML frontmatter)
│   ├── templates/      # HTML templates
│   └── ornaments/      # small ornament SVGs (fleurons, separators)
├── static/             # CSS, JS, generated post images
│   ├── css/
│   ├── js/
│   └── images/
├── index.html          # landing page (generated)
├── references.html     # references page (generated)
├── about.html          # about page (generated)
└── posts/              # rendered individual post pages (generated)
```

The build script lives at `../code/website/build.py`. Run it from the project root.

## Build

```
cd "/path/to/website"
python3 code/website/build.py
```

This regenerates `index.html`, `references.html`, `about.html`, and the `static/images/ornaments/` directory from sources.

## Preview locally

```
cd "/path/to/website/apaunov.github.io"
python3 -m http.server 8000
```

Then open http://localhost:8000/ in a browser. Use `Cmd+Shift+R` to hard-reload after rebuilding.

## Hosting

Files in this folder are served directly by GitHub Pages at https://apaunov.github.io.
The `_src/` and `_*` paths are ignored by Jekyll, so source files in this repo aren't exposed.
