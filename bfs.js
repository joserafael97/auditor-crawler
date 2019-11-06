'use-strict';

import PuppeteerUtil from "./utils/puppeteerUtil";
import CrawlerUtil from './utils/crawlerUtil';
import HtmlUtil from './utils/htmlUtil';
import logger from './core/logger/app-logger'


export default class Bfs {

    static async initilize(node, puppeteer = null, queue, criterion, evaluation, elementsAccessed = [], itens = null, contNodeNumber = 1) {
        if (puppeteer == null) {
            puppeteer = await PuppeteerUtil.createPuppetterInstance();
        }

        let page = puppeteer.getFirstPage();
        const currentPage = page;

        try {
            const nodeCrawledResult = await CrawlerUtil.crawlerNode(criterion, evaluation, node, page, puppeteer, elementsAccessed, itens, queue);
            queue = nodeCrawledResult.queue;
            node = nodeCrawledResult.node;
            elementsAccessed = nodeCrawledResult.elementsAccessed;
            itens = nodeCrawledResult.itens;
        } catch (e) {
            console.log(e)
            logger.warn("Click error in criterion"  + criterion.name + "in value: " + node.getSource().getValue() + ": " + e);
        }

        page = currentPage;
        while (queue.length > 0 && CrawlerUtil.checkItensComplete(itens) === false) {
            logger.info("Criterion: " + criterion.name);
            for (let edge of queue) {
                console.log("queue nodes: ****:", edge.getSource().value, ' level: ', edge.getLevel());
            }
            const newNode = queue.shift();
            if (newNode.getLevel() > 0 && !HtmlUtil.isUrl(newNode.getSource().getValue())) {
                await page.waitForNavigation().catch(e => void e);
                await PuppeteerUtil.accessParent(page, newNode.getSourcesParents());
            }
            return Bfs.initilize(newNode, puppeteer, queue, criterion, evaluation, elementsAccessed, itens, ++contNodeNumber);
        }

        if (itens === null)
            itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);

        logger.info("Close Puppeteer ...");
        await puppeteer.getBrowser().close()

        logger.info("Returnin Criterion: " + criterion.name);
        return { "itens": itens, "contNodeNumber": contNodeNumber };
    };

}