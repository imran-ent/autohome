export async function onRequest() {
  const response = await fetch(
    "https://autohome-batteries-api.onrender.com/api/seo/sitemap.xml"
  );
  const xml = await response.text();

  return new Response(xml, {
    status: response.status,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}