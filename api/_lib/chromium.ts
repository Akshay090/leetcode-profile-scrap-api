import { launch, Page } from "puppeteer-core";
import { getOptions } from "./options";
let _page: Page | null;

async function getPage(isDev: boolean) {
  if (_page) {
    return _page;
  }
  const options = await getOptions(isDev);
  const browser = await launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function check404(
  pageLink: string,
  isDev: boolean
): Promise<boolean> {
  const page = await getPage(isDev);
  await page.goto(pageLink, { waitUntil: "networkidle0" });
  try {
    await page.$eval('div[class*="display-404"]', (el) => el.textContent);
    console.error(pageLink + " 404");
    return true;
  } catch (error) {
    return false;
  }
}

export async function getProfileData(pageLink: string, isDev: boolean) {
  const page = await getPage(isDev);
  await page.goto(pageLink, { waitUntil: "networkidle0" });

  const realName = await page.$eval(
    'div[class*="realname"]',
    (el) => el.textContent
  );

  const userName = await page.$eval(
    'div[class*="username"]',
    (el) => el.textContent
  );

  const avatar = await page.$eval(
    'img[class*="avatar"]',
    (el) => (el as HTMLImageElement).src
  );

  return {
    realName,
    userName,
    avatar,
  };
}

export async function getSolvedData(pageLink: string, isDev: boolean) {
  const page = await getPage(isDev);
  await page.goto(pageLink, { waitUntil: "networkidle0" });

  const totalSolved = await page.$eval(
    'div[class*="total-solved-count"]',
    (el) => el.textContent
  );

  // Returns array of solved problems [easy, medium. hard]
  const solvedCategory = await page.$$eval(
    'span[class*="difficulty-ac-count"]',
    (options) => options.map((option) => option.textContent)
  );

  const totalCategory = [439, 859, 347];

  return {
    totalSolved,
    solvedCategory,
    totalCategory,
  };
}

export async function getRecentSubmission(pageLink: string, isDev: boolean) {
  const page = await getPage(isDev);
  await page.goto(pageLink, { waitUntil: "networkidle0" });

  const submissionsList = await page.evaluate(() => {
    const wrapper = document.querySelector('div[class*="profile-content__"]');
    const childNodes = wrapper.children;
    const totalNodes = childNodes.length;
    const recentSubs = childNodes[totalNodes - 1];
    const subItems = recentSubs.querySelectorAll(".ant-list-item");
    let finalSubs = [];
    subItems.forEach((e) => {
      const text = (e as HTMLElement).innerText.split("\n");
      const ques = text[0];
      const time = text[1];
      const lang = text[2];
      const status = text[3];
      finalSubs.push({ ques, time, lang, status });
    });
    return finalSubs;
  });

  return {
    submissionsList,
  };
}
