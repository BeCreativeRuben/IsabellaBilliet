import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { shouldNoIndex } from "./lib/request-guards";
import { hreflangLinkHeader, PRODUCTION_HOST } from "./lib/seo";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  const alternates = hreflangLinkHeader(request.nextUrl.pathname);

  if (alternates) {
    response.headers.set("Link", alternates);
  }

  if (
    shouldNoIndex({
      vercelEnv: process.env.VERCEL_ENV,
      forwardedHost: request.headers.get("x-forwarded-host"),
      host: request.headers.get("host"),
      productionHost: PRODUCTION_HOST,
    })
  ) {
    response.headers.set("X-Robots-Tag", "noindex");
  }

  return response;
}

export const config = {
  matcher: ["/", "/(nl|en)/:path*"],
};
