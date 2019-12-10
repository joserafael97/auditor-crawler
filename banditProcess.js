'use-strict';

import PuppeteerUtil from "./utils/puppeteerUtil";
import CrawlerUtil from './utils/crawlerUtil';
import HtmlUtil from './utils/htmlUtil';
import { GaussianNB } from 'ml-naivebayes';
import EpsilonGreedy from './epsilonGreedy';
import FeaturesConst from './consts/featuares';
import TextUtil from "./utils/textUtil";
import logger from './core/logger/app-logger'


export default class BanditProcess {

    static async initilize(node, puppeteer = null, queue, criterion, evaluation, elementsAccessed = [], itens = null, epsilonGreedyAlg, actuallyIndex = 0, contNodeNumber = 1, withOutSearchKeyWord = false ) {
        if (puppeteer == null) {
            puppeteer = await PuppeteerUtil.createPuppetterInstance();
        }

        let page = puppeteer.getFirstPage();
        const currentPage = page;
        const lengthQueueBefore = queue.length;
        node.initializeFeatures();

        try {
            const nodeCrawledResult = await CrawlerUtil.crawlerNode(criterion, evaluation, node, page, puppeteer, elementsAccessed, itens, queue, withOutSearchKeyWord);
            queue = nodeCrawledResult.queue;
            node = nodeCrawledResult.node;
            elementsAccessed = nodeCrawledResult.elementsAccessed;
            itens = nodeCrawledResult.itens;

        } catch (e) {
            logger.warn("Click error: ", e);
        }

        for (let edge of queue) {
            console.log("queue nodes: ****:", edge.getSource().value, ' level: ', edge.getLevel());
        }
        page = currentPage;

        if (queue.length > 0 && CrawlerUtil.checkItensComplete(itens) === false) {

            epsilonGreedyAlg.updateNumArms(queue.length);
            node.updateRewardNodes();


            if (node.getLevel() > 1 && lengthQueueBefore < queue.length) {
                for (let i = 0; i < queue.length; i++) {
                    const maxReward = queue[i].getMaxReward();
                    if (maxReward > 0)
                        epsilonGreedyAlg.update(i, maxReward)
                }
            }

            const index = epsilonGreedyAlg.chooseArm();

            const newNode = queue[index]
            queue.splice(index, 1);
            epsilonGreedyAlg.values.splice(index, 1);
            epsilonGreedyAlg.counts.splice(index, 1);

            console.log("--------------PAGE: ", page == undefined || page == null ? 'page is not valid': 'page valid')

            if (newNode.getLevel() > 0 && !HtmlUtil.isUrl(newNode.getSource().getValue())) {
                await page.waitForNavigation().catch(e => void e);
                await PuppeteerUtil.accessParent(page, newNode.getSourcesParents());
            }

            return BanditProcess.initilize(newNode, puppeteer, queue, criterion, evaluation, elementsAccessed, itens, epsilonGreedyAlg, actuallyIndex, ++contNodeNumber, withOutSearchKeyWord);

        }

        if (itens === null)
            itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);

        logger.info("Close Puppeteer ...");
        await puppeteer.getBrowser().close()

        logger.info("Returning Criterion: " + criterion.name);
        return { "itens": itens, "contNodeNumber": contNodeNumber };
    };


}