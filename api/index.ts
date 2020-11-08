import { NowRequest, NowResponse } from "@vercel/node";

import {
  check404,
  getProfileData,
  getSolvedData,
  getRecentSubmission,
} from "./_lib/chromium";

const isDev = !process.env.AWS_REGION;

export default async function (req: NowRequest, res: NowResponse) {
  try {
    const { userName } = req.query;
    if (!userName) {
      return res.status(400).json({ error: "Please provide userName" });
    }
    const pageLink = `https://leetcode.com/${userName}/`;
    const is404 = await check404(pageLink, isDev);
    if (is404) {
      return res.status(400).json({ error: "Please provide valid userName" });
    }

    const profileData = await getProfileData(pageLink, isDev);
    const solvedData = await getSolvedData(pageLink, isDev);
    const recentSubs = await getRecentSubmission(pageLink, isDev);

    res.setHeader("Content-Type", "application/json");
    res
      .status(200)
      .send(
        JSON.stringify(
          { ...profileData, ...solvedData, ...recentSubs },
          null,
          2
        )
      );
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Sorry there was a problem" });
  }
}
