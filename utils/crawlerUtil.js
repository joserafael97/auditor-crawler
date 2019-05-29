'use strict';

import TextUtil from '../utils/texUtil';
import XpathUtil from '../utils/xpathUtil';
import HtmlUtil from '../utils/htmlUtil';
import PuppeteerUtil from "../utils/puppeteerUtil";
import Element from '../models/element.class';
import Evaluation from '../models/evaluation.model';
import Item from '../models/item.model';
import Criterion from '../models/criterion.model';

import Node from '../bfs/node';

import {
    QUERYTOSTATICCOMPONENT
} from '../models/queryElement.class';

import urljoin from 'url-join';

export default class CrawlerUtil {

    static async extractEdges(node, page, puppeteer, criterionKeyWordName, elementsIdentify) {

        let queryElements = await XpathUtil.createXpathsToExtractUrls(criterionKeyWordName);
        let queryElementDynamicComponents = await XpathUtil.createXpathsToExtractDynamicComponents(criterionKeyWordName);
        queryElements = queryElements.concat(queryElementDynamicComponents);

        let edgesList = [];
        const currentValue = node.getSource().getValue();
        const currentUrl = await page.url();
        const currentNodeUrl = node.getSource().getUrl();

        for (let queryElement of queryElements) {
            const elements = await page.$x(queryElement.getXpath());
            if (elements.length > 0) {
                for (let element of elements) {
                    let text = await (await element.getProperty('textContent')).jsonValue();
                    const value = await (await element.getProperty('value')).jsonValue();
                    text = TextUtil.normalizeText(TextUtil.removeWhiteSpace(text)).length > 0 ? text :
                        (value !== undefined && value.length > 0) ? value : '';

                    // if (queryElement.getTypeQuery() === QUERYTOSTATICCOMPONENT) {
                    //     text = HtmlUtil.isUrl(text) ? text :
                    //         HtmlUtil.isUrl(urljoin(HtmlUtil.extractHostname(currentUrl), text)) ?
                    //             urljoin(HtmlUtil.extractHostname(currentUrl), text) : text;
                    // }

                    text = HtmlUtil.isUrl(text) ? text : TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));
                    
                    if (TextUtil.checkTextContainsInText(queryElement.getKeyWord(), text) &&
                        ((currentNodeUrl === currentUrl && text !== currentValue) ||
                            (currentNodeUrl !== currentUrl)) &&
                        !TextUtil.checkTextContainsArray(TextUtil.validateItemSearch(criterionKeyWordName), text.toLowerCase()) &&
                        !PuppeteerUtil.checkDuplicateNode(elementsIdentify, text, node, currentUrl)) {

                        if ((edgesList.filter((n) => n.getSource().getValue() === text)[0]) === undefined &&
                            ((node.getSourcesParents().filter((n) => n.getSource().getValue() === text)[0]) === undefined)) {
                            let source = new Element(text, element, queryElement.getXpath(), queryElement.getTypeQuery(), puppeteer, currentUrl);
                            edgesList.push(new Node(source, node));
                        }
                    }

                }

            }
        }
        node.setEdgesList(edgesList);
        return node;
    };


    static async identificationItens(criterionName, page, itensSearch = null, pageOrigin = page) {
        let itens = itensSearch !== null ? itensSearch : await CrawlerUtil.initializeItens(criterionName);

        for (let item of itens) {
            const element = (await page.$x(item.xpath))[0];
            if (!item.found && element !== undefined) {
                item.text = TextUtil.normalizeText(TextUtil.removeWhiteSpace(await (await element.getProperty('textContent')).jsonValue()));
                item.found = (item.text.length > 0 && TextUtil.checkTextContainsArray(item.keywordsXpath, item.text)) ? true : false;
                item.text = item.found ? item.text : '';
                item.pathSought = await page.url();
                await pageOrigin.screenshot({path: './proof/'+ criterionName + '-' + new Date()+'-proof.png'});
            }
        }
        return itens;
    }

    static async initializeItens(criterionName) {

        const itensIdentificationItensQueries = await XpathUtil.createXpathsToIdentificationKeyWord(criterionName);
        let itens = [];
        for (let query of itensIdentificationItensQueries) {
            itens.push(CrawlerUtil.createItem(query.getKeyWord(), query.getXpath(), query.getKeyWordsXpath()));
        }
        return itens;
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


    static createItem(name, xpath, keywordsXpath, found = false, foundText = '', pathSought = '', proof = '', proofText = '') {
        return Item({
            name: name,
            keywordsXpath: keywordsXpath,
            found: found,
            foundText: foundText,
            xpath: xpath,
            pathSought: pathSought,
            proof: proof,
            proofText: proofText
        });
    }
}