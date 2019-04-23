'use-strict';

import Node from './bfs/node'
import PuppeterUtil from './utils/puppeteerUtil';
import XpathUtil from './utils/xpathUtil'
import HtmlUtil from './utils/htmlUtil'
import TextUtil from './utils/texUtil'
import Element from './models/element.class'
import connectToDb from './db/connect'
import urljoin from 'url-join'
import {
    QUERYTODYNAMICELEMENT,
    QUERYTOSTATICCOMPONENT
} from './models/queryElement.class'

// let root = new Node('http://www.transparenciaativa.com.br/Principal.aspx?Entidade=175',
//     [], null, false);

let root = new Node('http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=O5w=&uf=PB',
    [], null, false);


//Create queue
let queue = [];


//Maintains list of visited pages
let visited_list = [];


connectToDb();

const extractEdges = async (node, page, puppeteer, criterionKeyWordName) => {

    let queryElements = await XpathUtil.createXpathsToExtractUrls(criterionKeyWordName);
    let queryElementDynamicComponents = await XpathUtil.createXpathsToExtractDynamicComponents(criterionKeyWordName);
    queryElements = queryElements.concat(queryElementDynamicComponents);

    let edgesList = [];

    for (let queryElement of queryElements) {

        const elements = await page.$x(queryElement.getXpath());

        if (elements.length > 0) {
            for (let element of elements) {
                let text = await (await element.getProperty('textContent')).jsonValue();

                if (queryElement.getTypeQuery() === QUERYTOSTATICCOMPONENT) {
                    text = HtmlUtil.isUrl(text) ? text :
                        HtmlUtil.isUrl(urljoin(HtmlUtil.extractHostname(page.url()), text)) ?
                            urljoin(HtmlUtil.extractHostname(page.url()), text) : undefined;
                }

                if (text !== undefined) {
                    text = TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));
                    if ((edgesList.filter((n) => n.getSource().getValue() === text)[0]) === undefined) {
                        edgesList.push(new Node(new Element(text, element, queryElement.getXpath(), queryElement.getTypeQuery(), puppeteer), node));
                    }
                }
            }

        }
    }

    node.setEdges(edgesList);
    return node;
}


const run2 = async (node, puppeteer = null) => {

    try {
        if (puppeteer == null) {
            puppeteer = await PuppeterUtil.createPuppetterInstance();
        }

        let page = puppeteer.getFirstPage();

        //node root
        if (node.getParent().length === 0) {
            await Promise.all([page.goto(node.source), page.waitForNavigation()]);
            node = await extractEdges(node, page, puppeteer, 'Despesa Extra Orçamentária');

        } else {
            const value = node.getSource().getValue();
            const element = node.getSource().getElement();
            const xpath = node.getSource().getXpath();

            if (HtmlUtil.isUrl(value)) {
                await Promise.all([page.goto(value), page.waitForNavigation()]);
            } else {
                await element.click();
                try {
                    await page.waitForNavigation();
                    page = await PuppeterUtil.detectContext(puppeteer, xpath);
                } catch (e) {
                    console.log("deu erro na mudança,,,", e);
                }

                console.log("elements parent: ", node.getSourcesParents())

                //extract new components
                //TODO

                //resert page
                page.reload();

                console.log("fechou......: ")

            }

            console.log("Value: ", value);

        }

        //TODO verify if is URL or Xpath and root Node
        node.setResearched(true);

        //detect itens of criterion

        while (node.getEdges().length > 0) {
            const newNode = node.shiftEdge();
            console.log("TAM FIM: ", node.getEdges().length)
            await run2(newNode, puppeteer);
        }

        await page.waitFor(3000);

        return puppeteer.getBrowser().close();
    } catch (e) {
        console.log("CLICK ERRO")
    }

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