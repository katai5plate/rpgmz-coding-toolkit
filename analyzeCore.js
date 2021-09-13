const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const express = require("express");

const app = express();
const analyzeClass = require("./analyzeClass");

(async () => {
  app.use(express.static("./game/"));
  const server = await new Promise((res) => {
    const ret = app.listen(3030, () => {
      console.log("Open http://localhost:3030/");
      res(ret);
    });
  });

  const getMethods = (groupName) => {
    const regex = /function *?([_a-zA-Z0-9]+) *?\(\) *?\{/g;
    return fs
      .readFileSync(`./game/js/rmmz_${groupName}.js`, { encoding: "utf8" })
      .match(regex)
      .slice(1)
      .map((x) => [groupName, x.replace(regex, "$1")]);
  };

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:3030/index.html");
  const canvas = await page.waitForSelector("#gameCanvas");
  await new Promise((r) => setTimeout(r, 1000));
  await canvas.click();

  await page.evaluate((analyzeClass) => {
    window.analyzeClass = eval(analyzeClass);
    document.getElementById("gameCanvas").style.opacity = 0.25;
    SceneManager.catchNormalError(new Error("コアスクリプトの解析準備中..."));
  }, analyzeClass.toString());

  for (let [k, v] of [
    ...getMethods("core"),
    ...getMethods("managers"),
    ...getMethods("objects"),
    ...getMethods("scenes"),
    ...getMethods("sprites"),
    ...getMethods("windows"),
  ]) {
    console.log(`./analyze/${k}/${v}.json`);
    fs.mkdirpSync(`./analyze/${k}`);
    fs.writeFileSync(
      `./analyze/${k}/${v}.json`,
      JSON.stringify(
        await page.evaluate((name) => {
          SceneManager.catchNormalError(new Error("解析中:" + name));
          return analyzeClass(window[name]);
        }, v),
        null,
        2
      )
    );
  }
  await browser.close();
  server.close();
})();
