'use-strict';

import puppeteer from 'puppeteer';
import TextUtil from './textUtil';
import HtmlUtil from '../utils/htmlUtil';
import StringSimilarity from 'string-similarity'
import PuppeteerInstance from '../models/puppeteerInstance.class';
import {
    XPATHIFRAME,
    UNUSABLEIFRAMES
} from '../utils/xpathUtil';
import { is } from 'bluebird';



export default class PuppeteerUtil {


    static async createPuppetterInstance() {
        const browser = await puppeteer.launch({
            args: [
                '--unlimited-storage',
                '--full-memory-crash-report',
                '--no-sandbox',
                '--start-fullscreen',
                '--disable-extensions',
                '--ignore-certificate-errors',
                '--disable-dev-shm-usage',
                '--disable-webgl',
                '--disable-popup-blocking',
                '--blacklist-webgl',
                '--blacklist-accelerated-compositing',

            ],
            headless: true,
        });
        const [page] = await browser.pages();
        const mainPage = await page.target().page();
        await mainPage.setViewport({
            width: 3000,
            height: 2000
        });

        return new PuppeteerInstance(browser, [mainPage]);
    }

    static async clickByXpath(page, xpath) {
        const linkHandlers = await page.$x(xpath);
        if (linkHandlers.length > 0) {
            await linkHandlers[0].click();
        } else {
            throw new Error(`Link not found: ${xpath}`);
        }
    };

    static async checkVisibleByXpath(page, xpath) {
        await page.waitForXPath(xpath, {
            visible: true,
        }).catch((e) => false);

    }

    static async detectContext(page, urls = [], node = null) {
        if (await PuppeteerUtil.checkXpath(page, XPATHIFRAME)) {
            for (const frame of page.mainFrame().childFrames()) {
                let urlFrame = await frame.url();
                let validation = true;
                if (node !== null && urls.length > 0 && PuppeteerUtil.checkDuplicateNode(urls, urlFrame, node, urlFrame)) {
                    validation = false;
                }

                if (validation && !TextUtil.checkTextContainsArray(UNUSABLEIFRAMES, urlFrame)) {
                    return frame;
                }
            }
        }
        return page;
    }


    static async checkXpath(page, xpath) {
        const linkHandlers = await page.$x(xpath);

        if (linkHandlers.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    static async accessParent(page, parents) {
        if (parents.length > 0) {
            const nodeParent = parents[0];
            if (HtmlUtil.isUrl(nodeParent.getSource().getValue())) {
                Promise.all([page.goto(nodeParent.getSource().getValue()).catch(e => void e), page.waitForNavigation().catch(e => void e)]);
            } else {
                const currentPage = page;
                for (let parent of parents.reverse()) {
                    let source = parent.getSource();
                    if (HtmlUtil.isUrl(source.getValue())) {
                        Promise.all([page.goto(source.getValue()).catch(e => void e), page.waitForNavigation().catch(e => void e)]);
                    } else {
                        if (parent.getSource().getIsExtractIframe() && (await page.constructor.name) !== "Frame") {
                            await page.waitForNavigation().catch(e => void e);
                            page = await PuppeteerUtil.detectContext(page).catch(e => void e);
                        }
                        let element = await PuppeteerUtil.selectElementPage(page, source.getXpath(), source.getValue());
                        if (element) {
                            await element.click().catch(e => void e);
                            await page.waitForNavigation().catch(e => void e);
                        }
                    }
                }
                page = currentPage;
            }
        }
    }


    static async selectElementPage(page, xpath, searchValue) {

        await page.waitForNavigation().catch(e => void e);
        await page.waitFor(6000);
        let elements = []
        elements = await page.$x(xpath).catch(e => void e);
        
        if (elements.length > 0) {
            for (let element of elements) {
                let text = await (await element.getProperty('textContent')).jsonValue();
                const propertyHandleValue = await (await element.getProperty('value')).jsonValue();
                text = HtmlUtil.isUrl(text) ? text : TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));
                text = text != undefined && text.length > 0 ? text :
                    propertyHandleValue != undefined && propertyHandleValue.length > 0 ?
                        TextUtil.normalizeText(TextUtil.removeWhiteSpace(propertyHandleValue)) : '';
                if (text === searchValue) {
                    return element;
                }
            }
        }
        return null;
    }

    static checkDuplicateNode(arrayNodes, text, currentNode, currentUrl, edgesList = null) {
        
        if (HtmlUtil.isUrl(text)) {
            let urlsList = [];
            urlsList.push.apply(urlsList, TextUtil.getUrlsNodes(arrayNodes))
            edgesList !== null ? urlsList.push.apply(urlsList, TextUtil.getUrlsNodes(edgesList)) : urlsList;
            return TextUtil.similarityUrls(text, urlsList);
        } else {
            let allNodes = [];
            let numRepetText = 0
            allNodes.push.apply(allNodes, arrayNodes)
            allNodes.push.apply(allNodes, edgesList)
            let isDate = /\d{2}(\/)\d{2}(\/)\d{4}/.test(text);
            text = text.trim();
            const isnum = (/^\d+$/.test(text));

            text = (/\d{2,20}(\/)\d{4}/.test(text)) && !isDate ? text.substring(text.length - 4, text.length) : text;
            const currentValue = currentNode.getSource().getValue();
        
            if (isDate) {
                return true;
            }

            if (isnum) {
                text = text.substr(0, 2);
            }

            for (let node of allNodes) {
                let value = node.getSource().getValue();
                value = (/\d{2,20}(\/)\d{4}/.test(value)) && !(/\d{2}(\/)\d{2}(\/)\d{4}/.test(value)) ? value.substring(value.length - 4, value.length) : value;

                value = ( isnum && (/^\d+$/.test(value)))  ? value.substr(0, 2) : value;

                if (isnum && StringSimilarity.compareTwoStrings(text, value) > 0.95) {
                    return true;
                }

                if (node.getLevel() !== 0) {

                    if (node.getSource().getUrl() === currentUrl || StringSimilarity.compareTwoStrings(node.getSource().getUrl(), currentUrl) > 0.95) {
                        if ((value === text || currentValue === text) || StringSimilarity.compareTwoStrings(value, text) > 0.95) {

                            numRepetText++;
                            if (((currentNode.getLevel() + 1) === node.getLevel() && value === text) || (currentValue === text || numRepetText > 3)) {
                                return true;
                            }
                        }
                    }
                }

            }
            return false;
        }
    }

}