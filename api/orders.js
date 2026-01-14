// api/orders.js
export const config = {
  runtime: "edge",
};

// In-memory order store (resets on cold start)
let orders = [];

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default async function handler(req) {
  const { method } = req;
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (method === "OPTIONS") {
    return jsonResponse(null, 200);
  }

  if (method === "GET") {
    // List all orders (latest first, we always unshift)
    return jsonResponse(orders, 200);
  }

  if (method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }

    if (!body || typeof body !== "object") {
      return jsonResponse({ error: "Invalid order data" }, 400);
    }

    const {
      customerName = "",
      customerPhone = "",
      customerAddress = "",
      notes = "",
      lat = null,
      lng = null,
      paymentMethod = "Cash on Delivery",
      items = [],
      totalAmount = 0,
      status = "Pending",
      createdAt,
    } = body;

    const order = {
      id: crypto.randomUUID(),
      customerName: String(customerName),
      customerPhone: String(customerPhone),
      customerAddress: String(customerAddress),
      notes: String(notes),
      lat: lat === null || lat === undefined || lat === "" ? null : String(lat),
      lng: lng === null || lng === undefined || lng === "" ? null : String(lng),
      paymentMethod: String(paymentMethod),
      items: Array.isArray(items) ? items : [],
      totalAmount: Number(totalAmount) || 0,
      status: String(status || "Pending"), // "Pending" / "Confirmed"
      createdAt: createdAt || new Date().toISOString(),
    };

    orders.unshift(order);
    return jsonResponse(order, 201);
  }

  if (method === "PUT") {
    if (!id) return jsonResponse({ error: "Missing id" }, 400);

    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }

    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return jsonResponse({ error: "Order not found" }, 404);

    if (body.status) {
      orders[idx].status = String(body.status);
    }

    return jsonResponse({ ok: true, order: orders[idx] }, 200);
  }

  if (method === "DELETE") {
    if (!id) return jsonResponse({ error: "Missing id" }, 400);
    const before = orders.length;
    orders = orders.filter(o => o.id !== id);
    if (orders.length === before) {
      return jsonResponse({ error: "Order not found" }, 404);
    }
    return jsonResponse({ ok: true }, 200);
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}
