'use strict';

import TextUtil from './textUtil';
import XpathUtil from '../utils/xpathUtil';
import HtmlUtil from '../utils/htmlUtil';
import PuppeteerUtil from "../utils/puppeteerUtil";
import Element from '../models/element.class';
import Evaluation from '../models/evaluation.model';
import Item from '../models/item.model';
import Criterion from '../models/criterion.model';
import FileUtil from '../utils/fileUtil';
import FeaturesConst from '../consts/featuares';
import logger from '../core/logger/app-logger'

import Node from '../models/node';

import {
    QUERYTOSTATICCOMPONENT
} from '../models/queryElement.class';

import urljoin from 'url-join';

export default class CrawlerUtil {


    /**
     * Access Node (new Component dinamically or URL) and search for new nodes and itens of criterion.
     * @param {Criterion} criterion - Criterion searched.
     * @param {Evaluation} evaluation - Evaluation actually instance.
     * @param {Node} node - Node crawling.
     * @param {puppeteer} page - Page puppeteer instace.
     * @param {[Node]} elementsAccessed - list accessed nodes.
     * @param {[Item]} itens - list itens criterion.
     * @param {[Node]} queue - list nodes note accessed.
     */
    static async crawlerNode(criterion, evaluation, node, page, elementsAccessed, itens, queue, withOutSearchKeyWord = false) {

        const xpath = node.getSource().getXpath();
        const value = node.getSource().getValue();
        const isUrl = HtmlUtil.isUrl(value);
        let changeUrl = false;
        let newCurrentURL = await page.url();
        const currentURL = await page.url();
        const currentPage = page;

        logger.info("********************************************************************");
        logger.info("value: ", value);
        logger.info("level: ", node.getLevel());

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
                        logger.warn("Button Aceitar not clicked: ", e);
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
            node = await CrawlerUtil.extractEdges(node, page, criterion.name, elementsIdentify, withOutSearchKeyWord);
            itens = await CrawlerUtil.identificationItens(criterion.name, page, itens, currentPage, evaluation, node);
        }

        queue.push.apply(queue, node.getEdges());
        node.setResearched(true);
        elementsAccessed.push(node);

        return { "node": node, "queue": queue, "elementsAccessed": elementsAccessed, "itens": itens };
    }

    static async extractEdges(node, page, criterionKeyWordName, elementsIdentify, withOutSearchKeyWord = false) {

        let queryElements = await (withOutSearchKeyWord ? XpathUtil.createXpathsToExtractUrls(criterionKeyWordName) :
            XpathUtil.createXpathsToExtractUrlsByCriterion(criterionKeyWordName));

        const queryElementDynamicComponents = await (withOutSearchKeyWord ? XpathUtil.createXpathsToExtractDynamicComponents(criterionKeyWordName) :
            XpathUtil.createXpathsToExtractDynamicComponents(criterionKeyWordName));

        queryElements = queryElements.concat(queryElementDynamicComponents);

        let edgesList = [];
        let result = node.getFeatures();
        const currentValue = node.getSource().getValue();
        const currentUrl = await page.url();
        const currentNodeUrl = node.getSource().getUrl();
        result[FeaturesConst.HAVE_URL_RELEVANT] = TextUtil.checkUrlRelvant(currentUrl, criterionKeyWordName) ? 1 : 0;

        for (let queryElement of queryElements) {
            const elements = await page.$x(queryElement.getXpath());
            if (elements.length > 0) {
                for (let element of elements) {
                    let text = await (await element.getProperty('textContent')).jsonValue();
                    const value = await (await element.getProperty('value')).jsonValue();
                    text = TextUtil.normalizeText(TextUtil.removeWhiteSpace(text)).length > 0 ? text :
                        (value !== undefined && value.length > 0) ? value : '';

                    if (queryElement.getTypeQuery() === QUERYTOSTATICCOMPONENT) {
                        text = HtmlUtil.isUrl(text) ? text :
                            HtmlUtil.isUrl(urljoin(HtmlUtil.extractHostname(currentUrl), text)) ?
                                urljoin(HtmlUtil.extractHostname(currentUrl), text) : text;
                    }
                    text = HtmlUtil.isUrl(text) ? text : TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));

                    if ((TextUtil.checkTextContainsArray(queryElement.getKeyWordsXpath(), TextUtil.normalizeText(TextUtil.removeWhiteSpace(text)))
                        || (/^\d+$/.test(text))) &&
                        ((currentNodeUrl === currentUrl && text !== currentValue) ||
                            (currentNodeUrl !== currentUrl))) {
                        const isUrl = HtmlUtil.isUrl(text);

                        text = !isUrl && (await CrawlerUtil.hrefValid(element, currentUrl)) ? await (await element.getProperty('href')).jsonValue() : text;

                        if (!TextUtil.checkTextContainsArray(TextUtil.validateItemSearch(criterionKeyWordName), text.toLowerCase()) &&
                            !PuppeteerUtil.checkDuplicateNode(elementsIdentify, text, node, currentUrl, edgesList)) {

                            if ((edgesList.filter((n) => n.getSource().getValue() === text)[0]) === undefined &&
                                ((node.getSourcesParents().filter((n) => n.getSource().getValue() === text)[0]) === undefined)) {
                                if (text.length > 0) {
                                    let source = new Element(text, element, queryElement.getXpath(), queryElement.getTypeQuery(), currentUrl, (await page.constructor.name) === "Frame" || queryElement.getIsExtractIframe());
                                    edgesList.push(new Node(source, node));
                                }
                            }
                        }

                    }

                }
            }
        }
        node.setFeatures(result)
        node.setEdgesList(edgesList);
        return node;
    };

    static async hrefValid(element, currentUrl) {
        const url = await (await element.getProperty('href')).jsonValue();
        const onclick = await (await element.getProperty('onclick')).jsonValue();

        const actuallyUrl = TextUtil.checkTextContainsInText('#', currentUrl) ? currentUrl :
            currentUrl.substring(currentUrl.lastIndexOf('/')) === '/' ? currentUrl + '#' : currentUrl + '/#';

        if (url !== undefined && (onclick !== null ||
            (actuallyUrl === url || TextUtil.checkTextContainsInText('frameContent', url)))) {
            return false
        }

        return ((url !== undefined && HtmlUtil.isUrl(url))) ? true :
            url !== undefined && HtmlUtil.isUrl(urljoin(HtmlUtil.extractHostname(currentUrl), url)) ? true : false;
    }


    static async identificationItens(criterionName, page, itensSearch = null, pageOrigin = page, evaluation, node) {
        let itens = itensSearch !== null ? itensSearch : await CrawlerUtil.initializeItens(criterionName);
        let numberItensIdentify = 0;
        let result = node.getFeatures();

        for (let item of itens) {
            const element = (await page.$x(item.xpath))[0];
            if (element !== undefined && !item.valid) {
                let path = FileUtil.createMultiDirecttory('./proof/' + evaluation.county,
                    "/" + evaluation.date.toISOString(), "/" + criterionName)
                path = path + "/" + criterionName + '-' +
                    item.name + '-level-' + node.getLevel() + '-' + new Date() + '-proof.png'

                item.foundText = TextUtil.normalizeText(TextUtil.removeWhiteSpace(await (await element.getProperty('textContent')).jsonValue()));
                item.found = (item.foundText.length > 0 && TextUtil.checkTextContainsArray(item.keywordsXpath, item.foundText)) ? true : false;
                item.foundText = item.found ? item.foundText : '';
                item.pathSought = await page.url();
                item.proofText = await (await element.getProperty('innerHTML')).jsonValue();
                item.tagName = await CrawlerUtil.extractTagName(element, page);
                const parentLevelOne = (await element.$x('..'))[0];
                const parentLevelTwo = (await parentLevelOne.$x('..'))[0];
                item.textParents = await CrawlerUtil.extractValuesParents(parentLevelOne, parentLevelTwo);
                item.tagNameParents = await CrawlerUtil.extractTagNameParents(parentLevelOne, parentLevelTwo, page);
                await CrawlerUtil.setColorElementByXpath(item.xpath, page);
                await pageOrigin.screenshot({
                    path: path
                });
                item.proof.length > 0 ? FileUtil.deleteFile(item.proof) : '';
                item.proof = path;

                numberItensIdentify = item.found ? numberItensIdentify + 1 : numberItensIdentify;
            }
        }
        result[FeaturesConst.RESULT] = numberItensIdentify > 0 ? 1 : 0;
        node.setRewardValue(numberItensIdentify > 0 ? 1 : 0);
        result[FeaturesConst.HAVE_ONE_ITEM_CRITERIO] = numberItensIdentify === 1 ? 1 : 0;
        result[FeaturesConst.HAVE_TWO_ITEM_CRITERIO] = numberItensIdentify === 2 ? 1 : 0;
        result[FeaturesConst.HAVE_MORE_ITEM_CRITERIO] = numberItensIdentify > 2 ? 1 : 0;
        const valid = await CrawlerUtil.CheckCriterionTermExistsInPage(criterionName, node, page)
        result[FeaturesConst.HAVE_CRITERION_TERM_IN_PAGE] = valid ? 1 : 0;

        node.setFeatures(result)
        CrawlerUtil.checkIdentificationItens(itens, await page.url());
        return itens;
    }


    static async checkIdentificationItens(itens, currentURL) {
        let sameIdentificationCount = 0
        for (let itemEvaluation of itens) {
            if (itemEvaluation.found && itemEvaluation.pathSought === currentURL) {

                for (let item of itens) {
                    if ((item.found && item.name !== itemEvaluation.name)) {
                        if (item.pathSought === itemEvaluation.pathSought) {
                            sameIdentificationCount++;
                        }
                    }
                }

                if (sameIdentificationCount < itens.length) {
                    let tagsName = itemEvaluation.tagNameParents;
                    tagsName.push(itemEvaluation.tagName);
                    itemEvaluation.valid = TextUtil.checkRelevantTagInTagsNameItem(tagsName);
                } else {
                    itemEvaluation.valid = true;
                }
            }


        }

    }

    static checkItensComplete(itens) {
        let count = 0
        for (let item of itens) {
            if (item.valid) {
                count++;
            }
        }
        return itens.length === count ? true : false;
    }


    static async extractValuesParents(parentLevelOne, parentLevelTwo) {
        let values = [];
        values.push(await (await parentLevelOne.getProperty('innerHTML')).jsonValue());
        values.push(await (await parentLevelTwo.getProperty('innerHTML')).jsonValue());
        return values;
    }

    static async extractTagNameParents(parentLevelOne, parentLevelTwo, page) {
        let values = [];
        values.push(await CrawlerUtil.extractTagName(parentLevelOne, page));
        values.push(await CrawlerUtil.extractTagName(parentLevelTwo, page));
        return values;
    }


    static async setColorElementByXpath(xpath, page) {
        await page.evaluate((xpath) => {
            let element = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
            var thisHeading = element.iterateNext();
            thisHeading.style.backgroundColor = '#4F0665'
            thisHeading.style.color = '#ffffff'
            return element;
        }, xpath);
    }

    static async extractTagName(element, page) {
        return (await page.evaluate(element => element.tagName, element)).toLowerCase();
    }

    static async initializeItens(criterionName) {

        const itensIdentificationItensQueries = await XpathUtil.createXpathsToIdentificationKeyWord(criterionName);
        let itens = [];
        for (let query of itensIdentificationItensQueries) {
            if (query.getKeyWord().length > 0) {
                itens.push(CrawlerUtil.createItem(query.getKeyWord(), query.xpath, query.getKeyWordsXpath()));
            }
        }
        return itens;
    }

    static async CheckCriterionTermExistsInPage(criterionName, node, page) {
        const queryElement = XpathUtil.createXpathsToIdentifyPage(criterionName);

        const elements = await page.$x(queryElement.getXpath());
        if (elements.length > 0) {
            for (let element of elements) {
                let text = await (await element.getProperty('textContent')).jsonValue();
                text = TextUtil.normalizeText(text);
                for (const term of queryElement.getKeyWordsXpath()) {
                    if (TextUtil.checkTextContainsInText(text, term) || TextUtil.checkTextContainsInText(term, text) ||
                        TextUtil.similarityTwoString(text, term))
                        return true;
                }
            }
        }

        return false;
    }

    static createCriterion(criterionName) {
        return Criterion({
            name: criterionName,
        });
    }

    static createEvaluation(county, cityHallUrl, transparencyPortalUrl) {
        return Evaluation({
            date: new Date(),
            county: county,
            cityHallUrl: cityHallUrl,
            transparencyPortalUrl: transparencyPortalUrl,
        });
    }


    static createItem(name, xpath, keywordsXpath, found = false, valid = false, foundText = '',
        pathSought = '', proof = '', proofText = '', tagName = '', tagNameParents = []) {
        return Item({
            name: name,
            keywordsXpath: keywordsXpath,
            found: found,
            foundText: foundText,
            xpath: xpath,
            pathSought: pathSought,
            proof: proof,
            proofText: proofText,
            valid: valid,
            tagName: tagName,
            tagNameParents: tagNameParents
        });
    }
}