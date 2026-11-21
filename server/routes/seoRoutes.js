// server/routes/seoRoutes.js
import express from "express";
import Product from "../models/Product.js"; // Adjust path/filename to match your Product model

const router = express.Router();
const SITE_URL = "https://autohomebatteries.in";

const escapeXml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// 1. Dynamic Sitemap for Google Search Console (indexes every product URL)
router.get("/sitemap.xml", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select("_id updatedAt")
      .lean();

    const staticPages = ["", "/batteries", "/battery-finder", "/maintenance"];
    const urls = [
      ...staticPages.map(
        (path) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`
      ),
      ...products.map(
        (p) => `
  <url>
    <loc>${SITE_URL}/products/${p._id}</loc>
    <lastmod>${new Date(p.updatedAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
      ),
    ];

    res.header("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}
</urlset>`);
  } catch (err) {
    res.status(500).send("Failed to generate sitemap");
  }
});

// 2. Google Merchant Center RSS 2.0 Product Feed
router.get("/merchant-feed.xml", async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      sellingPrice: { $gt: 0 },
    }).lean();

    const items = products
      .filter((p) => (Array.isArray(p.images) && p.images[0]) || p.image)
      .map((p) => {
        const available = p.availableStock ?? p.currentStock ?? 0;
        const availability = available > 0 ? "in_stock" : "out_of_stock";
        const imageUrl = p.images?.[0] || p.image;
        const price = `${Number(p.sellingPrice).toFixed(2)} INR`;
        const desc =
          p.description ||
          `${p.name} by ${p.brand} (${p.ahCapacity || ""}Ah). Genuine warranty & free installation at AutoHome Batteries Pernambut.`;

        return `
    <item>
      <g:id>${escapeXml(p.sku || p._id)}</g:id>
      <g:title>${escapeXml(`${p.brand} ${p.name}`)}</g:title>
      <g:description>${escapeXml(desc.slice(0, 4900))}</g:description>
      <g:link>${SITE_URL}/products/${p._id}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:brand>${escapeXml(p.brand || "AutoHome Batteries")}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
    </item>`;
      });

    res.header("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>AutoHome Batteries Product Catalog</title>
    <link>${SITE_URL}</link>
    <description>Genuine Inverter, Lithium, Car, and Two-Wheeler Batteries in Pernambut</description>${items.join("")}
  </channel>
</rss>`);
  } catch (err) {
    res.status(500).send("Failed to generate merchant feed");
  }
});

export default router;