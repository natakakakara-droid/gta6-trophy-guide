[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/natakakakara-droid/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/natakakakara-droid/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI, built for make.fun's "Build the best GTA 6 trophy guide" bounty. Open `app/index.html` in a desktop browser — no build step, no network needed.

## What it covers

- **All 55 trophies** — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 27 visible, 28 hidden, 0 online — with the official name, description and grade exactly as PlayStation publishes them.
- **A guide for every trophy**, written for this entry in our own words, with its sources named beside it (PowerPyx, Keengamer and Output Lag, plus the Exophase and PSNProfiles lists for the official data). Five trophies whose exact unlock method the sources themselves have not yet confirmed are marked **Method unconfirmed** in their guides, with the best-known approach instead of an invented one.
- **A platinum roadmap** — about 200 hours, difficulty 4/10, in five stages from story to 100% Completion cleanup.
- **The one missable trophy flagged**: Positive Mental Attitude, with the Chapter 1 balcony meditation spelled out and a warning to keep a manual save per chapter, since there is no mission replay.

## The tracker

- Checklist saved in the browser (`localStorage`); tick a trophy and it stays ticked.
- **Export / import** your progress as a JSON file, so you can back it up or move it to another machine.
- **Filters** by kind (story, missable, collectibles, activities, online) and by grade, plus text search and an earned-only view.
- **Spoiler setting**: hidden story trophies show as "Hidden trophy" until you earn them (or turn the setting off).
- **Progress bar** with earned count and percentage, and per-grade counts.

Everything runs from the static files under `app/` — the app makes zero network requests. The look is our own: no Rockstar Games logo, artwork, box art or game screenshots.

## Try it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Or just open `app/index.html` directly.

## Files

- `app/index.html`, `app/app.js`, `app/style.css` — the guide and tracker.
- `app/data/trophies.json` — the 55 trophies with official data, guides and sources.
- `screenshots/` — real headless-Chrome renders of this code (see `shots.json` for the views).
- `main.ts` — hands the guide in: copies `app/` and `screenshots/` to the output and writes `dossier.json` with the vendored make.fun library.
- `serve.ts` — a tiny static server for local testing.

MIT licensed — see `LICENSE`.
