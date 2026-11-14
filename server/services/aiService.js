/**
 * AI Battery Recommendation Service
 *
 * Modular design: the recommendation provider can be swapped.
 * Primary: Puter AI (via @heyputer/puter.js)
 * Fallback: Deterministic rule-based engine
 *
 * Never invents products, prices, stock or warranty.
 * All recommendations are validated against the actual product catalogue.
 */

import { init } from "@heyputer/puter.js/src/init.cjs";

let puter = null;
const puterEnabled =
  process.env.PUTER_AUTH_TOKEN && process.env.PUTER_AUTH_TOKEN.trim() !== "";

if (puterEnabled) {
  try {
    puter = init(process.env.PUTER_AUTH_TOKEN);
  } catch (err) {
    console.warn("Puter AI initialization failed, fallback will be used:", err.message);
    puter = null;
  }
}

/**
 * Rule-based fallback recommendation engine.
 * Filters the product catalogue by customer requirements and scores products.
 */
const ruleBasedRecommend = (products, requirements) => {
  const {
    application,
    budget,
    minAh,
    voltage,
    category,
    brandPreference,
  } = requirements;

  const now = new Date();

  let filtered = products.filter((p) => {
    if (!p.isActive) return false;
    if (category && p.category !== category) return false;
    if (voltage && p.voltage !== voltage) return false;
    if (brandPreference && !p.brand.toLowerCase().includes(brandPreference.toLowerCase()))
      return false;

    // Ah capacity filter based on application
    if (minAh && p.ahCapacity < minAh) return false;

    return true;
  });

  if (filtered.length === 0) {
    // widen search: ignore ah filter
    filtered = products.filter((p) => {
      if (!p.isActive) return false;
      if (category && p.category !== category) return false;
      if (voltage && p.voltage !== voltage) return false;
      return true;
    });
  }

  // Score each product
  const scored = filtered.map((p) => {
    let score = 0;

    // Budget fit: closer to budget without exceeding gets higher score
    if (budget) {
      if (p.sellingPrice <= budget) score += 30;
      else score += 10;
    }

    // Prefer in-stock
    const available = p.availableStock;
    if (available > 0) score += 25;
    else if (p.supplierAvailable) score += 10;

    // Newer warranty (parse years)
    const warrantyMatch = p.warranty.match(/(\d+)/);
    const warrantyYears = warrantyMatch ? parseInt(warrantyMatch[1], 10) : 0;
    score += warrantyYears * 2;

    // Ah sufficiency
    if (minAh && p.ahCapacity >= minAh) score += 15;

    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const categorize = (price, budget) => {
    if (!budget) return "Best Value";
    if (price <= budget * 0.6) return "Budget Friendly";
    if (price <= budget) return "Best Value";
    return "Premium Choice";
  };

  const buildRecommendation = ({ product, score }, index, budget) => {
    const available = product.availableStock;
    let availabilityStatus;
    if (available > 0) {
      availabilityStatus = "In Stock";
    } else if (product.supplierAvailable) {
      availabilityStatus = "Available on Order";
    } else {
      availabilityStatus = "Out of Stock";
    }

    const pros = product.pros && product.pros.length ? product.pros : ["Reliable performance", "Trusted brand"];
    const cons = product.cons && product.cons.length ? product.cons : ["Higher price point"];

    return {
      id: index + 1,
      productName: product.name,
      modelCode: product.sku,
      brand: product.brand,
      capacity: `${product.ahCapacity}Ah`,
      voltage: `${product.voltage}V`,
      warranty: product.warranty,
      price: product.sellingPrice,
      availabilityStatus,
      availableStock: available,
      supplierAvailable: product.supplierAvailable,
      advantages: pros,
      disadvantages: cons,
      reason:
        index === 0
          ? "Best overall match for your requirements and budget."
          : "Strong alternative with good specifications.",
      category: categorize(product.sellingPrice, budget),
      score,
    };
  };

  const budgetFriendly = scored
    .filter((s) => categorize(s.product.sellingPrice, budget) === "Budget Friendly")
    .slice(0, 3)
    .map((s, i) => buildRecommendation(s, i, budget));

  const bestValue = scored
    .filter((s) => categorize(s.product.sellingPrice, budget) === "Best Value")
    .slice(0, 3)
    .map((s, i) => buildRecommendation(s, i, budget));

  const premiumChoice = scored
    .filter((s) => categorize(s.product.sellingPrice, budget) === "Premium Choice")
    .slice(0, 3)
    .map((s, i) => buildRecommendation(s, i, budget));

  return {
    source: "rule-based-fallback",
    recommendations: {
      budgetFriendly,
      bestValue,
      premiumChoice,
    },
    disclaimer:
      "Recommendations are generated using a rule-based engine. Puter AI is unavailable.",
  };
};

/**
 * Build the prompt sent to Puter AI.
 */
const buildPrompt = (products, requirements) => {
  const catalogue = products
    .filter((p) => p.isActive)
    .map(
      (p) =>
        `- ${p.name} | SKU: ${p.sku} | Brand: ${p.brand} | Category: ${p.category} | ${p.ahCapacity}Ah | ${p.voltage}V | Type: ${p.batteryType} | Warranty: ${p.warranty} | Price: ₹${p.sellingPrice} | Stock: ${p.availableStock} available (supplier: ${p.supplierAvailable ? "yes" : "no"}) | Pros: ${(p.pros || []).join(", ")} | Cons: ${(p.cons || []).join(", ")}`
    )
    .join("\n");

  return `
You are an expert battery sales consultant for AutoHome Batteries.

Customer requirements:
${JSON.stringify(requirements, null, 2)}

Available product catalogue (DO NOT invent any product outside this list):
${catalogue}

Rules:
1. Recommend only products that exist in the catalogue above. Never invent products, prices, stock, or warranty.
2. Consider: application, technical compatibility, capacity (Ah), voltage, battery type, warranty, budget, available stock, supplier availability, price differences.
3. Distinguish physical shop stock from supplier availability. If stock is 0 but supplierAvailable is true, mark as "Available on Order".
4. Return recommendations in three categories: Budget Friendly, Best Value, Premium Choice.
5. For each recommendation include: product name, model code (SKU), brand, capacity, voltage, warranty, price, availability status, advantages, disadvantages, reason for recommendation, alternative recommendations.
6. Respond ONLY with valid JSON. No markdown, no explanation text outside JSON.

JSON format:
{
  "source": "puter-ai",
  "recommendations": {
    "budgetFriendly": [...],
    "bestValue": [...],
    "premiumChoice": [...]
  }
}
`;
};

/**
 * Parse AI response, extracting JSON safely.
 */
const parseAIResponse = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON block
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const block = text.slice(start, end + 1);
      try {
        return JSON.parse(block);
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
};

/**
 * Validate AI recommendations against actual product records.
 * Removes any product not found in the catalogue or marks availability correctly.
 */
const validateAgainstCatalogue = (recommendations, products) => {
  const productMap = new Map();
  products.forEach((p) => productMap.set(p.sku, p));

  const validateCategory = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((rec) => {
        const product = productMap.get(rec.modelCode || rec.sku);
        if (!product) return null; // drop invented products

        const available = product.availableStock;
        let availabilityStatus;
        if (available > 0) {
          availabilityStatus = "In Stock";
        } else if (product.supplierAvailable) {
          availabilityStatus = "Available on Order";
        } else {
          availabilityStatus = "Out of Stock";
        }

        return {
          id: rec.id,
          productName: product.name,
          modelCode: product.sku,
          brand: product.brand,
          capacity: `${product.ahCapacity}Ah`,
          voltage: `${product.voltage}V`,
          warranty: product.warranty,
          price: product.sellingPrice,
          availabilityStatus,
          availableStock: available,
          supplierAvailable: product.supplierAvailable,
          advantages:
            rec.advantages &&
            rec.advantages.length > 0
              ? rec.advantages
              : (product.pros || []).length > 0
              ? product.pros
              : ["Reliable performance"],
          disadvantages:
            rec.disadvantages &&
            rec.disadvantages.length > 0
              ? rec.disadvantages
              : (product.cons || []).length > 0
              ? product.cons
              : ["Higher price point"],
          reason: rec.reason || "Recommended based on your requirements.",
          category: rec.category || "Best Value",
          alternatives: (rec.alternatives || []).filter((a) =>
            productMap.has(a)
          ),
        };
      })
      .filter(Boolean);
  };

  return {
    source: recommendations.source || "puter-ai",
    recommendations: {
      budgetFriendly: validateCategory(recommendations.recommendations?.budgetFriendly),
      bestValue: validateCategory(recommendations.recommendations?.bestValue),
      premiumChoice: validateCategory(recommendations.recommendations?.premiumChoice),
    },
    disclaimer: recommendations.disclaimer || "",
  };
};

/**
 * Main entry point: get AI recommendations with fallback.
 */
export const recommendBattery = async (products, requirements) => {
  // Try Puter AI first
  if (puter && puterEnabled) {
    try {
      const prompt = buildPrompt(products, requirements);
      const reply = await puter.ai.chat(prompt, {
        model: process.env.PUTER_MODEL || "gpt-5.5",
      });
      const content = reply.message ? reply.message.content.toString() : String(reply);
      const parsed = parseAIResponse(content);
      if (parsed) {
        const validated = validateAgainstCatalogue(parsed, products);
        // Ensure we have something in each category
        if (
          validated.recommendations.budgetFriendly.length ||
          validated.recommendations.bestValue.length ||
          validated.recommendations.premiumChoice.length
        ) {
          return validated;
        }
      }
    } catch (err) {
      console.warn("Puter AI error, falling back to rule-based:", err.message);
    }
  }

  // Fallback
  return ruleBasedRecommend(products, requirements);
};
