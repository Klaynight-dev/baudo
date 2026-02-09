export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const headers = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json;charset=UTF-8"
    };

    // Répondre proprement aux preflights
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (url.pathname === "/api/subscribers") {
      if (!env.YOUTUBE_API_KEY || !env.CHANNEL_ID) {
        return new Response(JSON.stringify({ error: "Missing API key or channel ID" }), { status: 500, headers });
      }

      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${env.CHANNEL_ID}&key=${env.YOUTUBE_API_KEY}`;
        const resp = await fetch(apiUrl);

        // Si la Google API renvoie une erreur HTTP
        if (!resp.ok) {
          const text = await resp.text();
          return new Response(JSON.stringify({ error: "YouTube API responded with non-OK", status: resp.status, body: text }), { status: 502, headers });
        }

        const data = await resp.json();

        if (!data.items || !data.items[0] || !data.items[0].statistics) {
          return new Response(JSON.stringify({ error: "Invalid API response", details: data }), { status: 500, headers });
        }

        // subscriberCount peut être une string — on peut renvoyer en number
        const count = Number(data.items[0].statistics.subscriberCount || 0);

        return new Response(JSON.stringify({ subscriberCount: count }), { status: 200, headers });
      } catch (err) {
        return new Response(JSON.stringify({ error: "API error", details: err.message }), { status: 500, headers });
      }
    }

    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
  },
};
