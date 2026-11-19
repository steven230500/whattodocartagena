import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const privatePaths = ["admin", "login", "register", "my-business", "favorites", "achievements"];
    const noindex = ["", "/en", "/es"].flatMap((prefix) => privatePaths.map((path) => ({
      source: `${prefix}/${path}/:path*`,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
    })));
    // fotos y modelo 3D de /public: hoy salían con max-age=0 (se descargaban en cada visita)
    const staticAssets = [
      { source: "/:all*(jpg|jpeg|png|webp|svg|ico)", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
      { source: "/3d/:all*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ];
    return [...noindex, ...staticAssets];
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",
};

export default withNextIntl(nextConfig);
