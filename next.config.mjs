import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const privatePaths = ["admin", "login", "register", "my-business", "favorites", "achievements"];
    return ["", "/en", "/es"].flatMap((prefix) => privatePaths.map((path) => ({
      source: `${prefix}/${path}/:path*`,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
    })));
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",
};

export default withNextIntl(nextConfig);
