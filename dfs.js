'use-strict';

import PuppeteerUtil from "./utils/puppeteerUtil";
import CrawlerUtil from './utils/crawlerUtil';
import HtmlUtil from './utils/htmlUtil';


export default class Dfs {

    static async initilize(node, puppeteer = null, queue, criterion, evaluation, elementsAccessed = [], itens = null, contNodeNumber = 1) {
        if (puppeteer == null) {
            puppeteer = await PuppeteerUtil.createPuppetterInstance();
        }

        let page = puppeteer.getFirstPage();
        const value = node.getSource().getValue();
        const currentPage = page;
        const numPages = (await puppeteer.getBrowser().pages()).length;
        const isUrl = HtmlUtil.isUrl(value);
        const xpath = node.getSource().getXpath();
        let changeUrl = false;
        let newCurrentURL = await page.url();
        const currentURL = await page.url();

        console.log("********************************************************************");
        console.log("numPagesOpened: ", numPages);
        console.log("value: ", value);
        console.log("level: ", node.getLevel());

        try {
            if (node.getSource().getIsExtractIframe() && (await page.constructor.name) !== "Frame") {
                await page.waitForNavigation().catch(e => void e);
                page = await PuppeteerUtil.detectContext(page).catch(e => void e);
            }

            if (isUrl) {
                await Promise.all([page.goto(value).catch(e => void e), page.waitForNavigation().catch(e => void e)]);
                if (node.getLevel() === 0) {
                    await page.waitFor(3000);
                    const [button] = await page.$x("//button[contains(., 'Aceitar')]");
                    if (button) {
                        try {
                            await button.click();
                        } catch (e) {
                            console.log("************not button aceitar*****************", e);
                        }
                    }
                }
            } else {
                let element = node.getSource().getElement();
                element = await PuppeteerUtil.selectElementPage(page, xpath, value);
                await element.click();
                await page.waitForNavigation().catch(e => void e);
                newCurrentURL = await page.url();
                if (currentURL !== newCurrentURL) {
                    changeUrl = true;
                }
            }
            await page.waitFor(3000);
            if ((!isUrl || node.getSource().getIsExtractIframe()) && (await page.constructor.name) !== "Frame") {
                page = await PuppeteerUtil.detectContext(page).catch(e => void e);
            }

            if (node.getLevel() === 0) {
                node.getSource().setUrl((await page.url()));
            }

            elementsAccessed.push(node);
            const elementsIdentify = []
            elementsIdentify.push.apply(elementsIdentify, elementsAccessed);
            elementsIdentify.push.apply(elementsIdentify, queue);

            if (!changeUrl || (changeUrl && !PuppeteerUtil.checkDuplicateNode(elementsIdentify, newCurrentURL, node, newCurrentURL))) {
                node = await CrawlerUtil.extractEdges(node, page, puppeteer, criterion.name, elementsIdentify);
                itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);
            }
            queue.push.apply(queue, node.getEdges());
            node.setResearched(true);
        } catch (e) {
            console.log("************click error*****************", e);
        }
        page = currentPage;

        while (queue.length > 0 && CrawlerUtil.checkItensComplete(itens) === false) {
            for (let edge of queue) {
                console.log("queue nodes: ****:", edge.getSource().value, ' level: ', edge.getLevel());
            }
            const newNode = queue[queue.length - 1];
            queue.splice(queue.length - 1, 1);

            if (newNode.getLevel() > 0 && !HtmlUtil.isUrl(newNode.getSource().getValue())) {
                await page.waitForNavigation().catch(e => void e);
                await PuppeteerUtil.accessParent(page, newNode.getSourcesParents());
            }
            return Dfs.initilize(newNode, puppeteer, queue, criterion, evaluation, elementsAccessed, itens, ++contNodeNumber);
        }

        console.log("*********************close browser***********************************************");
        if (itens === null)
            itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);

        await puppeteer.getBrowser().close();

        return {"itens": itens, "contNodeNumber": contNodeNumber};
    };

}