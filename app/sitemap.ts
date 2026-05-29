import type { MetadataRoute } from "next";

const SITE_URL = "https://dssywlcnsut.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Only list indexable pages. /register is intentionally noindex (it shows
  // payment/bank details), so it is excluded here.
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
