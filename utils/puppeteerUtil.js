'use-strict';

import puppeteer from 'puppeteer';
import TextUtil from '../utils/texUtil';
import HtmlUtil from '../utils/htmlUtil';
import PuppeteerInstance from '../models/puppeteerInstance.class';
import {
    XPATHIFRAME,
    UNUSABLEIFRAMES
} from '../utils/xpathUtil';



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
            headless: false
        });
        const [page] = await browser.pages();
        const mainPage = await page.target().page();
        await mainPage.setViewport({
            width: 1920,
            // width: 1600,
            height: 1080
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

    static async detectContext(page, xpath) {
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
        const nodeParent = parents[parents.length - 1];
        if (!HtmlUtil.isUrl(nodeParent.getSource().getValue())) {
            Promise.all([page.goto(nodeParent.getSource().getValue()).catch(e => void e), page.waitForNavigation().catch(e => void e)]);
        } else {
            if (parents.length > 0) {
                for (let parent of parents.reverse()) {
                    let source = parent.getSource();
                    if (HtmlUtil.isUrl(source.getValue())) {
                        Promise.all([page.goto(source.getValue()).catch(e => void e), page.waitForNavigation().catch(e => void e)]);
                    } else {
                        let element = await PuppeteerUtil.selectElementPage(page, source.getXpath(), source.getValue());
                        await element.click().catch(e => void e);
                        await page.waitForNavigation().catch(e => void e);
                    }
                }
            }
        }
    }


    static async selectElementPage(page, xpath, searchValue) {

        await page.waitForNavigation().catch(e => void e);
        const elements = await page.$x(xpath);
        if (elements.length > 0) {
            for (let element of elements) {

                let text = await (await element.getProperty('textContent')).jsonValue();
                const propertyHandleValue = await element.getProperty('value');
                text = HtmlUtil.isUrl(text) ? text : TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));

                text = text.length > 0 ? text :
                    TextUtil.normalizeText(TextUtil.removeWhiteSpace(await propertyHandleValue.jsonValue()));
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

            for (let node of arrayNodes) {
                const value = node.getSource().getValue();

                if ((node.getLevel() !== 0 &&
                        currentNode.getSource().getValue() === node.getParent().getSource().getValue()) &&
                    (node.getSource().getUrl() === currentUrl && value == text)) {
                    return true;
                }


            }
            return false;
        }
    }

}