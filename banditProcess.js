'use-strict';

import PuppeteerUtil from "./utils/puppeteerUtil";
import CrawlerUtil from './utils/crawlerUtil';
import HtmlUtil from './utils/htmlUtil';
import { GaussianNB } from 'ml-naivebayes';
import EpsilonGreedy from './epsilonGreedy';
import FeaturesConst from './consts/featuares';
import TextUtil from "./utils/textUtil";


export default class BanditProcess {

    static async initilize(node, puppeteer = null, queue, criterion, evaluation, elementsAccessed = [], itens = null, epsilonGreedyAlg, actuallyIndex = 0, contNodeNumber = 0) {
        if (puppeteer == null) {
            puppeteer = await PuppeteerUtil.createPuppetterInstance();
        }

        let page = puppeteer.getFirstPage();
        const value = node.getSource().getValue();
        const currentPage = page;
        const isUrl = HtmlUtil.isUrl(value);
        const xpath = node.getSource().getXpath();
        let changeUrl = false;
        let newCurrentURL = await page.url();
        const currentURL = await page.url();
        const lengthQueueBefore = queue.length;

        console.log("********************************************************************");
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
                    const [button] = await page.$x("//*[contains(., 'Aceitar')]");
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
                await page.waitFor(3000);
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

        for (let edge of queue) {
            console.log("queue nodes: ****:", edge.getSource().value, ' level: ', edge.getLevel());
        }
        page = currentPage;

        if (queue.length > 0 && CrawlerUtil.checkItensComplete(itens) === false) {

            epsilonGreedyAlg.updateNumArms(queue.length);

            if (node.getLevel() > 1 && lengthQueueBefore < queue.length) {
                for (let i = lengthQueueBefore; i < queue.length; i++) {
                    if (queue[i].getMaxReward() > 0)
                        epsilonGreedyAlg.update(i, queue[i].getMaxReward())
                }
            }

            const index = epsilonGreedyAlg.chooseArm();
            console.log("index ======================== ", index)

            const newNode = queue[index]
            queue.splice(index, 1);
            epsilonGreedyAlg.values.splice(index, 1);
            epsilonGreedyAlg.counts.splice(index, 1);

            if (newNode.getLevel() > 0 && !HtmlUtil.isUrl(newNode.getSource().getValue())) {
                await page.waitForNavigation().catch(e => void e);
                await PuppeteerUtil.accessParent(page, newNode.getSourcesParents());
            }

            return BanditProcess.initilize(newNode, puppeteer, queue, criterion, evaluation, elementsAccessed, itens, epsilonGreedyAlg, actuallyIndex, contNodeNumber++);

        }

        console.log("*********************close browser***********************************************");
        if (itens === null)
            itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);

        await puppeteer.getBrowser().close()
        return itens;
    };


}