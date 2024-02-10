// Table playground

const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch({
    headless: false,
    channel: "msedge",
    slowMo: 200,
    timeout: 10000,
  });
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();
  await page.goto("https://webscraper.io/test-sites/tables");

  // wait for the document to load
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("ul.nav.tables-nav");

  // navigate to semantically correct tables
  await page.click("a.semantically-correct-button");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("table.table-bordered");
  await page.waitForSelector("table.table-bordered2");

  let table1 = [];
  let table2 = [];

  for (let i = 1; i <= 4; i++) {
    const row = await page.$$eval(
      "body > div.wrapper > div.container > div > div > div.col-lg-9 > div > div.tables-semantically-correct > table:nth-child(3)",
      (elements, index) => {
        return elements.map((element) => {
          const th = element
            .querySelector(`thead > tr > th:nth-child(${index})`)
            .innerText.trim();
          const td1 = element.querySelector(
            `tbody > tr:nth-child(1) > td:nth-child(${index})`
          ).innerText;
          const td2 = element.querySelector(
            `tbody > tr:nth-child(2) > td:nth-child(${index})`
          ).innerText;
          const td3 = element.querySelector(
            `tbody > tr:nth-child(3) > td:nth-child(${index})`
          ).innerText;
          return [th, td1, td2, td3];
        });
      },
      i
    );

    /* const tableHeading = {
      [row[0][0]]: {
        el1: row[0][1],
        el2: row[0][2],
        el3: row[0][3],
      },
    }; */
    table1.push(row[0]);
  }

  let table2TRowCount = 0;

  const table2Selector =
    "body > div.wrapper > div.container > div > div > div.col-lg-9 > div > div.tables-semantically-correct > table.table.table-bordered.table-bordered2";
  const table2HeadRowCount = await page
    .locator(`${table2Selector} > thead > tr`)
    .count();
  const table2BodyRowCount = await page
    .locator(`${table2Selector} > tbody > tr`)
    .count();
  table2TRowCount += table2HeadRowCount + table2BodyRowCount;

  for (let i = 1; i <= table2TRowCount; i++) {
    const row = await page.$$eval(
      "body > div.wrapper > div.container > div > div > div.col-lg-9 > div > div.tables-semantically-correct > table.table.table-bordered.table-bordered2",
      (elements, index) => {
        return elements.map((element, idx) => {
          const th = element
            .querySelector(`thead > tr > th:nth-child(${index})`)
            .innerText.trim();
          const td1 = element.querySelector(
            `tbody > tr:nth-child(1) > td:nth-child(${index})`
          ).innerText;
          const td2 = element.querySelector(
            `tbody > tr:nth-child(2) > td:nth-child(${index})`
          ).innerText;
          const td3 = element.querySelector(
            `tbody > tr:nth-child(3) > td:nth-child(${index})`
          ).innerText;
          return [th, td1, td2, td3];
        }, index);
      },
      i
    );

    table2.push(row[0]);
  }

  console.log(table1);
  console.log(table2);

  await browser.close();
})();
