/**
 * CORS proxy for MindBreaker Prompt Generator (思维破壁机).
 *
 * Lets the browser app call AI providers that do NOT send CORS headers
 * (e.g. MiniMax / Kimi-Moonshot official APIs). The app sends the real
 * upstream URL in the `X-Target-Url` header; this Worker forwards the
 * request and returns the response with permissive CORS headers.
 *
 * ── Deploy (free, ~2 minutes) ─────────────────────────────────────────
 * Option A — Dashboard:
 *   1. https://dash.cloudflare.com  →  Workers & Pages  →  Create  →  Worker
 *   2. Replace the default code with this file's contents, click Deploy.
 *   3. Copy the Worker URL (e.g. https://xxx.your-name.workers.dev).
 *   4. Paste it into the app: 设置 / API → 代理地址 Proxy URL.
 *
 * Option B — Wrangler CLI:
 *   npm i -g wrangler && wrangler login
 *   wrangler deploy proxy/cloudflare-worker.js --name mindbreaker-proxy
 *
 * ── Security ──────────────────────────────────────────────────────────
 * This proxy passes the caller's Authorization header straight through; it
 * never stores your API key. For a private setup, restrict ALLOW_ORIGINS
 * (below) to your own site, or add your own auth check.
 */

// Set to ["*"] to allow any origin, or list specific origins, e.g.
// ["https://lukasgao001.github.io", "http://localhost:8080"].
const ALLOW_ORIGINS = ["*"];

// Optional allowlist of upstream hosts the proxy may forward to.
// Leave empty [] to allow any host.
const ALLOW_TARGET_HOSTS = [
  "api.minimax.io",
  "api.minimax.chat",
  "api.moonshot.cn",
  "api.moonshot.ai",
  "api.openai.com",
  "openrouter.ai",
];

function corsHeaders(origin) {
  const allowed = ALLOW_ORIGINS.includes("*")
    ? "*"
    : (ALLOW_ORIGINS.includes(origin) ? origin : ALLOW_ORIGINS[0] || "*");
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Target-Url, HTTP-Referer, X-Title",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Only POST is supported" }, 405, cors);
    }

    const target = request.headers.get("X-Target-Url");
    if (!target) {
      return json({ error: "Missing X-Target-Url header" }, 400, cors);
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch (e) {
      return json({ error: "Invalid X-Target-Url" }, 400, cors);
    }
    if (ALLOW_TARGET_HOSTS.length && !ALLOW_TARGET_HOSTS.includes(targetUrl.hostname)) {
      return json({ error: "Target host not allowed: " + targetUrl.hostname }, 403, cors);
    }

    const fwdHeaders = { "Content-Type": "application/json" };
    const auth = request.headers.get("Authorization");
    if (auth) fwdHeaders["Authorization"] = auth;
    const ref = request.headers.get("HTTP-Referer");
    if (ref) fwdHeaders["HTTP-Referer"] = ref;
    const title = request.headers.get("X-Title");
    if (title) fwdHeaders["X-Title"] = title;

    const body = await request.text();

    let upstream;
    try {
      upstream = await fetch(targetUrl.toString(), { method: "POST", headers: fwdHeaders, body });
    } catch (e) {
      return json({ error: "Upstream fetch failed: " + e.message }, 502, cors);
    }

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json", ...cors },
    });
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
