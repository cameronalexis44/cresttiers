# BPTiers

A community tier list for Minecraft **Bedrock Edition** PvP — inspired by the mctiers
concept, built from scratch, with a red/near-black theme.

- No player data included — starts empty, add players via the Mod Menu.
- **Mod Menu** at `/mod`, locked behind an access code (default: `Clow-Justice-504`).
  The code is checked server-side and never appears in the page source or client bundle.
- **Sign in with email** (magic link) via NextAuth.

## 1. Local setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Postgres connection string (Vercel Postgres, Neon, or Supabase all work free-tier) |
| `NEXTAUTH_SECRET` | Random string — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` locally, your real domain in production |
| `EMAIL_SERVER` | SMTP connection string for sending sign-in emails |
| `EMAIL_FROM` | The "from" address for sign-in emails |
| `MOD_ACCESS_CODE` | The passcode for `/mod`. Change this if you don't want the default. |

Push the database schema:

```bash
npx prisma migrate dev --name init
```

Run it:

```bash
npm run dev
```

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "BPTiers initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bptiers.git
git push -u origin main
```

**Important:** `.env` is git-ignored on purpose — never commit your real access code or
database credentials. Only `.env.example` (with placeholders) goes into the repo.

## 3. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. In **Environment Variables**, add every variable from `.env.example` with your real
   values (same names).
3. Deploy. Vercel will run `prisma generate` automatically via the `postinstall` script.
4. After the first deploy, run the migration against your production database once
   (from your machine, with `DATABASE_URL` pointed at prod):
   ```bash
   npx prisma migrate deploy
   ```
5. Set `NEXTAUTH_URL` to your live Vercel URL (e.g. `https://bptiers.vercel.app`) and
   redeploy.

## Notes on the mod code

- Changing `MOD_ACCESS_CODE` in Vercel's environment variables changes the passcode —
  no code edits needed.
- A successful unlock sets a signed, `httpOnly` cookie for 8 hours; it can't be read or
  forged from the browser.
- If you ever want a different code per environment (e.g. staging vs. production), just
  set a different `MOD_ACCESS_CODE` value for each.

## Categories & tiers

Defined in `lib/constants.ts` — edit that file to add/remove PvP categories
(Crystal, Sword, Axe, Pot, NethPot, UHC, SMP by default) or change the tier scale
(HT1–LT5 by default).
