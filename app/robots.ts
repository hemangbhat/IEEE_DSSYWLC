import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private / PII pages and API routes out of search results.
      disallow: ["/profiles", "/api/"],
    },
    sitemap: "https://dssywlcnsut.in/sitemap.xml",
  };
}
