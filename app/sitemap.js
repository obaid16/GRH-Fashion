export default function sitemap() {
  const baseUrl = "https://grhfashion.com";
  
  const routes = [
    "",
    "/collection",
    "/custom-design",
    "/gallery",
    "/about",
    "/contact"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
