# MagnetiZM — magnetizm.agency

## Project structure

```
magnetizm/
├── index.html          ← main file, built section by section
├── css/
│   └── style.css       ← all styles
├── js/
│   └── main.js         ← all scripts
├── images/
│   ├── megi.jpg        ← drop headshot here
│   ├── mili.jpg        ← drop headshot here
│   └── hero-poster.jpg ← video fallback still frame (optional)
└── video/
    └── hero-bg.mp4     ← drop background video here
```

## Hero video
- Drop your video file into `/video/` named `hero-bg.mp4`
- For best performance: compress to ~5–10MB, 1920×1080, MP4/H.264
- The poster image (`images/hero-poster.jpg`) shows while the video loads

## Deploy to Netlify
1. Push this folder to a GitHub repo
2. Go to netlify.com → Add new site → Import from GitHub
3. Build command: (leave empty)
4. Publish directory: `.` (the root)
5. Deploy — you'll get a shareable `.netlify.app` link instantly

## Connect custom domain (after May 2nd)
1. Buy `magnetizm.agency` from your registrar
2. In Netlify: Site settings → Domain management → Add custom domain
3. Point your DNS to Netlify's nameservers

## Brand tokens (for reference)
- Magenta: #E8177A
- Gold:     #F0A500
- Black:    #0A0A0A
- Fonts:    Barlow Condensed (headlines) + Barlow (body)
