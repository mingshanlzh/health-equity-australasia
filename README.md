# Health Equity Australasia — Health Equity SIG

Community website for the Health Equity Special Interest Group, serving
researchers, practitioners and students across Australia, Aotearoa New Zealand
and the world.

**Live site:** https://healthequityaustralasia.org/

## Features

- **Seminar series** — upcoming and past seminars with recordings and slides (admin-managed)
- **Member blog** — members write Markdown posts with live preview, tags and comments
- **Noticeboard** — community announcements (jobs, PhD opportunities, CFPs)
- **Member research** — a shared library of member publications and projects
- **Member directory** — public profiles with photos, bios, interests and links
- **Auth & roles** — email/password signup, admin approval workflow, admin panel
- **Design** — shadcn/ui + Tailwind v4, light/dark mode, clean academic style

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, `output: "export"` — fully static) |
| UI | Tailwind CSS v4, shadcn/ui components, lucide-react icons |
| Data & auth | Supabase (PostgreSQL + RLS + Auth + Storage), client-side only |
| Hosting | GitHub Pages via Actions (`.github/workflows/deploy.yml`) |

## Development

```bash
npm install
npm run dev
```

## Database

The complete schema lives in `supabase/schema.sql`. It is idempotent — run the
whole file in the Supabase SQL editor to (re)create tables, RLS policies, the
signup trigger, and the avatars storage bucket.

Admin accounts: emails listed in `handle_new_user()` are auto-promoted to
admin on signup; other members are approved from the `/admin` panel.

## Downloadable files

Put files for download (programs, slides, PDFs) in `public/files/`. They are
served at `<site>/files/<name>`. In a post, link to the full URL:

```md
[Workshop program (PDF)](https://healthequityaustralasia.org/files/program.pdf)
```

Links to this folder are shown as download buttons (see
`components/Markdown.tsx`).

## Icons

- `app/icon1.ico`: browser-tab icon (16, 32, 48 and 64 px)
- `app/icon.png`: 512 px icon
- `app/apple-icon.png`: iOS home-screen icon

Do not name the tab icon `favicon.ico`. Next.js serves that name at a fixed
URL with no content hash, so browsers keep showing the old icon for days after
the logo changes. Any `icon*` file gets a hashed URL and updates straight away.

## Deployment

Every push to `main` builds and deploys to GitHub Pages. The site is served
from the root of the custom domain `healthequityaustralasia.org`, which is set
in the repository's Pages settings. The old address,
`mingshanlzh.github.io/health-equity-australasia`, redirects to it.

`basePath` in `next.config.ts` is empty for this reason. To build for a
sub-path, set `NEXT_PUBLIC_BASE_PATH` (for example
`/health-equity-australasia`) at build time.

## Domain

`healthequityaustralasia.org` is registered at Porkbun, which also hosts its
DNS records:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `mingshanlzh.github.io` |

These are GitHub Pages' addresses. `www` redirects to the bare domain. If the
registration lapses or these records change, the site goes offline, so keep
auto-renew on at Porkbun.
