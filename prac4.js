// E-commerce site with "Load more" buttons

const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch({
    headless: false,
    channel: "msedge",
  });
  const context = await browser.newContext({ bypassCSP: false });
  const page = await context.newPage();
  await page.goto("https://webscraper.io/test-sites/e-commerce/more");
  await page.waitForSelector("#side-menu > li:nth-child(3) > a", {
    state: "visible",
  });
  await page.click("#side-menu > li:nth-child(3) > a");

  await page.waitForSelector(
    "#side-menu > li.nav-item.active > ul > li:nth-child(2) > a",
    { state: "visible" }
  );

  await page.click(
    "#side-menu > li.nav-item.active > ul > li:nth-child(2) > a"
  );

  let canBeLoadMore = true;
  const LOAD_MORE_SELECTOR = "a.btn.ecomerce-items-scroll-more";
  const CANNOT_LOAD_MORE_SELECTOR = "a.btn.ecomerce-items-scroll-more";

  while (canBeLoadMore) {
    try {
      await page.click(LOAD_MORE_SELECTOR);

      // check whether display is 'none or not
      const displayValue = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const style = window.getComputedStyle(element);
        return style.getPropertyValue("display");
      }, CANNOT_LOAD_MORE_SELECTOR);

      console.log(displayValue, displayValue == 'none')
      if (displayValue == "none") {
        canBeLoadMore = false;
      } else {
        await page.waitForSelector(LOAD_MORE_SELECTOR, { state: "visible" });
      }
    } catch (error) {
      canBeLoadMore = false;
    }
  }

  const productHandler = await page.$$eval("div.card-body", (elements) => {
    return elements.map((element) => {
      const img_url = element.querySelector("img").getAttribute("src");
      const productName = element.querySelector("h4 > a").innerText.trim();
      return { productName, img_url };
    });
  });

  console.log(productHandler);

  await browser.close();
})();
