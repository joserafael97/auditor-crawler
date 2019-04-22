'use-strict';

import Node from './bfs/node'
import PuppeterUtil from './utils/puppeteerUtil';
import XpathUtil from './utils/xpathUtil'
import connectToDb from './db/connect'
import urljoin from 'url-join'

let root = new Node('http://www.transparenciaativa.com.br/Principal.aspx?Entidade=175',
    [], null, false);


//Create queue
let queue = [];


//Maintains list of visited pages
let visited_list = [];

const clickByText = async (page, xpath) => {
    const linkHandlers = await page.$x(xpath);
    if (linkHandlers.length > 0) {

        await linkHandlers[0].click();
        console.log('***********clicou*****************')

    } else {
        throw new Error(`Link not found: ${xpath}`);
    }
};

connectToDb();

function extractHostname(url) {
    let hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}


const run2 = async (node) => {
    const puppeteer = await PuppeterUtil.createPuppetterInstance();
    const page = puppeteer.getFirstPage();

    //access url node
    await Promise.all([page.goto(node.url), page.waitForNavigation()]);
    node.setResearched(true);

    let xpaths = await XpathUtil.createXpathsToExtractUrls('Despesa Extra Orçamentária');

    console.log("DOMAIN", extractHostname(page.url()));

    for (let xpath of xpaths){
        const element = await page.$x(xpath);
        const text = element[0] !== undefined ? await (await element[0].getProperty('textContent')).jsonValue() : 'not found';
        console.log(isUrl(text))
        console.log(urljoin(extractHostname(page.url()), text));
    }

    await page.waitFor(2000)


    return puppeteer.getBrowser().close();

}

const logErrorAndExit = err => {
    console.log(err);
    process.exit();
};

run2(root).catch(logErrorAndExit);



const run = async (node) => {
    visited_list.push(url);

    if (queue.length > 5) {
        return;
    }
    let urls = [];

    // extract urls and components proccess
    //for (let index = 0; index < 3; index++) {
    //  urls.push("www.facebook" + index + ".net");
    //}

    for (let index = 0; index < urls.length; index++) {
        let flag = 0;
        // Complete relative URLs and strip trailing slash
        let completeUrl = urls[index]; //urljoin(url, i["href"]).rstrip('/')

        // Check if the URL already exists in the queue
        for (let j in queue) {
            if (j == completeUrl) {
                flag = 1;
                break;

            }
        }

        // If not found in queue
        if (flag == 0) {
            if (queue.length > 5) {
                return;
            }

            if (!visited_list.includes(completeUrl)) {
                queue.push(completeUrl);
            }
        }
    }

    //Pop one URL from the queue from the left side so that it can be crawled
    let current = queue.shift();

    //Recursive call to crawl until the queue is populated with 100 URLs
    return crawl(current);

}


// // crawl("www.google.com.br");

// // Print queue
// for (let j in queue) {
//     console.log(j);
// }

// console.log();
// console.log("==============");
// console.log("Pages crawled:");
// console.log("==============");
// console.log();

// // Print list of visited pages
// for (let j in visited_list) {
//     console.log(j);

// }