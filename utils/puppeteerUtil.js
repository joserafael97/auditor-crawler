'use-strict';

import puppeteer from 'puppeteer'
import PuppeteerInstance from '../models/puppeteerInstance.class'
import { XPATHIFRAME } from '../utils/xpathUtil'

export default class PuppeteerUltil {


    static async createPuppetterInstance() {
        const browser = await puppeteer.launch({
            args: [
                // '--no-sandbox', 
            '--start-fullscreen'],
            headless: false
        });
        const [page] = await browser.pages();
        const mainPage = await page.target().page();
        await mainPage.setViewport({
            width: 1920,
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

    static async detectContext(page) {
        if (await PuppeteerUltil.checkXpath(page, XPATHIFRAME)) {
            console.log('iFRAME return')
            return page.frames()[0]
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
