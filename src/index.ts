import puppeteer from "puppeteer";

const pageLink = "https://leetcode.com/aks28id/";

let totalCategory = [439, 859, 347];

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageLink, { waitUntil: "networkidle0" });

  const realName = await page.$eval(
    'div[class*="realname"]',
    (el) => el.textContent
  );
  // console.log("Real Name", realName);

  const userName = await page.$eval(
    'div[class*="username"]',
    (el) => el.textContent
  );
  // console.log("User Name", userName);

  const profileImg = await page.$eval(
    'img[class*="avatar"]',
    (el) => (el as HTMLImageElement).src
  );
  // console.log("Profile URL", profileImg);

  const totalSolved = await page.$eval(
    'div[class*="total-solved-count"]',
    (el) => el.textContent
  );
  // Total Problems Solved
  // console.log("problem solved :", totalSolved);

  // Returns array of solved problems [easy, medium. hard]
  const solvedCategory = await page.$$eval(
    'span[class*="difficulty-ac-count"]',
    (options) => options.map((option) => option.textContent)
  );
  // console.log("types of solved", solvedCategory);

  // console.log(totalCategory);

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

  // console.log(submissionsList, "recent solves");

  const finalResult = {
    "real-name": realName,
    "user-name": userName,
    avatar: profileImg,
    "total-solved-count": totalSolved,
    "solved-category": solvedCategory,
    "total-category": totalCategory,
    "recent-submissions": submissionsList,
  };

  console.log(finalResult);

  await browser.close();
};

try {
  main();
} catch (error) {
  console.log(error);
}
