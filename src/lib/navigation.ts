/**
 * Navigation Utilities (MWIT-LINK Pattern)
 * Helpers for localized routing and redirection.
 */

/**
 * Build a locale-aware path for navigation
 * @param locale - Current locale ('en' | 'th')
 * @param path - Path without locale prefix (e.g., '/shop')
 * @returns Localized path (e.g., '/th/shop')
 */
export function buildLocalePath(locale: string, path: string): string {
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If path already starts with /en/ or /th/, don't double prefix
  if (cleanPath.startsWith('/en/') || cleanPath.startsWith('/th/') || cleanPath === '/en' || cleanPath === '/th') {
    return cleanPath;
  }
  
  // Prefix with locale, ensuring no double slashes
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Normalize a locale value to a supported language code.
 * Handles strings or useLocale() response objects.
 */
export const normalizeLocale = (value: unknown): "th" | "en" => {
	if (typeof value === "string") {
		if (value === "en" || value === "th") return value as "th" | "en";
	}
	if (value && typeof value === "object" && "locale" in value) {
		const l = (value as { locale: string }).locale;
		if (l === "en" || l === "th") return l as "th" | "en";
	}
	return "th";
};

/**
 * Navigate to a path with current locale preserved
 * @param router - Next.js router instance
 * @param locale - Current locale
 * @param path - Path to navigate to (without locale prefix)
 * @param replace - Use router.replace instead of router.push
 */
export function navigateWithLocale(
  router: { push: (path: string) => void; replace: (path: string) => void },
  locale: string,
  path: string,
  replace = false
): void {
  const localizedPath = buildLocalePath(locale, path);
  if (replace) {
    router.replace(localizedPath);
  } else {
    router.push(localizedPath);
  }
}
