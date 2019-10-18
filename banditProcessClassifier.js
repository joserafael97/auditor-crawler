'use-strict';

import PuppeteerUtil from "./utils/puppeteerUtil";
import CrawlerUtil from './utils/crawlerUtil';
import HtmlUtil from './utils/htmlUtil';
import { GaussianNB } from 'ml-naivebayes';
import EpsilonGreedy from './epsilonGreedy';
import TextUtil from "./utils/textUtil";
import XpathUtil from "./utils/xpathUtil";
import logger from './core/logger/app-logger'
import FeaturesConst from './consts/featuares';


export default class BanditProcessClassifier {

    static async initilize(node, puppeteer = null, queue, criterion, evaluation, elementsAccessed = [], itens = null, model, epsilonGreedyAlg, xTrain = [], yTrain = [], actuallyIndex = 0, contNodeNumber = 1, trainModel = []) {

        if (puppeteer == null) {
            puppeteer = await PuppeteerUtil.createPuppetterInstance();
        }

        let page = puppeteer.getFirstPage();
        const currentPage = page;
        const lengthQueueBefore = queue.length;
        node.initializeFeatures();

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

        if (node.getLevel() > 0) {

            let newData = {};
            newData[FeaturesConst.URL_RELEVANT] = node.getParent().getFeatures()[FeaturesConst.MORE_ITEM_CRITERIO];
            newData[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT_PARENT] = node.getParent().getFeatures()[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT];
            newData[FeaturesConst.URL_RELEVANT_PARENT] = node.getParent().getFeatures()[FeaturesConst.URL_RELEVANT];
            newData[FeaturesConst.TERM_CRITERION_PARENT] = node.getParent().getFeatures()[FeaturesConst.TERM_CRITERION];
            newData[FeaturesConst.ONE_ITEM_CRITERIO_PARENT] = node.getParent().getFeatures()[FeaturesConst.ONE_ITEM_CRITERIO];
            newData[FeaturesConst.MORE_ITEM_CRITERIO_PARENT] = node.getParent().getFeatures()[FeaturesConst.MORE_ITEM_CRITERIO];
            newData["result"] = (node.getFeatures()[FeaturesConst.MORE_ITEM_CRITERIO] === 1 || node.getFeatures()[FeaturesConst.ONE_ITEM_CRITERIO] === 1) ? 'identification_item' : node.getEdges().length > 0 ? 'component_relevant' : 'no_relevant' ;
            trainModel.push(newData);

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
            let newNode = queue[index]
            newNode.getFeatures()[FeaturesConst.URL_RELEVANT] = TextUtil.checkUrlRelvant(node.getSource().getUrl(), criterion.name) ? 1 : 0;
            console.log("featuare init new node ======================== ", newNode.getFeatures());

            queue.splice(index, 1);
            epsilonGreedyAlg.values.splice(index, 1);
            epsilonGreedyAlg.counts.splice(index, 1);

            if (newNode.getLevel() > 0 && !HtmlUtil.isUrl(newNode.getSource().getValue())) {
                await page.waitForNavigation().catch(e => void e);
                await PuppeteerUtil.accessParent(page, newNode.getSourcesParents());
            }
            return BanditProcessClassifier.initilize(newNode, puppeteer, queue, criterion, evaluation, elementsAccessed, itens, model, epsilonGreedyAlg, xTrain, yTrain, actuallyIndex++, ++contNodeNumber, trainModel);
        }

        if (itens === null)
            itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);

        logger.info("Close Puppeteer ...");
        await puppeteer.getBrowser().close()

        logger.info("Returnin Criterion: " + criterion.name);
        return { "itens": itens, "contNodeNumber": contNodeNumber,  "trainModel": trainModel};

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


}