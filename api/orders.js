let orders = [];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    // Owner portal: get all orders
    return res.status(200).json(orders);
  }

  if (req.method === "POST") {
    // New order from customer
    const body = req.body;
    if (!body || !Array.isArray(body.items)) {
      return res.status(400).json({ error: "Invalid order payload" });
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
      status: body.status || "Pending"
    };

    orders.unshift(order);
    return res.status(201).json({ ok: true, id });
  }

  if (req.method === "PUT") {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: "Order not found" });

    const update = req.body || {};
    orders[idx] = { ...orders[idx], ...update };
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    orders = orders.filter(o => o.id !== id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
