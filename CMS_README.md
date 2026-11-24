# Local Portfolio CMS

This CMS lets you upload a local video and thumbnail without editing React code.

## Start the CMS

```bash
npm run cms
```

Open:

```txt
http://localhost:5050
```

## What it does

When you upload work, it automatically:

- Saves the video in `public/videos`
- Saves the thumbnail in `public/portfolio`
- Adds the new item to the top of `public/data/portfolio.json`

## Preview the website

In another terminal:

```bash
npm run dev
```

## Before deploying

Run:

```bash
npm run build
```
