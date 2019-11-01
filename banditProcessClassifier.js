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

        try {
            const nodeCrawledResult = await CrawlerUtil.crawlerNode(criterion, evaluation, node, page, puppeteer, elementsAccessed, itens, queue, true);
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
            const newData = this.getFeaturesNode(node);
            trainModel.push(newData);
        }

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
            console.log("index ======================== ", index)
            let newNode = queue[index]

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
        return { "itens": itens, "contNodeNumber": contNodeNumber, "trainModel": trainModel };

    };

    static getFeaturesNode(node) {
        let newData = {};
        newData[FeaturesConst.URL_RELEVANT] = node.getFeatures()[FeaturesConst.URL_RELEVANT];
        newData[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT_PARENT] = node.getParent().getFeatures()[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT];
        newData[FeaturesConst.URL_RELEVANT_PARENT] = node.getParent().getFeatures()[FeaturesConst.URL_RELEVANT];
        newData[FeaturesConst.TERM_CRITERION_PARENT] = node.getParent().getFeatures()[FeaturesConst.TERM_CRITERION];
        newData[FeaturesConst.ONE_ITEM_CRITERIO_PARENT] = node.getParent().getFeatures()[FeaturesConst.ONE_ITEM_CRITERIO];
        newData[FeaturesConst.MORE_ITEM_CRITERIO_PARENT] = node.getParent().getFeatures()[FeaturesConst.MORE_ITEM_CRITERIO];

        let urlRelevantBrother = 0;
        let moreThanOneNewComponentBrother = 0;
        let oneItemCriterionBrother = 0;
        let moreItemCriterionBrother = 0;
        let termCriterionBrother = 0;

        for (const brotherNode of node.getParent().getChildrenResearchedNodes()) {
            urlRelevantBrother = brotherNode.getFeatures()[FeaturesConst.MORE_ITEM_CRITERIO] + urlRelevantBrother;
            moreThanOneNewComponentBrother = brotherNode.getFeatures()[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT] + moreThanOneNewComponentBrother;
            oneItemCriterionBrother = brotherNode.getFeatures()[FeaturesConst.ONE_ITEM_CRITERIO] + oneItemCriterionBrother;
            moreItemCriterionBrother = brotherNode.getFeatures()[FeaturesConst.MORE_ITEM_CRITERIO] + moreItemCriterionBrother;
            termCriterionBrother = brotherNode.getFeatures()[FeaturesConst.TERM_CRITERION] + termCriterionBrother;

        }

        newData[FeaturesConst.URL_RELEVANT_BRORHER] = urlRelevantBrother;
        newData[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT_BRORHER] = moreThanOneNewComponentBrother;
        newData[FeaturesConst.ONE_ITEM_CRITERIO_BRORHER] = oneItemCriterionBrother;
        newData[FeaturesConst.MORE_ITEM_CRITERIO_BRORHER] = moreItemCriterionBrother;
        newData[FeaturesConst.TERM_CRITERION_BRORHER] = termCriterionBrother;

        newData["result"] = (node.getFeatures()[FeaturesConst.MORE_ITEM_CRITERIO] === 1 || node.getFeatures()[FeaturesConst.ONE_ITEM_CRITERIO] === 1) ? 'identification_item' : node.getEdges().length > 0 ? 'component_relevant' : 'no_relevant';
        return newData;
    }




}