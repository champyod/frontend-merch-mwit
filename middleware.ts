import * as intlayerMiddlewareModule from "next-intlayer/middleware";

// Fallback to various possible export names in different versions
const middleware = (intlayerMiddlewareModule as any).intlayerMiddleware || 
                   (intlayerMiddlewareModule as any).middleware ||
                   (intlayerMiddlewareModule as any).default;

export default middleware;

export const config = {
  matcher: "/((?!api|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next).*)",
};
