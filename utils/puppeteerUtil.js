'use-strict';

import puppeteer from 'puppeteer'
import TextUtil from '../utils/texUtil'
import PuppeteerInstance from '../models/puppeteerInstance.class'
import {
    XPATHIFRAME,
    UNUSABLEIFRAMES
} from '../utils/xpathUtil'

import Node from '../bfs/node'



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

    static async resetPage(page, node) {

        //level 01 e 02 use url and max single xpath.
        if (node.getLevel() < 3) {
            try {
                await page.reload();
            } catch (e) {
                console.log(e)
            }
            return page;
        }

        return page;
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