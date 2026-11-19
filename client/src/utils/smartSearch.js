const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "for",
  "with",
  "and",
  "or",
  "in",
  "on",
  "at",
  "to",
  "of",
  "by",
  "from",
  "is",
  "are",
  "best",
  "top",
  "good",
  "new",
  "buy",
  "price",
  "cost",
  "rate",
  "offer",
  "need",
  "want",
  "looking",
  "search",
  "find",
  "show",
  "me",
  "battery",
  "batteries",
  "pernambut",
]);

// Normalize multi-word phrases so "2 bhk", "2-bhk", and "2bhk" match identically
export const normalizeSearchText = (text) => {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/['’".,/\\()[\]{}:;!?+-]/g, " ")
    .replace(/\b([1-5])\s*bhk\b/g, "$1bhk")
    .replace(/\b(\d+)\s*ah\b/g, "$1ah")
    .replace(/\b(\d+)\s*v(?:olt|olts)?\b/g, "$1v")
    .replace(/\b(\d+)\s*va\b/g, "$1va")
    .replace(/\b(two|2)\s*wheeler(?:s)?\b/g, "twowheeler")
    .replace(/\b(three|3)\s*wheeler(?:s)?\b/g, "threewheeler")
    .replace(/\b(four|4)\s*wheeler(?:s)?\b/g, "fourwheeler")
    .replace(/\blife\s*po4\b/g, "lifepo4")
    .replace(/\s+/g, " ")
    .trim();
};

// Map customer intent tokens to related categories, tags, and ideal Ah ranges
const INTENT_RULES = {
  "1bhk": {
    tags: ["1bhk", "1 bhk", "small home", "flat"],
    categories: ["Inverter Batteries", "Lithium Batteries", "Combo Home Inverter & Batteries"],
    minAh: 100,
    maxAh: 160,
  },
  "2bhk": {
    tags: ["2bhk", "2 bhk", "medium home", "home"],
    categories: ["Inverter Batteries", "Lithium Batteries", "Combo Home Inverter & Batteries"],
    minAh: 135,
    maxAh: 220,
  },
  "3bhk": {
    tags: ["3bhk", "3 bhk", "large home", "villa", "duplex"],
    categories: ["Inverter Batteries", "Lithium Batteries", "Combo Home Inverter & Batteries"],
    minAh: 180,
    maxAh: 300,
  },
  "4bhk": {
    tags: ["4bhk", "4 bhk", "villa", "duplex", "commercial"],
    categories: ["Inverter Batteries", "Lithium Batteries", "Combo Home Inverter & Batteries"],
    minAh: 200,
    maxAh: 400,
  },
  home: {
    tags: ["1bhk", "2bhk", "3bhk", "home", "house", "flat"],
    categories: ["Inverter Batteries", "Lithium Batteries", "Combo Home Inverter & Batteries", "Home Inverter"],
  },
  shop: {
    tags: ["shop", "shops", "office", "commercial", "store"],
    categories: ["Inverter Batteries", "Lithium Batteries", "Combo Home Inverter & Batteries"],
    minAh: 150,
    maxAh: 300,
  },
  office: {
    tags: ["office", "shop", "commercial", "computer"],
    categories: ["Inverter Batteries", "Lithium Batteries", "Combo Home Inverter & Batteries"],
    minAh: 150,
    maxAh: 300,
  },
  combo: {
    tags: ["combo", "set", "inverter & battery", "inverter and battery"],
    categories: ["Combo Home Inverter & Batteries"],
  },
  lithium: {
    tags: ["lithium", "lifepo4", "li ion", "li-ion"],
    categories: ["Lithium Batteries"],
  },
  lifepo4: {
    tags: ["lithium", "lifepo4"],
    categories: ["Lithium Batteries"],
  },
  inverter: {
    tags: ["inverter", "tubular", "ups", "backup"],
    categories: ["Inverter Batteries", "Home Inverter", "Combo Home Inverter & Batteries"],
  },
  tubular: {
    tags: ["tubular", "tall tubular", "inverter"],
    categories: ["Inverter Batteries"],
  },
  bike: {
    tags: ["twowheeler", "bike", "scooter", "motorcycle", "scooty"],
    categories: ["Two Wheeler"],
  },
  scooter: {
    tags: ["twowheeler", "scooter", "scooty", "activa", "jupiter"],
    categories: ["Two Wheeler"],
  },
  scooty: {
    tags: ["twowheeler", "scooter", "scooty", "activa"],
    categories: ["Two Wheeler"],
  },
  twowheeler: {
    tags: ["twowheeler", "bike", "scooter"],
    categories: ["Two Wheeler"],
  },
  auto: {
    tags: ["threewheeler", "auto", "rickshaw", "e rickshaw", "ape"],
    categories: ["Three Wheeler"],
  },
  rickshaw: {
    tags: ["threewheeler", "auto", "rickshaw"],
    categories: ["Three Wheeler"],
  },
  threewheeler: {
    tags: ["threewheeler", "auto", "rickshaw"],
    categories: ["Three Wheeler"],
  },
  car: {
    tags: ["car", "fourwheeler", "suv", "sedan", "hatchback"],
    categories: ["Car"],
  },
  fourwheeler: {
    tags: ["car", "fourwheeler", "suv", "sedan"],
    categories: ["Car"],
  },
};

export const smartSearchProducts = (products = [], rawQuery = "") => {
  const normalizedQuery = normalizeSearchText(rawQuery);
  if (!normalizedQuery) return products;

  const rawTokens = normalizedQuery.split(" ").filter(Boolean);
  const meaningfulTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));
  const tokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

  const scored = products
    .map((product) => {
      const nameNorm = normalizeSearchText(product.name);
      const brandNorm = normalizeSearchText(product.brand);
      const categoryNorm = normalizeSearchText(product.category);
      const subCategoryNorm = normalizeSearchText(product.subCategory);
      const skuNorm = normalizeSearchText(product.sku);
      const typeNorm = normalizeSearchText(product.batteryType);
      const warrantyNorm = normalizeSearchText(product.warranty);
      const ahString = product.ahCapacity > 0 ? `${product.ahCapacity}ah` : "";

      const suitableArr = Array.isArray(product.suitableFor) ? product.suitableFor : [];
      const suitableNorm = normalizeSearchText(suitableArr.join(" "));

      const vehiclesArr = Array.isArray(product.compatibleVehicles)
        ? product.compatibleVehicles.map((v) =>
            typeof v === "string" ? v : `${v.make || ""} ${v.model || ""}`
          )
        : [];
      const vehiclesNorm = normalizeSearchText(vehiclesArr.join(" "));

      const prosNorm = normalizeSearchText(
        Array.isArray(product.pros) ? product.pros.join(" ") : ""
      );
      const descNorm = normalizeSearchText(product.description);

      const fullCorpus = [
        nameNorm,
        brandNorm,
        categoryNorm,
        subCategoryNorm,
        skuNorm,
        typeNorm,
        ahString,
        suitableNorm,
        vehiclesNorm,
        prosNorm,
        descNorm,
      ].join(" ");

      let score = 0;
      let matchedTokens = 0;

      // Exact phrase match bonus
      if (normalizedQuery.length >= 3 && fullCorpus.includes(normalizedQuery)) {
        score += 45;
      }

      for (const token of tokens) {
        let tokenScore = 0;

        // Direct field matches
        if (brandNorm.includes(token)) tokenScore += 35;
        if (nameNorm.includes(token)) tokenScore += 30;
        if (suitableNorm.includes(token)) tokenScore += 35;
        if (categoryNorm.includes(token) || subCategoryNorm.includes(token)) tokenScore += 25;
        if (ahString === token || skuNorm.includes(token) || typeNorm.includes(token)) {
          tokenScore += 25;
        }
        if (vehiclesNorm.includes(token)) tokenScore += 30;
        if (warrantyNorm.includes(token)) tokenScore += 12;
        if (prosNorm.includes(token) || descNorm.includes(token)) tokenScore += 10;

        // Intent & synonym expansion (e.g., "2bhk", "bike", "shop", "combo")
        const intent = INTENT_RULES[token];
        if (intent) {
          if (intent.categories?.includes(product.category)) {
            tokenScore += 22;
          }
          if (
            intent.tags?.some(
              (tag) => suitableNorm.includes(tag) || nameNorm.includes(tag) || descNorm.includes(tag)
            )
          ) {
            tokenScore += 25;
          }
          const cap = Number(product.ahCapacity) || 0;
          if (
            intent.minAh &&
            intent.maxAh &&
            cap >= intent.minAh &&
            cap <= intent.maxAh &&
            intent.categories?.includes(product.category)
          ) {
            tokenScore += 18;
          }
        }

        if (tokenScore > 0) {
          matchedTokens += 1;
          score += tokenScore;
        }
      }

      // Bonus when all search terms match
      if (matchedTokens === tokens.length && tokens.length > 1) {
        score += 25;
      }

      // Slight priority for in-stock items when relevance ties
      const available = product.availableStock ?? product.currentStock ?? 0;
      if (score > 0 && available > 0) {
        score += 4;
      }

      return { product, score };
    })
    .filter((entry) => entry.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.product);
};