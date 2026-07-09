// Minimal in-memory stand-in for the Supabase Auth + REST API, used only by
// Playwright E2E tests (apps/web/e2e). It never talks to the real Supabase
// project, and does not touch RLS, Storage policies, or the database schema.
//
// It implements just enough of the Auth (`/auth/v1/user`) and PostgREST
// (`/rest/v1/cards`) surface for this app's existing code paths (proxy.ts,
// lib/supabase/*, the dashboard/edit Server Actions, and the public profile
// route) to work unmodified against a fake backend.
import http from "node:http";

const FAKE_USER = {
  id: "00000000-0000-4000-8000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "e2e@example.com",
  phone: "",
  app_metadata: { provider: "google", providers: ["google"] },
  user_metadata: {
    avatar_url: "https://placehold.co/200x200",
    full_name: "E2E Test User",
    email: "e2e@example.com",
    email_verified: true,
  },
  identities: [],
  is_anonymous: false,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  confirmed_at: "2026-01-01T00:00:00.000Z",
  email_confirmed_at: "2026-01-01T00:00:00.000Z",
  last_sign_in_at: "2026-01-01T00:00:00.000Z",
};

const FAKE_ACCESS_TOKEN = "e2e-fake-access-token";

let cards = [];
let nextId = 1;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function parseFilters(searchParams) {
  const filters = [];
  let select = "*";
  let order = null;

  for (const [key, value] of searchParams.entries()) {
    if (key === "select") {
      select = value;
    } else if (key === "order") {
      const [column, direction] = value.split(".");
      order = { column, direction };
    } else if (key === "limit" || key === "offset") {
      // Not used by this app's queries; ignored.
    } else if (value.startsWith("eq.")) {
      filters.push({ column: key, value: value.slice(3) });
    }
  }

  return { filters, select, order };
}

function matchesFilters(row, filters) {
  return filters.every(({ column, value }) => String(row[column]) === value);
}

function sendJson(res, status, body) {
  const payload = body === undefined ? "" : JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
    ...corsHeaders(),
  });
  res.end(payload);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, apikey, content-type, prefer, accept, accept-profile, content-profile, x-client-info",
  };
}

function wantsSingleObject(req) {
  const accept = req.headers["accept"] || "";
  return accept.includes("vnd.pgrst.object");
}

function wantsRepresentation(req) {
  const prefer = req.headers["prefer"] || "";
  return prefer.includes("return=representation");
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  // Health check used by Playwright's webServer readiness probe.
  if (url.pathname === "/" && req.method === "GET") {
    sendJson(res, 200, { ok: true });
    return;
  }

  // --- Test-only admin endpoints (never part of the real Supabase API) ---
  if (url.pathname === "/__e2e__/reset" && req.method === "POST") {
    cards = [];
    nextId = 1;
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url.pathname === "/__e2e__/seed" && req.method === "POST") {
    const body = (await readBody(req)) || {};
    const row = {
      id: body.id || `seed-${nextId++}`,
      owner_id: body.owner_id || FAKE_USER.id,
      public_id: body.public_id || `SEED${nextId}`,
      profile_type: body.profile_type || "personal",
      status: body.status || "active",
      is_public: body.is_public ?? true,
      title: body.title ?? "Hồ sơ mới",
      display_name: body.display_name ?? null,
      job_title: body.job_title ?? null,
      company: body.company ?? null,
      bio: body.bio ?? null,
      avatar_url: body.avatar_url ?? null,
      phone: body.phone ?? null,
      email: body.email ?? null,
      website: body.website ?? null,
      facebook: body.facebook ?? null,
      tiktok: body.tiktok ?? null,
      youtube: body.youtube ?? null,
      instagram: body.instagram ?? null,
      linkedin: body.linkedin ?? null,
      github: body.github ?? null,
      address: body.address ?? null,
      created_at: body.created_at || new Date().toISOString(),
    };
    cards.push(row);
    sendJson(res, 201, row);
    return;
  }

  // --- Auth: GET /auth/v1/user ---
  if (url.pathname === "/auth/v1/user" && req.method === "GET") {
    const authHeader = req.headers["authorization"] || "";
    if (authHeader === `Bearer ${FAKE_ACCESS_TOKEN}`) {
      sendJson(res, 200, FAKE_USER);
    } else {
      sendJson(res, 401, { code: 401, msg: "invalid token", error_code: "bad_jwt" });
    }
    return;
  }

  // --- PostgREST: /rest/v1/cards ---
  if (url.pathname === "/rest/v1/cards") {
    const { filters, order } = parseFilters(url.searchParams);

    if (req.method === "GET") {
      let rows = cards.filter((row) => matchesFilters(row, filters));
      if (order) {
        rows = rows.slice().sort((a, b) => {
          const dir = order.direction === "desc" ? -1 : 1;
          return a[order.column] > b[order.column] ? dir : -dir;
        });
      }

      if (wantsSingleObject(req)) {
        if (rows.length !== 1) {
          sendJson(res, 406, {
            code: "PGRST116",
            details: `Results contain ${rows.length} rows`,
            hint: null,
            message: "JSON object requested, multiple (or no) rows returned",
          });
          return;
        }
        sendJson(res, 200, rows[0]);
        return;
      }

      sendJson(res, 200, rows);
      return;
    }

    if (req.method === "POST") {
      const body = await readBody(req);
      const rowsToInsert = Array.isArray(body) ? body : [body];
      const inserted = rowsToInsert.map((row) => ({
        id: row.id || `card-${nextId++}`,
        created_at: row.created_at || new Date().toISOString(),
        ...row,
      }));
      cards.push(...inserted);
      if (wantsRepresentation(req)) {
        sendJson(res, 201, inserted);
      } else {
        res.writeHead(201, corsHeaders());
        res.end();
      }
      return;
    }

    if (req.method === "PATCH") {
      const body = (await readBody(req)) || {};
      const updated = [];
      cards = cards.map((row) => {
        if (matchesFilters(row, filters)) {
          const merged = { ...row, ...body };
          updated.push(merged);
          return merged;
        }
        return row;
      });
      if (wantsRepresentation(req)) {
        sendJson(res, 200, updated);
      } else {
        res.writeHead(204, corsHeaders());
        res.end();
      }
      return;
    }

    if (req.method === "DELETE") {
      const remaining = [];
      const deleted = [];
      for (const row of cards) {
        if (matchesFilters(row, filters)) {
          deleted.push(row);
        } else {
          remaining.push(row);
        }
      }
      cards = remaining;
      if (wantsRepresentation(req)) {
        sendJson(res, 200, deleted);
      } else {
        res.writeHead(204, corsHeaders());
        res.end();
      }
      return;
    }
  }

  sendJson(res, 404, { message: "Not found in mock server", path: url.pathname });
});

const port = Number(process.env.PORT || 4310);
server.listen(port, "127.0.0.1", () => {
  console.log(`mock-supabase listening on http://127.0.0.1:${port}`);
});
