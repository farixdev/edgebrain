/**
 * The one and only place SQL is allowed to live.
 *
 * Everything above this file — routes, server components, the admin panel —
 * talks to the database through the typed functions exported here. Nothing
 * else in the codebase should import `@neondatabase/serverless` or build a
 * query string.
 *
 * ---------------------------------------------------------------------------
 * Graceful degradation
 * ---------------------------------------------------------------------------
 * `DATABASE_URL` may be absent — a fresh clone, a preview build, CI. The site
 * must still build and render in that case, so:
 *
 *   - The Neon client is created lazily, on first query, never at module load.
 *     Importing this file can never throw.
 *   - READ functions never throw. If the database is unconfigured or the query
 *     fails they log and return a sensible fallback: `getSiteContent()` falls
 *     back to the bundled `src/data/content.json`, `getChatSettings()` to
 *     `DEFAULT_CHAT_SETTINGS`, list reads to `[]`, single-row reads to `null`.
 *   - WRITE functions DO throw when the database is unavailable, because a
 *     silent no-op on "save my content" or "record this message" is a bug
 *     wearing a smile. Callers should let the error become a 500.
 *
 * ---------------------------------------------------------------------------
 * Conventions
 * ---------------------------------------------------------------------------
 *   - Every value that reaches SQL goes through the neon tagged template,
 *     which sends it as a bound parameter. Never build a query by
 *     concatenating input.
 *   - Postgres columns are snake_case; everything returned from here is
 *     camelCase, and every timestamp is an ISO 8601 string rather than a Date,
 *     so rows can be handed straight to `NextResponse.json()`.
 *   - `chat_messages` has an AFTER INSERT trigger (`chat_messages_touch`) that
 *     maintains `chat_conversations.last_message_at` and `unread_for_admin`.
 *     Do not reimplement that here. `addMessage` inserts and nothing else.
 */

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import fallbackContent from "@/data/content.json";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface SiteContact {
  phone: string;
  phoneTel: string;
  whatsapp: string;
  email: string;
  location: string;
  locationDetail: string;
}

export interface SiteService {
  number: string;
  title: string;
  description: string;
  detail: string;
  href: string;
}

export interface SiteProject {
  slug: string;
  title: string;
  category: string;
  description: string;
  color: string;
  accent: string;
  thumbnail: string;
  placeholder: boolean;
  disclosure?: string;
}

export interface SiteProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface SiteStat {
  value: number;
  suffix: string;
  label: string;
}

export interface SiteFaq {
  question: string;
  answer: string;
}

export interface SiteDifferentiator {
  title: string;
  description: string;
}

/**
 * The shape of `site_content.data`, which is the same shape as
 * `src/data/content.json`. The index signature is deliberate: the admin panel
 * round-trips the whole document, so a key added to content.json survives a
 * save even before this interface knows about it.
 */
export interface SiteContent {
  contact: SiteContact;
  services: SiteService[];
  projects: SiteProject[];
  processSteps: SiteProcessStep[];
  stats: SiteStat[];
  reviews: unknown[];
  faqs: SiteFaq[];
  differentiators: SiteDifferentiator[];
  [key: string]: unknown;
}

export interface ChatSettings {
  enabled: boolean;
  botName: string;
  greeting: string;
  aiDisclosure: string;
  promptExtra: string;
  model: string;
  temperature: number;
  maxTokens: number;
  fallbackMessage: string;
  notifyEmail: string;
  notifyOnEvery: boolean;
  accentColor: string;
  updatedAt: string | null;
}

export type ConversationStatus = "open" | "needs_human" | "closed";
export type MessageRole = "visitor" | "assistant" | "admin";

export interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: ConversationStatus;
  pageUrl: string | null;
  referrer: string | null;
  userAgent: string | null;
  lastMessageAt: string;
  unreadForAdmin: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  escalated: boolean;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Client                                                                     */
/* -------------------------------------------------------------------------- */

type Sql = NeonQueryFunction<false, false>;
type Row = Record<string, unknown>;

let cachedSql: Sql | null = null;

/** True when `DATABASE_URL` is present and non-empty. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * The lazily-created Neon client, or `null` when unconfigured.
 *
 * Never called at module scope, so importing this file is always safe.
 */
function getSql(): Sql | null {
  if (!isDbConfigured()) return null;
  if (!cachedSql) cachedSql = neon(process.env.DATABASE_URL as string);
  return cachedSql;
}

/** Thrown by every write path when there is no database to write to. */
function requireSql(operation: string): Sql {
  const sql = getSql();
  if (!sql) {
    throw new Error(
      `DATABASE_URL is not set, so ${operation} cannot be performed. ` +
        `Add it to .env.local (Neon pooled connection string) and restart.`
    );
  }
  return sql;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Guards Postgres from a `invalid input syntax for type uuid` error. */
function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

/** timestamptz comes back as a Date; everything above this file wants a string. */
function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return new Date(value).toISOString();
  return new Date().toISOString();
}

function toIsoOrNull(value: unknown): string | null {
  return value == null ? null : toIso(value);
}

function clampInt(value: number | undefined, fallback: number, max: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.trunc(value), 0), max);
}

/* -------------------------------------------------------------------------- */
/* Row mappers                                                                */
/* -------------------------------------------------------------------------- */

function mapSettings(row: Row): ChatSettings {
  return {
    enabled: Boolean(row.enabled),
    botName: String(row.bot_name ?? DEFAULT_CHAT_SETTINGS.botName),
    greeting: String(row.greeting ?? DEFAULT_CHAT_SETTINGS.greeting),
    aiDisclosure: String(
      row.ai_disclosure ?? DEFAULT_CHAT_SETTINGS.aiDisclosure
    ),
    promptExtra: String(row.prompt_extra ?? ""),
    model: String(row.model ?? DEFAULT_CHAT_SETTINGS.model),
    temperature: Number(row.temperature ?? DEFAULT_CHAT_SETTINGS.temperature),
    maxTokens: Number(row.max_tokens ?? DEFAULT_CHAT_SETTINGS.maxTokens),
    fallbackMessage: String(
      row.fallback_message ?? DEFAULT_CHAT_SETTINGS.fallbackMessage
    ),
    notifyEmail: String(row.notify_email ?? DEFAULT_CHAT_SETTINGS.notifyEmail),
    notifyOnEvery: Boolean(row.notify_on_every),
    accentColor: String(row.accent_color ?? DEFAULT_CHAT_SETTINGS.accentColor),
    updatedAt: toIsoOrNull(row.updated_at),
  };
}

function mapConversation(row: Row): Conversation {
  return {
    id: String(row.id),
    visitorName: String(row.visitor_name ?? ""),
    visitorEmail: String(row.visitor_email ?? ""),
    status: (row.status as ConversationStatus) ?? "open",
    pageUrl: (row.page_url as string | null) ?? null,
    referrer: (row.referrer as string | null) ?? null,
    userAgent: (row.user_agent as string | null) ?? null,
    lastMessageAt: toIso(row.last_message_at),
    unreadForAdmin: Boolean(row.unread_for_admin),
    createdAt: toIso(row.created_at),
  };
}

function mapMessage(row: Row): ChatMessage {
  return {
    id: String(row.id),
    conversationId: String(row.conversation_id),
    role: row.role as MessageRole,
    content: String(row.content ?? ""),
    escalated: Boolean(row.escalated),
    createdAt: toIso(row.created_at),
  };
}

/* -------------------------------------------------------------------------- */
/* Site content                                                               */
/* -------------------------------------------------------------------------- */

/** The bundled content.json, used whenever the database cannot answer. */
export const FALLBACK_SITE_CONTENT = fallbackContent as unknown as SiteContent;

/**
 * The live site content document.
 *
 * Order of preference: the `site_content` row, then the bundled
 * content.json. On the first successful read against an empty table the
 * bundled document is written back, so the admin panel starts from the same
 * content the site currently ships rather than from nothing.
 *
 * Never throws.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const sql = getSql();
  if (!sql) return FALLBACK_SITE_CONTENT;

  try {
    const rows = (await sql`
      SELECT data FROM site_content WHERE id = TRUE LIMIT 1
    `) as Row[];

    if (rows.length > 0 && rows[0].data) {
      return rows[0].data as SiteContent;
    }

    // Empty table: seed it from the bundled document.
    await sql`
      INSERT INTO site_content (id, data, updated_at)
      VALUES (TRUE, ${JSON.stringify(FALLBACK_SITE_CONTENT)}::jsonb, now())
      ON CONFLICT (id) DO NOTHING
    `;
    return FALLBACK_SITE_CONTENT;
  } catch (error) {
    console.error("[db] getSiteContent failed, using bundled content:", error);
    return FALLBACK_SITE_CONTENT;
  }
}

/**
 * Upsert the singleton content document. Throws when the write cannot happen —
 * the admin panel must never report a save that did not land.
 */
export async function saveSiteContent(
  data: SiteContent | Record<string, unknown>
): Promise<SiteContent> {
  const sql = requireSql("saving site content");

  const rows = (await sql`
    INSERT INTO site_content (id, data, updated_at)
    VALUES (TRUE, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data,
          updated_at = now()
    RETURNING data
  `) as Row[];

  return rows[0].data as SiteContent;
}

/** ISO timestamp of the last content save, or `null` if never saved. */
export async function getSiteContentUpdatedAt(): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  try {
    const rows = (await sql`
      SELECT updated_at FROM site_content WHERE id = TRUE LIMIT 1
    `) as Row[];
    return rows.length ? toIsoOrNull(rows[0].updated_at) : null;
  } catch (error) {
    console.error("[db] getSiteContentUpdatedAt failed:", error);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Chat settings                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Mirrors the column defaults in db/001_init.sql. Used when the database is
 * unreachable so the widget still renders with sane copy.
 */
export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  enabled: true,
  botName: "EdgeBrain Assistant",
  greeting:
    "Hi. Ask me anything about what we build, how we work, or what a project costs.",
  aiDisclosure:
    "You are chatting with our AI assistant. A human will step in when it cannot help.",
  promptExtra: "",
  model: "openai/gpt-oss-120b",
  temperature: 0.3,
  maxTokens: 700,
  fallbackMessage:
    "I am not certain enough to answer that accurately. Someone from the team will reply to you shortly.",
  notifyEmail: "edgebrainstudios@gmail.com",
  notifyOnEvery: false,
  accentColor: "#FFD400",
  updatedAt: null,
};

/** The singleton settings row, or `DEFAULT_CHAT_SETTINGS`. Never throws. */
export async function getChatSettings(): Promise<ChatSettings> {
  const sql = getSql();
  if (!sql) return DEFAULT_CHAT_SETTINGS;

  try {
    const rows = (await sql`
      SELECT * FROM chat_settings WHERE id = TRUE LIMIT 1
    `) as Row[];

    if (rows.length === 0) {
      await sql`INSERT INTO chat_settings (id) VALUES (TRUE)
                ON CONFLICT (id) DO NOTHING`;
      return DEFAULT_CHAT_SETTINGS;
    }
    return mapSettings(rows[0]);
  } catch (error) {
    console.error("[db] getChatSettings failed, using defaults:", error);
    return DEFAULT_CHAT_SETTINGS;
  }
}

/**
 * Partial update of the settings singleton.
 *
 * Every column is written as `COALESCE($n, column)`, so an omitted key leaves
 * the stored value alone and nothing is interpolated into SQL. Throws when the
 * database is unavailable.
 */
export async function saveChatSettings(
  partial: Partial<Omit<ChatSettings, "updatedAt">>
): Promise<ChatSettings> {
  const sql = requireSql("saving chat settings");

  const p = {
    enabled: partial.enabled ?? null,
    botName: partial.botName ?? null,
    greeting: partial.greeting ?? null,
    aiDisclosure: partial.aiDisclosure ?? null,
    promptExtra: partial.promptExtra ?? null,
    model: partial.model ?? null,
    temperature: partial.temperature ?? null,
    maxTokens: partial.maxTokens ?? null,
    fallbackMessage: partial.fallbackMessage ?? null,
    notifyEmail: partial.notifyEmail ?? null,
    notifyOnEvery: partial.notifyOnEvery ?? null,
    accentColor: partial.accentColor ?? null,
  };

  const rows = (await sql`
    INSERT INTO chat_settings (id) VALUES (TRUE)
    ON CONFLICT (id) DO UPDATE SET
      enabled          = COALESCE(${p.enabled}::boolean,  chat_settings.enabled),
      bot_name         = COALESCE(${p.botName}::text,     chat_settings.bot_name),
      greeting         = COALESCE(${p.greeting}::text,    chat_settings.greeting),
      ai_disclosure    = COALESCE(${p.aiDisclosure}::text, chat_settings.ai_disclosure),
      prompt_extra     = COALESCE(${p.promptExtra}::text, chat_settings.prompt_extra),
      model            = COALESCE(${p.model}::text,       chat_settings.model),
      temperature      = COALESCE(${p.temperature}::real, chat_settings.temperature),
      max_tokens       = COALESCE(${p.maxTokens}::integer, chat_settings.max_tokens),
      fallback_message = COALESCE(${p.fallbackMessage}::text, chat_settings.fallback_message),
      notify_email     = COALESCE(${p.notifyEmail}::text, chat_settings.notify_email),
      notify_on_every  = COALESCE(${p.notifyOnEvery}::boolean, chat_settings.notify_on_every),
      accent_color     = COALESCE(${p.accentColor}::text, chat_settings.accent_color),
      updated_at       = now()
    RETURNING *
  `) as Row[];

  return mapSettings(rows[0]);
}

/* -------------------------------------------------------------------------- */
/* Conversations                                                              */
/* -------------------------------------------------------------------------- */

export interface CreateConversationInput {
  name: string;
  email: string;
  pageUrl?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
}

/** Opens a conversation. Name and email are required by the schema. Throws. */
export async function createConversation(
  input: CreateConversationInput
): Promise<Conversation> {
  const sql = requireSql("creating a conversation");

  const name = input.name?.trim();
  const email = input.email?.trim();
  if (!name || !email) {
    throw new Error("createConversation requires a name and an email.");
  }

  const rows = (await sql`
    INSERT INTO chat_conversations
      (visitor_name, visitor_email, page_url, referrer, user_agent)
    VALUES
      (${name}, ${email}, ${input.pageUrl ?? null},
       ${input.referrer ?? null}, ${input.userAgent ?? null})
    RETURNING *
  `) as Row[];

  return mapConversation(rows[0]);
}

/** One conversation, or `null` if the id is unknown or malformed. Never throws. */
export async function getConversation(
  id: string
): Promise<Conversation | null> {
  const sql = getSql();
  if (!sql || !id || !isUuid(id)) return null;

  try {
    const rows = (await sql`
      SELECT * FROM chat_conversations WHERE id = ${id} LIMIT 1
    `) as Row[];
    return rows.length ? mapConversation(rows[0]) : null;
  } catch (error) {
    console.error("[db] getConversation failed:", error);
    return null;
  }
}

export interface ListConversationsInput {
  status?: ConversationStatus;
  limit?: number;
  offset?: number;
}

/**
 * The admin inbox query: newest activity first, optionally filtered by status.
 * Returns `[]` rather than throwing.
 */
export async function listConversations(
  input: ListConversationsInput = {}
): Promise<Conversation[]> {
  const sql = getSql();
  if (!sql) return [];

  const limit = clampInt(input.limit, 50, 200) || 50;
  const offset = clampInt(input.offset, 0, 100_000);

  try {
    const rows = (input.status
      ? await sql`
          SELECT * FROM chat_conversations
           WHERE status = ${input.status}
           ORDER BY last_message_at DESC
           LIMIT ${limit} OFFSET ${offset}
        `
      : await sql`
          SELECT * FROM chat_conversations
           ORDER BY last_message_at DESC
           LIMIT ${limit} OFFSET ${offset}
        `) as Row[];

    return rows.map(mapConversation);
  } catch (error) {
    console.error("[db] listConversations failed:", error);
    return [];
  }
}

/** Moves a thread between open / needs_human / closed. Throws. */
export async function setConversationStatus(
  id: string,
  status: ConversationStatus
): Promise<Conversation | null> {
  const sql = requireSql("updating a conversation status");
  if (!isUuid(id)) return null;

  const rows = (await sql`
    UPDATE chat_conversations
       SET status = ${status}
     WHERE id = ${id}
     RETURNING *
  `) as Row[];

  return rows.length ? mapConversation(rows[0]) : null;
}

/** Clears the unread badge when the owner opens a thread. Throws. */
export async function markRead(id: string): Promise<void> {
  const sql = requireSql("marking a conversation read");
  if (!isUuid(id)) return;

  await sql`
    UPDATE chat_conversations
       SET unread_for_admin = FALSE
     WHERE id = ${id}
  `;
}

/** Threads waiting on the owner. Excludes closed threads. Returns 0 on failure. */
export async function unreadCount(): Promise<number> {
  const sql = getSql();
  if (!sql) return 0;

  try {
    const rows = (await sql`
      SELECT COUNT(*)::int AS count
        FROM chat_conversations
       WHERE unread_for_admin = TRUE
         AND status <> 'closed'
    `) as Row[];
    return Number(rows[0]?.count ?? 0);
  } catch (error) {
    console.error("[db] unreadCount failed:", error);
    return 0;
  }
}

/* -------------------------------------------------------------------------- */
/* Messages                                                                   */
/* -------------------------------------------------------------------------- */

export interface AddMessageInput {
  conversationId: string;
  role: MessageRole;
  content: string;
  escalated?: boolean;
}

/**
 * Appends one message.
 *
 * `chat_conversations.last_message_at` and `unread_for_admin` are maintained by
 * the `chat_messages_touch` trigger — do not update them here. Throws.
 */
export async function addMessage(
  input: AddMessageInput
): Promise<ChatMessage> {
  const sql = requireSql("adding a message");

  if (!isUuid(input.conversationId)) {
    throw new Error(`addMessage: "${input.conversationId}" is not a conversation id.`);
  }
  const content = input.content?.trim();
  if (!content) {
    throw new Error("addMessage: content cannot be empty.");
  }

  const rows = (await sql`
    INSERT INTO chat_messages (conversation_id, role, content, escalated)
    VALUES (${input.conversationId}, ${input.role}, ${content},
            ${input.escalated ?? false})
    RETURNING *
  `) as Row[];

  return mapMessage(rows[0]);
}

/** The full transcript, oldest first. Returns `[]` rather than throwing. */
export async function getMessages(
  conversationId: string
): Promise<ChatMessage[]> {
  const sql = getSql();
  if (!sql || !conversationId || !isUuid(conversationId)) return [];

  try {
    const rows = (await sql`
      SELECT * FROM chat_messages
       WHERE conversation_id = ${conversationId}
       ORDER BY created_at ASC
    `) as Row[];
    return rows.map(mapMessage);
  } catch (error) {
    console.error("[db] getMessages failed:", error);
    return [];
  }
}

/** Deletes a conversation and, by cascade, its messages. Throws. */
export async function deleteConversation(id: string): Promise<void> {
  const sql = requireSql("deleting a conversation");
  if (!isUuid(id)) return;
  await sql`DELETE FROM chat_conversations WHERE id = ${id}`;
}
