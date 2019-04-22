'use strict';

export default class PuppeteerInstance {
    
    constructor(browser, pages) {
        this.browser = browser;
        this.pages = pages;
    }

    addPage(page) {
        this.pages.push(page);
    }

    getLastPage() {
        return this.pages[this.pages.length - 1];
    }

    getFirstPage() {
        return this.pages[0];
    }

    getPage(index) {
        return this.pages[index];
    }

    getBrowser() {
        return this.browser;
    }


}