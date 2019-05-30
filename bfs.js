'use-strict';

import PuppeteerUtil from "./utils/puppeteerUtil";
import CrawlerUtil from './utils/crawlerUtil';
import HtmlUtil from './utils/htmlUtil';

import {
    QUERYTODYNAMICELEMENT,
    QUERYTOSTATICCOMPONENT
} from './models/queryElement.class';

export default class Bfs {

    static async bfsInit(node, puppeteer = null, queue, criterion, evaluation, elementsAccessed = [], itens = null) {
        if (puppeteer == null) {
            puppeteer = await PuppeteerUtil.createPuppetterInstance();
        }

        let page = puppeteer.getFirstPage();
        const value = node.getSource().getValue();
        const currentPage = page;
        const numPages = (await puppeteer.getBrowser().pages()).length;
        const isUrl = HtmlUtil.isUrl(value);
        const xpath = node.getSource().getXpath();

        console.log("********************************************************************");
        console.log("numPagesOpened: ", numPages);
        console.log("value: ", value);
        console.log("level: ", node.getLevel());
        try {

            if (node.getLevel() > 0) {
                await page.waitForNavigation().catch(e => void e);
                page = await PuppeteerUtil.detectContext(page, xpath).catch(e => void e);
            }

            if (isUrl) {
                await Promise.all([page.goto(value).catch(e => void e), page.waitForNavigation().catch(e => void e)]);
            } else {
                let element = node.getSource().getElement();
                element = await PuppeteerUtil.selectElementPage(page, xpath, value);
                await element.click();
                await page.waitForNavigation().catch(e => void e);
                page = await PuppeteerUtil.detectContext(page, xpath).catch(e => void e);
            }

            if (node.getLevel() === 0) {
                node.getSource().setUrl((await page.url()));
            }

            elementsAccessed.push(node);
            const elementsIdentify = []
            elementsIdentify.push.apply(elementsIdentify, elementsAccessed);
            elementsIdentify.push.apply(elementsIdentify, queue);
            node = await CrawlerUtil.extractEdges(node, page, puppeteer, criterion.name, elementsIdentify);
            itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);
            page = currentPage;
            queue.push.apply(queue, node.getEdges());
            node.setResearched(true);
        } catch (e) {
            console.log("************click error*****************", e);
        }

        while (queue.length > 0) {
            for (let edge of queue) {
                console.log("queue nodes: ****:", edge.getSource().value, ' level: ', edge.getLevel());
            }
            const newNode = queue.shift();
            if (newNode.getLevel() > 0) {
                await page.waitForNavigation().catch(e => void e);
                await PuppeteerUtil.accessParent(page, newNode.getSourcesParents());
            }
            return Bfs.bfsInit(newNode, puppeteer, queue, criterion, evaluation, elementsAccessed, itens);
        }
    
        console.log("*********************close browser***********************************************");
        await puppeteer.getBrowser().close();
        
        return itens;
    };

}