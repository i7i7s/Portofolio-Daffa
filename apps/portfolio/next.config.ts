import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl({
  trailingSlash: true,
  devIndicators: false,
  images: { formats: ["image/avif", "image/webp"] },
});
