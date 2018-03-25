"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppet = require("puppeteer");
const config = require("./config");
(async () => {
    function clickNWait(selector) {
        return Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click(selector)
        ]);
    }
    const browser = await puppet.launch({ headless: false, slowMo: 200 });
    const page = await browser.newPage();
    await page.goto('https://www.facebook.com');
    await page.waitForSelector('input#email');
    await page.$eval('input#email', el => el.value = config.username);
    await page.$eval('input#pass', el => el.value = config.password);
    await clickNWait('input[data-testid=royal_login_button]');
    await page.waitFor(3000);
    await page.goto(`https://www.facebook.com/${config.profile}`);
    let skip = config.skip || [];
    while (true) {
        let current = '';
        try {
            let storyOpt = 'a[aria-label="Story options"]';
            await page.waitForSelector(storyOpt);
            await page.evaluate(() => {
                window.scrollTo(0, 4000);
            });
            await page.waitFor(1000);
            let ids = await page.$$eval('div[role=article]', divs => {
                return Array.from(divs).map(div => div.id);
            });
            //let storyOpt = 'a[aria-label="Story options"]'
            for (let id of ids) {
                current = id;
                if (!id)
                    continue;
                if (skip.indexOf(id) !== -1)
                    continue;
                if (String(id).startsWith('comment'))
                    continue;
                let handle = await page.waitForSelector('#' + id + ' ' + storyOpt);
                await handle.click();
                let deleteOpt = 'li[data-feed-option-name=FeedDeleteOption] > a';
                await page.waitFor(1000);
                try {
                    let delete1Handle = await page.$$(deleteOpt);
                    await delete1Handle[delete1Handle.length - 1].click();
                }
                catch (err) {
                    let hideOpt = 'li[data-feed-option-name=HIDE_FROM_TIMELINE] > a';
                    let hideHandle = await page.$$(hideOpt);
                    await hideHandle[hideHandle.length - 1].click();
                }
                //await page.click(handle)
                let deleteBtn = 'div.uiOverlayFooter button[type=submit]';
                let delete2Handle = await page.waitForSelector(deleteBtn);
                await delete2Handle.click();
                await page.waitFor(2000);
            }
        }
        catch (err) {
            console.log('add to skip list ' + current);
            skip.push(current);
            page.goto(`https://www.facebook.com/${config.profile}`);
            await page.waitFor(2000);
        }
    }
})();
//# sourceMappingURL=index.js.map