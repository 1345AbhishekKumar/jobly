import { Page } from "playwright";

// Scrapes a given URL and returns cleaned text up to maxChars
export async function scrapePageText(page: Page, url: string, maxChars = 4000): Promise<string> {
  try {
    console.log(`[Scraper] Navigating to: ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    console.log(`[Scraper] Page loaded: ${url}`);
    
    // Extract main text content. Filter out scripts, styles, header, footer, nav to minimize token count.
    const text = await page.evaluate(() => {
      const elementsToRemove = document.querySelectorAll("script, style, head, nav, footer, header, noscript, svg, iframe, path");
      const removedElements: { element: Element; parent: Node; nextSibling: Node | null }[] = [];
      
      elementsToRemove.forEach((el) => {
        if (el.parentNode) {
          removedElements.push({
            element: el,
            parent: el.parentNode,
            nextSibling: el.nextSibling,
          });
          el.parentNode.removeChild(el);
        }
      });
      
      const bodyText = document.body ? document.body.innerText || document.body.textContent || "" : "";
      
      // Restore the removed elements
      removedElements.forEach(({ element, parent, nextSibling }) => {
        parent.insertBefore(element, nextSibling);
      });
      
      return bodyText;
    });

    console.log(`[Scraper] Extracted text length: ${text.length} characters`);
    // Clean whitespace and return substring
    return text.replace(/\s+/g, " ").trim().substring(0, maxChars);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Scraper] Error scraping page ${url}:`, errMsg);
    return "";
  }
}

// Discover internal links from homepage
export async function discoverSubPages(page: Page, baseUrl: string): Promise<string[]> {
  try {
    console.log("[Scraper] Discovering sub-pages...");
    
    // Wait for the page load state to fully settle
    await page.waitForLoadState("load", { timeout: 5000 }).catch(() => {});
    
    // Brief delay to allow client-side routers or hydration redirects to complete
    await page.waitForTimeout(1000).catch(() => {});

    let links: string[] = [];
    try {
      links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll("a"));
        return anchors
          .map((a) => a.href)
          .filter((href) => href && href.startsWith("http"));
      });
    } catch (evalErr: unknown) {
      const evalMsg = evalErr instanceof Error ? evalErr.message : String(evalErr);
      console.warn(`[Scraper] Link discovery evaluate failed: ${evalMsg}. Retrying after settling load state...`);
      // Wait for any active navigation/load to settle and try again
      await page.waitForLoadState("domcontentloaded", { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1500).catch(() => {});
      
      links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll("a"));
        return anchors
          .map((a) => a.href)
          .filter((href) => href && href.startsWith("http"));
      });
    }

    const rootUrl = new URL(baseUrl);
    const origin = rootUrl.origin;

    const uniqueLinks = Array.from(new Set(links)) as string[];
    
    const relevantLinks = uniqueLinks.filter((link) => {
      try {
        const linkUrl = new URL(link);
        if (linkUrl.origin !== origin) return false;
        
        const path = linkUrl.pathname.toLowerCase();
        if (path === "/" || path === "") return false;
        
        const matches = ["about", "career", "team", "blog", "product", "culture", "eng", "value"];
        return matches.some((keyword) => path.includes(keyword));
      } catch {
        return false;
      }
    });

    console.log(`[Scraper] Discovered ${relevantLinks.length} potential sub-pages`);
    return relevantLinks.slice(0, 3); // Crawl up to 3 subpages
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[Scraper] Error discovering sub pages:", errMsg);
    return [];
  }
}

// Try following redirect via server fetch
export async function resolveHomepageUrl(company: string, sourceUrl?: string, externalApplyUrl?: string): Promise<{ resolvedUrl: string; sources: string[] }> {
  console.log(`[URL Resolver] Resolving homepage for company: ${company}`);
  const sources: string[] = [];
  const targetUrl = externalApplyUrl || sourceUrl;
  
  if (targetUrl) {
    try {
      console.log(`[URL Resolver] Following redirects for: ${targetUrl}`);
      const res = await fetch(targetUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      
      const finalUrl = res.url;
      console.log(`[URL Resolver] Final redirected URL: ${finalUrl}`);
      if (finalUrl && !finalUrl.includes("adzuna.com")) {
        const urlObj = new URL(finalUrl);
        const parts = urlObj.hostname.split(".");
        let rootDomain = urlObj.hostname;
        if (parts.length >= 2) {
          // Keep subdomain if it's typical but strip www
          rootDomain = parts.filter(p => p !== "www").join(".");
        }
        const homepage = `https://${rootDomain}`;
        sources.push(homepage);
        console.log(`[URL Resolver] Extracted root homepage: ${homepage}`);
        return { resolvedUrl: homepage, sources };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[URL Resolver] Failed to resolve redirect: ${errMsg}`);
    }
  }

  // Fallback cleanup
  const cleanName = company
    .replace(/\s*(Inc\.?|LLC|Ltd\.?|Corp\.?|Co\.?).*$/i, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
  const homepage = `https://www.${cleanName}.com`;
  sources.push(homepage);
  console.log(`[URL Resolver] Fallback URL: ${homepage}`);
  return { resolvedUrl: homepage, sources };
}
