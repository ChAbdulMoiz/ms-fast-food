// api/menu.js
export const config = {
  runtime: "edge",
};

// In-memory menu store (resets on each cold start)
let menuData = {
  "Shawarma": [
    {
      id: "shawarma-large",
      name: "Chicken Shawarma (Large)",
      price: 150,
      available: true,
      description: "Big size wrap, full of flavour and juicy chicken.",
      tags: ["Street Favourite"],
    },
    {
      id: "shawarma-medium",
      name: "Chicken Shawarma (Medium)",
      price: 120,
      available: true,
      description: "Perfect solo snack size.",
      tags: ["Value"],
    },
    {
      id: "shawarma-regular",
      name: "Chicken Shawarma (Regular)",
      price: 200,
      available: true,
      description: "Classic loaded shawarma, saucy & satisfying.",
      tags: ["Best Seller"],
    },
    {
      id: "shawarma-special",
      name: "Chicken Shawarma (Special)",
      price: 230,
      available: true,
      description: "Extra filling, extra sauce – full meal feel.",
      tags: ["Hungry Special"],
    },
    {
      id: "shawarma-cheese",
      name: "Cheese Shawarma",
      price: 200,
      available: true,
      description: "Creamy cheese inside, toasted outside.",
      tags: ["Cheesy"],
    },
    {
      id: "shawarma-zinger",
      name: "Zinger Shawarma",
      price: 350,
      available: true,
      description: "Crispy zinger style chicken with house sauce.",
      tags: ["Crispy"],
    },
    {
      id: "shawarma-p",
      name: "P. Shawarma",
      price: 350,
      available: true,
      description: "Platter style or premium style (owner define kare).",
      tags: ["Premium"],
    },
    {
      id: "shawarma-p-cheese",
      name: "P. Cheese Shawarma",
      price: 400,
      available: true,
      description: "Premium + cheese overload, heavy hunger killer.",
      tags: ["Premium", "Cheesy"],
    },
  ],
  "Fries & Snacks": [
    {
      id: "fries-plain",
      name: "Plain Fries",
      price: 120,
      available: true,
      description: "Crispy fries, perfect side for any meal.",
      tags: ["Crispy"],
    },
    {
      id: "fries-mayo",
      name: "Mayo Fries",
      price: 150,
      available: true,
      description: "Fries topped with mayo and sauce.",
      tags: ["Popular"],
    },
  ],
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default async function handler(req) {
  const { method } = req;

  if (method === "OPTIONS") {
    return jsonResponse(null, 200);
  }

  if (method === "GET") {
    // Return current menu
    return jsonResponse(menuData, 200);
  }

  if (method === "PUT") {
    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Invalid menu data" }, 400);
    }

    // Very light validation: ensure top-level is an object of arrays
    for (const key of Object.keys(body)) {
      if (!Array.isArray(body[key])) {
        return jsonResponse({ error: "Each category must be an array" }, 400);
      }
    }

    menuData = body;
    return jsonResponse({ ok: true }, 200);
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}
