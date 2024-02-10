// Ecommerce scraping

const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();
  await page.goto("https://webscraper.io/test-sites/e-commerce/allinone");

  async function clickLinkByInnerText(text) {
    return await page.evaluate((innerText) => {
      const anchors = document.querySelectorAll("a");
      const anchorWithText = Array.from(anchors).find(
        (anchor) => anchor.innerText.trim() == innerText
      );
      if (anchorWithText) {
        anchorWithText.click();
      }
    }, text);
  }

  // home page

  const h1Handle = await page.$eval("div > h1", (el) => {
    return el.innerText.trim();
  });

  const navBarHandle = await page.$$eval(
    "ul.navbar-nav > li > a",
    (elements) => {
      return elements.map((element) => {
        return element && element.innerText.trim();
      });
    }
  );

  const sideBarHandle = await page.$$eval(
    "div.sidebar-nav > ul > li",
    (elements) => {
      return elements.map((element) => {
        const category = element.querySelector("a");
        return category && category.innerText.trim();
      });
    }
  );

  clickLinkByInnerText("Home");

  await page.waitForURL("https://webscraper.io/test-sites/e-commerce/allinone");
  await page.waitForSelector("div.jumbotron", { state: "attached" });

  const mainCardHandler = await page.$eval(
    "body > div.wrapper > div.container.test-site > div > div.col-lg-9 > div.jumbotron",
    (element) => {
      const h1_tag = element.querySelector("h1").innerText.trim();
      const p_tag = element.querySelector("p").innerText.trim();
      return { title: h1_tag, desc: p_tag };
    }
  );

  const h2Handler = await page.$eval(
    "div > h2",
    (element) => element && element.innerText.trim()
  );

  const productCardHandler = await page.$$eval("div.card-body", (elements) => {
    return elements.map((element) => {
      const img_url = element.querySelector("img").getAttribute("src");
      const price = element.querySelector("h4.price").innerText.trim();
      const productName = element.querySelector("h4 > a").innerText.trim();
      const desc = element.querySelector("p.description").innerText.trim();
      return { productName, price, img_url, desc };
    });
  });

  const footerHandler = await page.$$eval("div.footer li p", (elements) => {
    return elements.map((element) => {
      return element && element.innerText.trim();
    });
  });

  // phones
  clickLinkByInnerText("Phones");

  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector(
    "#side-menu > li.nav-item.active > ul > li > a.subcategory-link",
    {
      state: "attached",
    }
  );

  const phonesHeading = await page.$eval(
    "h1.page-header",
    (el) => el && el.innerText.trim()
  );
  const Phones = await page.$$eval("div.card-body", (els) => {
    return els.map((element) => {
      const img_url = element.querySelector("img").getAttribute("src");
      const price = element.querySelector("h4.price").innerText.trim();
      const productName = element.querySelector("h4 > a").innerText.trim();
      const desc = element.querySelector("p.description").innerText.trim();
      return { productName, price, img_url, desc };
    });
  });

  // phones/touch

  await page.click(
    "#side-menu > li.nav-item.active > ul > li > a.subcategory-link"
  );

  await page.waitForSelector("div.container", { state: "attached" });
  const pageHeader = await page.$eval(
    "h1.page-header",
    (element) => element && element.innerText.trim()
  );

  const TouchPhones = await page.$$eval("div.card-body", (els) => {
    return els.map((element) => {
      const img_url = element.querySelector("img").getAttribute("src");
      const price = element.querySelector("h4.price").innerHTML.trim();
      const productName = element.querySelector("h4 > a").innerText.trim();
      const desc = element.querySelector("p.description").innerText.trim();
      return { img_url, price, productName, desc };
    });
  });

  // logging the stuffs
  console.log(h1Handle);
  console.log(navBarHandle);
  console.log(sideBarHandle);
  console.log(mainCardHandler);
  console.log(h2Handler);
  console.log(productCardHandler);
  console.log(footerHandler);

  //phonses
  console.log(phonesHeading);
  console.log(Phones);

  // phones/touch
  console.log(pageHeader);
  console.log(TouchPhones);

  await browser.close();
})();
