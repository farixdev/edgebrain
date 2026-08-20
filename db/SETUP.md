# Chat + admin backend setup

You can do steps 1–3 now, while the chat feature is being built. Nothing here
depends on the code landing first.

---

## 1. Create the Neon database

1. Go to <https://console.neon.tech> and sign up (free tier is fine).
2. Create a project — name it `edgebrain`. Pick the region closest to your
   users, not to you. Most traffic is US/EU, so `AWS us-east-1` or
   `AWS eu-central-1` beats an Asia region even though you are in Lahore.
3. On the project dashboard, copy the **pooled** connection string. It looks
   like:

   ```
   postgresql://USER:PASSWORD@ep-something-pooler.REGION.aws.neon.tech/neondb?sslmode=require
   ```

   Use the one with `-pooler` in the hostname. Vercel runs serverless functions
   that each open their own connection, and the non-pooled endpoint will run out
   of connections under any real traffic.

---

## 2. Run the schema

In the Neon console, open **SQL Editor**, paste the entire contents of
`db/001_init.sql`, and run it.

Or from your machine, if you have `psql`:

```bash
psql "YOUR_CONNECTION_STRING_HERE" -f db/001_init.sql
```

Every statement is guarded (`IF NOT EXISTS`), so running it twice is safe.

Verify it worked — you should see four tables:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Expected: `site_content`, `chat_settings`, `chat_conversations`, `chat_messages`.

---

## 3. Get a Groq API key

1. Go to <https://console.groq.com/keys> and sign in.
2. Create an API key and copy it. **You only see it once.**
3. Groq's free tier is rate-limited but generous enough for a site chatbot.

The default model is `openai/gpt-oss-120b`, which was verified as a current Groq
production model on 2026-08-20. If Groq deprecates it later you do **not** need a
redeploy — the model ID is editable in the admin panel under Chat Settings.

---

## 4. Add the environment variables

Add these to `edgebrain/.env.local` yourself — paste your own values, do not
share the keys in chat:

```
DATABASE_URL=postgresql://...-pooler...neon.tech/neondb?sslmode=require
GROQ_API_KEY=gsk_...
```

The file already holds `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `ADMIN_EMAIL`, and
`ADMIN_PASSWORD`. Keep those. `.env.local` is gitignored, so none of it reaches
GitHub.

Then add the same two variables in **Vercel → your project → Settings →
Environment Variables**, and redeploy. Without them, chat returns a clear
"not configured" error rather than crashing the site.

---

## 5. Seed the content table

The admin panel currently edits `src/data/content.json` by writing to disk. That
works locally and **silently fails on Vercel**, whose filesystem is read-only at
runtime. Once `DATABASE_URL` is set, content moves into the `site_content`
table and the admin panel works in production.

The first time the app starts with a database configured, it seeds
`site_content` from `content.json` automatically. The JSON file stays in the
repo as the fallback for local development and as the initial seed, so nothing
breaks if the database is briefly unreachable.

---

## Cost

Neon free tier: 0.5 GB storage, plenty for chat transcripts.
Groq free tier: rate-limited, no card required.
Neither needs a paid plan for a site at this traffic level.
