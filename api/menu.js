let menuData = {
  "Shawarma": [
    { id: "shawarma-large", name: "Chicken Shawarma (Large)", price: 150, available: true, description: "Big size wrap, full of flavour and juicy chicken.", tags: ["Street Favourite"] },
    { id: "shawarma-medium", name: "Chicken Shawarma (Medium)", price: 120, available: true, description: "Perfect solo snack size.", tags: ["Value"] },
    { id: "shawarma-regular", name: "Chicken Shawarma (Regular)", price: 200, available: true, description: "Classic loaded shawarma, saucy & satisfying.", tags: ["Best Seller"] },
    { id: "shawarma-special", name: "Chicken Shawarma (Special)", price: 230, available: true, description: "Extra filling, extra sauce – full meal feel.", tags: ["Hungry Special"] },
    { id: "shawarma-cheese", name: "Cheese Shawarma", price: 200, available: true, description: "Creamy cheese inside, toasted outside.", tags: ["Cheesy"] },
    { id: "shawarma-zinger", name: "Zinger Shawarma", price: 350, available: true, description: "Crispy zinger style chicken with house sauce.", tags: ["Crispy"] },
    { id: "shawarma-p", name: "P. Shawarma", price: 350, available: true, description: "Platter style or premium style (owner define kare).", tags: ["Premium"] },
    { id: "shawarma-p-cheese", name: "P. Cheese Shawarma", price: 400, available: true, description: "Premium + cheese overload, heavy hunger killer.", tags: ["Premium","Cheesy"] }
  ],
  "Fries & Snacks": [
    { id: "fries-plain", name: "Plain Fries", price: 120, available: true, description: "Crispy fries, perfect side for any meal.", tags: ["Crispy"] },
    { id: "fries-mayo", name: "Mayo Fries", price: 150, available: true, description: "Fries topped with mayo and sauce.", tags: ["Popular"] }
  ]
};

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json(menuData);
  }

  if (req.method === "PUT") {
    try {
      const newMenu = req.body;
      if (!newMenu || typeof newMenu !== "object") {
        return res.status(400).json({ error: "Invalid menu data" });
      }
      menuData = newMenu;
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "Failed to update menu" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
