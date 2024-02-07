const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch({
    headless: false,
    channel: "msedge",
    //slowMo: 500,
    timeout: 30000,
  });

  const context = await browser.newContext({
    bypassCSP: true,
  });
  const page = await context.newPage();
  await page.goto("https://webscraper.io/test-sites/e-commerce/static");

  async function clickHandleWithTitle(title) {
    return await page.evaluate((title) => {
      const anchors = document.querySelectorAll("a");
      const anchorWithTitle = Array.from(anchors).find(
        (anchor) => anchor.innerText.trim() == title
      );
      if (anchorWithTitle) {
        console.log(anchorWithTitle);
        anchorWithTitle.click();
      }
    }, title);
  }

  await clickHandleWithTitle("Computers");
  await page.waitForLoadState("domcontentloaded");

  await page.click(
    "#side-menu > li.nav-item.active > ul > li:nth-child(2) > a"
  );
  await page.waitForLoadState("domcontentloaded");

  await clickHandleWithTitle("Laptops");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("div.container", { state: "attached" });

  const nextButtonSelector =
    "#static-pagination > nav > ul > li:nth-child(15) > a";
  const nextButtonDisabledSelector =
    "#static-pagination > nav > ul > li:nth-child(15).disabled";

  let isNextButtonEnabled = true;
  let laptops = [];
  do {
    // Extract the products on the current page
    const productHandler = await page.$$eval("div.card-body", (elements) => {
      return elements.map((element) => {
        const img_url = element.querySelector("img").getAttribute("src");
        const productName = element.querySelector("h4 > a").innerText.trim();
        return { productName, img_url };
      });
    });

    // Process the extracted products...
    laptops.push([...productHandler]);

    // Check if the next button is disabled
    isNextButtonEnabled = !(await page.$(nextButtonDisabledSelector));

    // If the next button is not disabled, click it to go to the next page
    if (isNextButtonEnabled) {
      await page.click(nextButtonSelector);
      await page.waitForLoadState("domcontentloaded");
    }
  } while (isNextButtonEnabled);

  await page.goto(
    "https://webscraper.io/test-sites/e-commerce/static/computers/tablets"
  );
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("div.container");

  const tabletNextButton = "#static-pagination > nav > ul > li:nth-child(6) > a";
  const tabletNextButtonDisabled =
    "#static-pagination > nav > ul > li:nth-child(6).disabled";
  let isNextEnabled = true;
  let tablets = [];
  do {
    const productHandler = await page.$$eval("div.card-body", (elements) => {
      return elements.map((element) => {
        const img_url = element.querySelector("img").getAttribute("src");
        const productName = element.querySelector("h4 > a").innerText.trim();
        return { productName, img_url };
      });
    });

    tablets.push([...productHandler]);

    isNextEnabled = await page.$(tabletNextButtonDisabled) === null;
    if (isNextEnabled) {
      await page.click(tabletNextButton);
      await page.waitForSelector('div.container', {state: 'visible'});
    }
  } while (isNextEnabled);

  console.log(laptops);
  console.log("gap ho you mula");
  console.log(tablets);

  await browser.close();
})();
