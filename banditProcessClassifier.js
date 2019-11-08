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
            
            if (node.getLevel() > 0) {
                for (let i = 0; i < queue.length; i++) {
                    let xPred = this.formatData(this.getFeaturesWithOutResultNode(queue[i]));
                    const predict = model.predict([xPred]);
                    if (predict[0] > 0)
                        epsilonGreedyAlg.update(i, predict[0])
                }
            }

            const index = epsilonGreedyAlg.chooseArm();
            console.log("values ======================== ", epsilonGreedyAlg.values)
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

    static getFeaturesWithOutResultNode(node) {
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

        return newData;
    }

    static formatData(data) {
        return [
            data[FeaturesConst.URL_RELEVANT],
            data[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT_PARENT],
            data[FeaturesConst.URL_RELEVANT_PARENT],
            data[FeaturesConst.TERM_CRITERION_PARENT],
            data[FeaturesConst.ONE_ITEM_CRITERIO_PARENT],
            data[FeaturesConst.MORE_ITEM_CRITERIO_PARENT],
            data[FeaturesConst.URL_RELEVANT_BRORHER],
            data[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT_BRORHER],
            data[FeaturesConst.ONE_ITEM_CRITERIO_BRORHER],
            data[FeaturesConst.MORE_ITEM_CRITERIO_BRORHER],
            data[FeaturesConst.TERM_CRITERION_BRORHER],
        ];
    }






}