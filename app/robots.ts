import type { MetadataRoute } from "next";

const BASE_URL = "https://thetantava.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/checkout", "/wishlist", "/feedback", "/api", "/sign-in", "/sign-up"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
