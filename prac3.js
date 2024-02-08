const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch({
    channel: "msedge",
    headless: false,
    slowMo: 200
  });
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();

  // navigate to the site
  await page.goto("https://webscraper.io/test-sites/e-commerce/ajax");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("div.container");

  // clicks the computer option to route to the computers page
  await page.click("#side-menu > li:nth-child(3) > a");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("div.container");

  // clicks the laptops subcategory to route to the computers/laptops page
  await page.click(
    "#side-menu > li.nav-item.active > ul > li:nth-child(2) > a"
  );
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("div.container");
  await page.waitForSelector(
    "body > div.wrapper > div.container.test-site > div > div.col-lg-9 > div.pager > button.btn.btn-default.next"
  );

  let products = [];
  const pages = page.locator("div.btn-group.pagination > button");

  for (let i = 0; i < (await pages.count()); i++) {
    const productHandler = await page.$$eval("div.card-body", (elements) => {
      return elements.map((element) => {
        const img_url = element.querySelector("img").getAttribute("src");
        const productName = element.querySelector("h4 > a").innerText.trim();
        return { productName, img_url };
      });
    });
    for (let product in productHandler) {
      products.push(productHandler[product]);
    }
    await pages.nth(i).click();
    await pages.nth(i).waitFor({ state: 'visible' });
  }

  console.log(JSON.stringify(products, null, 2));
  await browser.close();
})();
