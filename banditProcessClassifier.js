'use-strict';

import PuppeteerUtil from "./utils/puppeteerUtil";
import CrawlerUtil from './utils/crawlerUtil';
import HtmlUtil from './utils/htmlUtil';
import { GaussianNB } from 'ml-naivebayes';
import EpsilonGreedy from './epsilonGreedy';
import FeaturesConst from './consts/featuares';
import TextUtil from "./utils/textUtil";
import XpathUtil from "./utils/xpathUtil";
import logger from './core/logger/app-logger'


export default class BanditProcessClassifier {

    static async initilize(node, puppeteer = null, queue, criterion, evaluation, elementsAccessed = [], itens = null, model, epsilonGreedyAlg, xTrain = [], yTrain = [], actuallyIndex = 0, contNodeNumber = 1) {

        if (puppeteer == null) {
            puppeteer = await PuppeteerUtil.createPuppetterInstance();
        }

        let page = puppeteer.getFirstPage();
        const currentPage = page;
        const lengthQueueBefore = queue.length;

        try {
            const nodeCrawledResult = await CrawlerUtil.crawlerNode(criterion, evaluation, node, page, elementsAccessed, itens, queue, true);
            queue = nodeCrawledResult.queue;
            node = nodeCrawledResult.node;
            elementsAccessed = nodeCrawledResult.elementsAccessed;
            itens = nodeCrawledResult.itens;

        } catch (e) {
            logger.warn("Click error: ", e);
        }

        page = currentPage;

        for (let edge of queue) {
            console.log("queue nodes: ****:", edge.getSource().value, ' level: ', edge.getLevel());
        }

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
            console.log("features ======================== ", node.features)
            
            const newNode = queue[index]
            queue.splice(index, 1);
            epsilonGreedyAlg.values.splice(index, 1);
            epsilonGreedyAlg.counts.splice(index, 1);

            if (newNode.getLevel() > 0 && !HtmlUtil.isUrl(newNode.getSource().getValue())) {
                await page.waitForNavigation().catch(e => void e);
                await PuppeteerUtil.accessParent(page, newNode.getSourcesParents());
            }
            return BanditProcessClassifier.initilize(newNode, puppeteer, queue, criterion, evaluation, elementsAccessed, itens, model, epsilonGreedyAlg, xTrain, yTrain, actuallyIndex++, ++contNodeNumber);
        }

        if (itens === null)
            itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);

        logger.info("Close Puppeteer ...");
        await puppeteer.getBrowser().close()

        logger.info("Returnin Criterion: " + criterion.name);
        return { "itens": itens, "contNodeNumber": contNodeNumber };
    };

    static trainModel(node, xTrain, yTrain, model) {
        const newTrain = [
            node.getFeatures()[FeaturesConst.HAVE_URL_RELEVANT],
            node.getParent().getFeatures()[FeaturesConst.HAVE_CRITERION_TERM_IN_PAGE],
            node.getParent().getFeatures()[FeaturesConst.HAVE_URL_RELEVANT],
            node.getParent().getFeatures()[FeaturesConst.HAVE_ONE_ITEM_CRITERIO],
            node.getParent().getFeatures()[FeaturesConst.HAVE_TWO_ITEM_CRITERIO],
            node.getParent().getFeatures()[FeaturesConst.HAVE_MORE_ITEM_CRITERIO],
        ]

        if (!TextUtil.checkArrayContainsInListArrays(xTrain, newTrain)) {
            xTrain.push(newTrain);
            yTrain.push(node.getFeatures()[FeaturesConst.RESULT]);
            model.train(xTrain, yTrain);
        }
        return model;

    }

    static trainModelActuallyNode(node, xTrain, yTrain, model) {
        const newTrain = [
            node.getFeatures()[FeaturesConst.HAVE_URL_RELEVANT],
            node.getParent().getFeatures()[FeaturesConst.HAVE_CRITERION_TERM_IN_PAGE],
            node.getFeatures()[FeaturesConst.HAVE_URL_RELEVANT],
            node.getFeatures()[FeaturesConst.HAVE_ONE_ITEM_CRITERIO],
            node.getFeatures()[FeaturesConst.HAVE_TWO_ITEM_CRITERIO],
            node.getFeatures()[FeaturesConst.HAVE_MORE_ITEM_CRITERIO],
        ]

        xTrain.push(newTrain);
        yTrain.push(node.getFeatures()[FeaturesConst.RESULT]);
        model.train(xTrain, yTrain);

        return model;
    }

    static async crawlerNode(criterion, evaluation, node, page, elementsAccessed, value, itens, queue, isUrl, changeUrl,
        newCurrentURL, currentURL, xpath, puppeteer, currentPage) {

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
                        logger.warn("************button Aceitar not clicked*****************", e);
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

        const elementsIdentify = []
        elementsIdentify.push.apply(elementsIdentify, elementsAccessed);
        elementsIdentify.push.apply(elementsIdentify, queue);

        if (!changeUrl || (changeUrl && !PuppeteerUtil.checkDuplicateNode(elementsIdentify, newCurrentURL, node, newCurrentURL))) {
            node = await CrawlerUtil.extractEdgesWithKeyWordCriterion(node, page, puppeteer, criterion.name, elementsIdentify);
            itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);
        }

        queue.push.apply(queue, node.getEdges());
        node.setResearched(true);

        return { "node": node, "queue": queue, "elementsAccessed": elementsAccessed, "itens": itens };
    }

}