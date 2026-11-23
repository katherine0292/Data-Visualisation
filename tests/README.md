# Interaction regression checks

These browser checks require Node.js, Playwright and Google Chrome. They use the
installed Chrome browser by default. They do not modify the site or its source.

Start a static server from the repository root:

```sh
python3 -m http.server 8791
```

In a second terminal, run the checks from the same directory:

```sh
node tests/portfolio.cjs
node tests/presentation.cjs
```

The default site URL is `http://127.0.0.1:8791/`. To check an updated deployment,
set `BASE_URL` to the site's root URL, including the repository path when present:

```sh
BASE_URL=https://example.github.io/Data-Visualisation/ node tests/portfolio.cjs
BASE_URL=https://example.github.io/Data-Visualisation/ node tests/presentation.cjs
```

Optional environment variables:

| Variable | Purpose |
| --- | --- |
| `BASE_URL` | Root URL of the local server or deployment. |
| `PLAYWRIGHT_MODULE` | Module name or path to an existing Playwright installation; defaults to `playwright`. |
| `CHROME_PATH` | Path to a Chrome/Chromium executable; defaults to Playwright's `chrome` channel. |

`portfolio.cjs` checks the desktop rail, desktop and mobile menus, chart tabs,
image previews, story controls, copy action, links and local media resources.

`presentation.cjs` checks all 19 slides and every reveal in both directions,
boundary clicks, stage clicks and right clicks, keyboard navigation, speaker notes
and focus, initial and dynamic slide hashes, browser back/forward, fullscreen,
browser shortcut modifiers, image loading and JavaScript errors. It also checks
the navigation and notes controls with mobile taps at 390 × 844 and clicks at
1280 × 720. Remote Google Fonts are blocked in this check so a font outage cannot
stall the interaction audit.

Each script prints its result and exits with a nonzero status on failure.
