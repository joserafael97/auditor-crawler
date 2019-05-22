'use strict';

import TextUtil from '../utils/texUtil';
import XpathUtil from '../utils/xpathUtil';
import HtmlUtil from '../utils/htmlUtil';
import PuppeteerUtil from "../utils/puppeteerUtil";
import Element from '../models/element.class';
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
                    const propertyHandleValue = await element.getProperty('value');
                    text = HtmlUtil.isUrl(text) ? text : TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));

                    text = text.length > 0 ? text :
                        await propertyHandleValue.jsonValue();
                    if (queryElement.getTypeQuery() === QUERYTOSTATICCOMPONENT) {
                        text = HtmlUtil.isUrl(text) ? text :
                            HtmlUtil.isUrl(urljoin(HtmlUtil.extractHostname(currentUrl), text)) ?
                            urljoin(HtmlUtil.extractHostname(currentUrl), text) : undefined;
                    }
                    if (text !== undefined) {
                        
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
        }
        node.setEdgesList(edgesList);
        return node;
    };
}