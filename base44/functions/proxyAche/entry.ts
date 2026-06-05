import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const apiPath = body.path || "";
    const method = body.method || "GET";
    const payload = body.payload || null;

    const acheUrl = Deno.env.get("ACHE_ENDPOINT_URL");
    if (!acheUrl) {
      return Response.json({ error: 'ACHE_ENDPOINT_URL not configured' }, { status: 500 });
    }

    const url = `${acheUrl.replace(/\/$/, "")}/${apiPath.replace(/^\//, "")}`;

    const fetchOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Source-App": "iZulu-Sentinel",
      },
    };

    if (payload && method !== "GET") {
      fetchOptions.body = JSON.stringify(payload);
    }

    const res = await fetch(url, fetchOptions);
    let data;
    try {
      data = await res.json();
    } catch {
      data = { raw: await res.text() };
    }

    return Response.json({ status: res.status, data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});