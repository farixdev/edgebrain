-- EdgeBrain Studios — initial schema
-- Run once against your Neon database:
--   psql "$DATABASE_URL" -f db/001_init.sql
-- Safe to re-run: every statement is guarded.

-- gen_random_uuid() lives here on older Postgres; Neon has it built in on 13+,
-- but the extension is free to request and keeps this portable.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Site content
--
-- Replaces writing src/data/content.json from the admin panel. Vercel's
-- filesystem is read-only at runtime, so fs.writeFileSync silently fails in
-- production; this table is the writable home for the same JSON payload.
-- Single row, id = TRUE, so there is exactly one live document by construction.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_content (
  id         BOOLEAN PRIMARY KEY DEFAULT TRUE,
  data       JSONB       NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_content_singleton CHECK (id)
);

-- ---------------------------------------------------------------------------
-- Chat settings
--
-- Everything the admin panel can tune about the bot without a redeploy.
-- Also single-row.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_settings (
  id                BOOLEAN PRIMARY KEY DEFAULT TRUE,
  enabled           BOOLEAN     NOT NULL DEFAULT TRUE,
  bot_name          TEXT        NOT NULL DEFAULT 'EdgeBrain Assistant',
  -- Shown before the visitor has given a name/email.
  greeting          TEXT        NOT NULL DEFAULT
    'Hi. Ask me anything about what we build, how we work, or what a project costs.',
  -- Rendered as persistent UI, not as a message, so it cannot scroll away.
  ai_disclosure     TEXT        NOT NULL DEFAULT
    'You are chatting with our AI assistant. A human will step in when it cannot help.',
  -- Appended to the system prompt. Lets the owner add positioning or rules
  -- without a code change.
  prompt_extra      TEXT        NOT NULL DEFAULT '',
  -- Groq model id. Kept as data because model availability changes often; the
  -- admin panel exposes it so a deprecated id never needs a redeploy to fix.
  -- Verified against console.groq.com/docs/models on 2026-08-20: the production
  -- chat models are openai/gpt-oss-120b and openai/gpt-oss-20b (both 131k ctx).
  -- 120b is the default because the whole job is obeying one hard rule — answer
  -- only from supplied context, otherwise escalate — and instruction adherence
  -- matters more here than the ~2x speed of the 20b. Switch to
  -- 'openai/gpt-oss-20b' in the admin panel if you want a snappier reply.
  model             TEXT        NOT NULL DEFAULT 'openai/gpt-oss-120b',
  temperature       REAL        NOT NULL DEFAULT 0.3,
  max_tokens        INTEGER     NOT NULL DEFAULT 700,
  -- Sent verbatim when the model cannot ground an answer in site content.
  fallback_message  TEXT        NOT NULL DEFAULT
    'I am not certain enough to answer that accurately. Someone from the team will reply to you shortly.',
  notify_email      TEXT        NOT NULL DEFAULT 'edgebrainstudios@gmail.com',
  -- Email the owner on every new conversation vs only when a human is needed.
  notify_on_every   BOOLEAN     NOT NULL DEFAULT FALSE,
  accent_color      TEXT        NOT NULL DEFAULT '#FFD400',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chat_settings_singleton CHECK (id)
);

INSERT INTO chat_settings (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Conversations
--
-- One row per visitor session. Name and email are captured before the first
-- message, so they are NOT NULL — a conversation cannot exist without a lead.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name    TEXT        NOT NULL,
  visitor_email   TEXT        NOT NULL,
  -- open        : running normally, AI handling it
  -- needs_human : AI hit its grounding limit, or visitor asked for a person
  -- closed      : owner marked it done
  status          TEXT        NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'needs_human', 'closed')),
  -- Context, useful for triage. Nullable: a visitor may block referrer.
  page_url        TEXT,
  referrer        TEXT,
  user_agent      TEXT,
  -- Denormalised so the admin inbox can sort without touching chat_messages.
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Drives the unread badge; cleared when the owner opens the thread.
  unread_for_admin BOOLEAN    NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inbox query: newest activity first, optionally filtered by status.
CREATE INDEX IF NOT EXISTS chat_conversations_last_message_idx
  ON chat_conversations (last_message_at DESC);
CREATE INDEX IF NOT EXISTS chat_conversations_status_idx
  ON chat_conversations (status, last_message_at DESC);

-- ---------------------------------------------------------------------------
-- Messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL
                    REFERENCES chat_conversations (id) ON DELETE CASCADE,
  -- visitor   : the customer
  -- assistant : the Groq-backed bot
  -- admin     : a human reply from the admin panel
  role            TEXT        NOT NULL
                    CHECK (role IN ('visitor', 'assistant', 'admin')),
  content         TEXT        NOT NULL,
  -- True when the assistant declined to answer and escalated. Lets the inbox
  -- show *why* a thread needs a human without re-reading the transcript.
  escalated       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transcript fetch: all messages for one conversation, oldest first.
CREATE INDEX IF NOT EXISTS chat_messages_conversation_idx
  ON chat_messages (conversation_id, created_at ASC);

-- ---------------------------------------------------------------------------
-- Keep last_message_at and the unread flag correct without application code
-- having to remember. A trigger cannot be forgotten in a code path the way an
-- UPDATE can.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION touch_conversation() RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_conversations
     SET last_message_at = NEW.created_at,
         -- An admin replying is the owner reading the thread, so it stops
         -- being unread. Anything else makes it unread again.
         unread_for_admin = (NEW.role <> 'admin')
   WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chat_messages_touch ON chat_messages;
CREATE TRIGGER chat_messages_touch
  AFTER INSERT ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION touch_conversation();
