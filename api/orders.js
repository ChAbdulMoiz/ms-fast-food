export const config = {
  runtime: "edge",
};

let orders = [];

export default async function handler(req) {
  const { method } = req;
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  if (method === "GET") {
    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  if (method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    if (!body || !Array.isArray(body.items)) {
      return new Response(JSON.stringify({ error: "Invalid order payload" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const id = "ord-" + Date.now();
    const order = {
      id,
      createdAt: body.createdAt || new Date().toISOString(),
      customerName: body.customerName || "",
      customerPhone: body.customerPhone || "",
      customerAddress: body.customerAddress || "",
      notes: body.notes || "",
      lat: body.lat || null,
      lng: body.lng || null,
      items: body.items || [],
      totalAmount: body.totalAmount || 0,
      paymentMethod: body.paymentMethod || "Cash on Delivery",
      status: body.status || "Pending",
    };

    orders.unshift(order);

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 201,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  if (method === "PUT") {
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    orders[idx] = { ...orders[idx], ...body };

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  if (method === "DELETE") {
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    orders = orders.filter((o) => o.id !== id);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
