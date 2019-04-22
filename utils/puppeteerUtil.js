'use-strict';

import puppeteer from 'puppeteer' 
import PuppeteerInstance from '../models/puppeteerInstance.class'


export default class PuppeteerUltil {

    
    static async createPuppetterInstance(){
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--start-fullscreen'],
            headless: false
        });    
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080
        });

        return new PuppeteerInstance(browser, [page]);
    }

}
