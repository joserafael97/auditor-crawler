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
                '--no-sandbox',
                '--disable-features=site-per-process',
                '--start-fullscreen',
                '--disable-extensions',
                '--ignore-certificate-errors',
                '--disable-dev-shm-usage',
                '--disable-webgl',
                '--disable-popup-blocking',
                '--blacklist-webgl',
                '--blacklist-accelerated-compositing',
                '--dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-accelerated-compositing',
                '--disable-accelerated-layers',
                '--disable-accelerated-plugins',
                '--disable-accelerated-video',
                '--disable-accelerated-video-decode',
                '--disable-infobars',
                '--test-type',
            ],
            headless: true
        });
        const [page] = await browser.pages();
        const mainPage = await page.target().page();
        await mainPage.setViewport({
            width: 2000,
            height: 3000
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

    static async detectContext(page) {
        if (await PuppeteerUtil.checkXpath(page, XPATHIFRAME)) {
            for (const frame of page.mainFrame().childFrames()) {
                if (!TextUtil.checkTextContainsArray(UNUSABLEIFRAMES, frame.url())) {
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
                        await element.click().catch(e => void e);
                        await page.waitForNavigation().catch(e => void e);
                    }
                }
                page = currentPage;
            }
            await page.waitFor(3000);

        }
    }


    static async selectElementPage(page, xpath, searchValue) {

        await page.waitForNavigation().catch(e => void e);
        await page.waitFor(3000);
        const elements = await page.$x(xpath);
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
            allNodes.push.apply(allNodes, arrayNodes)
            allNodes.push.apply(allNodes, edgesList)
            const isnum = /^\d+$/.test(text);
            const currentValue = currentNode.getSource().getValue();

            if (isnum) {
                return true;
            }

            for (let node of allNodes) {
                const value = node.getSource().getValue();


                if (node.getLevel() !== 0) {
                    if ((HtmlUtil.isUrl(currentValue) && node.getSource().getUrl() === currentUrl)) {
                        if (((currentValue === value || value === text) ||
                            (isnum &&
                                StringSimilarity.compareTwoStrings(value.substring(value.length - 4, value.length),
                                    text.substring(text.length - 4, text.length)) > 0.6)) ||
                            StringSimilarity.compareTwoStrings(value, text) > 0.95) {

                            return true;
                        }
                    }
                }


            }
            return false;
        }
    }

}