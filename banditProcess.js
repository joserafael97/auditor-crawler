'use-strict';

import PuppeteerUtil from "./utils/puppeteerUtil";
import CrawlerUtil from './utils/crawlerUtil';
import HtmlUtil from './utils/htmlUtil';
import { GaussianNB } from 'ml-naivebayes';
import EpsilonGreedy from './epsilonGreedy';
import FeaturesConst from './consts/featuares';


export default class BanditProcess {

    static async initilize(node, puppeteer = null, queue, criterion, evaluation, elementsAccessed = [], itens = null, model, epsilonGreedyAlg, xTrain = [], yTrain = []) {
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

            if (node.getLevel() > 0) {
                xTrain.push([
                node.getFeatures()[FeaturesConst.HAVE_URL_RELEVANT],
                node.getParent().getFeatures()[FeaturesConst.HAVE_URL_RELEVANT],
                node.getParent().getFeatures()[FeaturesConst.HAVE_ONE_ITEM_CRITERIO],
                node.getParent().getFeatures()[FeaturesConst.HAVE_TWO_ITEM_CRITERIO],
                node.getParent().getFeatures()[FeaturesConst.HAVE_MORE_ITEM_CRITERIO],
                ]);
                yTrain.push(node.getFeatures()[FeaturesConst.RESULT]);
                model.train(xTrain, yTrain);
            } 

            console.log("xtrain:", xTrain)
            console.log("yTrain:", yTrain)
        } catch (e) {
            console.log("************click error*****************", e);
        }

       
        // CLASSIFICATION
        // 01. Retrain classifier with new result 
 
        page = currentPage;

        if (queue.length > 0 && CrawlerUtil.checkItensComplete(itens) === false) {

            epsilonGreedyAlg.updateNumArms(queue.length);
            const index = epsilonGreedyAlg.chooseArm();

            console.log("index ======================== ", index)

            const newNode = queue[index]
            queue.splice(index, 1);

            if (newNode.getLevel() > 0 && !HtmlUtil.isUrl(newNode.getSource().getValue())) {
                await page.waitForNavigation().catch(e => void e);
                await PuppeteerUtil.accessParent(page, newNode.getSourcesParents());
            }
            return BanditProcess.initilize(newNode, puppeteer, queue, criterion, evaluation, elementsAccessed, itens, model, epsilonGreedyAlg, xTrain, yTrain);

            // BANDIT APROACH
            // 01. Update reward
            // 02. Select best or random Arm (Node in this case)

            // RETURN FUNCTION AGAIN WITH NODE SELECT
        }

        console.log("*********************close browser***********************************************");
        await puppeteer.getBrowser().close();
        return itens;
    };

}