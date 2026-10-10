import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { hreflangLinkHeader, PRODUCTION_HOST } from "./lib/seo";

const handleI18nRouting = createMiddleware(routing);

function requestHostname(request: NextRequest): string {
  const raw = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  return raw.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
}

export default function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  const alternates = hreflangLinkHeader(request.nextUrl.pathname);

  if (alternates) {
    response.headers.set("Link", alternates);
  }

  if (requestHostname(request) !== PRODUCTION_HOST) {
    response.headers.set("X-Robots-Tag", "noindex");
  }

  return response;
}

export const config = {
  matcher: ["/", "/(nl|en)/:path*"],
};
