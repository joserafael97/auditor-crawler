'use-strict';

import puppeteer from 'puppeteer';
import TextUtil from '../utils/texUtil';
import HtmlUtil from '../utils/htmlUtil';
import PuppeteerInstance from '../models/puppeteerInstance.class';
import {
    XPATHIFRAME,
    UNUSABLEIFRAMES
} from '../utils/xpathUtil';

import Node from '../bfs/node';



export default class PuppeteerUltil {


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
            // width: 1700,
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
        if (await PuppeteerUltil.checkXpath(page, XPATHIFRAME)) {
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
                        await (await PuppeteerUltil.selectElementPage(page, source.getXpath(), source.getValue())).click();
                        await page.waitForNavigation().catch(e => void e);
                    }
                }
            }
        }


    }


    static async selectElementPage(page, xpath, searchValue) {
        const elements = await page.$x(xpath);

        if (elements.length > 0) {
            for (let element of elements) {
                let text = await (await element.getProperty('textContent')).jsonValue();
                text = HtmlUtil.isUrl(text) ? text : TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));
                if (text === searchValue) {
                    return element;
                }
            }
        }

        return null;

    }

    static checkDuplicateNode(arrayNodes, text, currentUrl){
        for (let node of arrayNodes) {
            const value = node.getSource().getValue();
            if (HtmlUtil.isUrl(text)) {
                if(text === value || text.includes(value)){
                    return true;
                }
            }else{
                console.log("----------------------ja pesquisado----------------", node.getResearched())
                console.log("----------------------URL igual----------------", node.getSource().getUrl() === currentUrl)
                console.log("----------------------testl----------------",text)
                console.log("----------------------text----------------", node.getSource().getValue() == text)

                if ((node.getResearched() && node.getSource().getUrl() === currentUrl) && node.getSource().getValue() == text){
                    return true;
                }
            }
    
        }
        return false;
    }



    // static async searchNewWindow(puppeteer, xpath){
    //     numPages = (await browser.pages()).length
    //     if SeleniumUtil.checar_existe_xpath(driver, xpath):
    //         return driver

    //     elif SeleniumUtil.checar_existe_outra_janela(driver):
    //         driver = SeleniumUtil.mudar_janela(driver)
    //         if SeleniumUtil.checar_existe_xpath(driver, xpath):
    //             return driver
    //         else:
    //             return None

    //     else:
    //         return None
    // }

}