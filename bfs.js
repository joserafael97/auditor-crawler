'use-strict';

import Node from './bfs/node';
import PuppeteerUtil from "./utils/puppeteerUtil";
import CrawlerUtil from './utils/crawlerUtil';
import HtmlUtil from './utils/htmlUtil';
import Element from './models/element.class';
import connectToDb from './db/connect';

import {
    QUERYTODYNAMICELEMENT,
    QUERYTOSTATICCOMPONENT
} from './models/queryElement.class';

// let root = new Node('http://www.transparenciaativa.com.br/Principal.aspx?Entidade=175',
//     [], null, false);

const element = new Element('http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=O5w=&uf=PB',
    null, null, null, null)

let root = new Node(element, [], [], false);

//checar se o node URL encontrado tem como pai um xpath e não mudou a página (mesma URL). Caso isso seja verificado, a URL pode ser duplicada.
//adicionar lista de termos não úteis
//alimentar palavras não úteis para despesas Extra. 
//Posso afirmar se a partir de clicar num xpath não pode existir uma URL nova caso após clicar a URL atual não mude? 

connectToDb();

let queue = [];

const run2 = async (node, puppeteer = null, criterion, elementsAccessed = [], itens = null) => {
    if (puppeteer == null) {
        puppeteer = await PuppeteerUtil.createPuppetterInstance();
    }

    let page = puppeteer.getFirstPage();
    const value = node.getSource().getValue();
    const currentPage = page;
    const numPages = (await puppeteer.getBrowser().pages()).length;
    const isUrl = HtmlUtil.isUrl(value);
    const xpath = node.getSource().getXpath();

    console.log("********************************************************************");
    console.log("numPagesOpened: ", numPages);
    console.log("value: ", value);
    console.log("level: ", node.getLevel());
    try {

        if (node.getLevel() > 0) {
            await page.waitForNavigation().catch(e => void e);
            page = await PuppeteerUtil.detectContext(page, xpath).catch(e => void e);
        }

        if (isUrl) {
            await Promise.all([page.goto(value).catch(e => void e), page.waitForNavigation().catch(e => void e)]);
        } else {
            let element = node.getSource().getElement();
            element = await PuppeteerUtil.selectElementPage(page, xpath, value);
            await element.click();
            await page.waitForNavigation().catch(e => void e);
            page = await PuppeteerUtil.detectContext(page, xpath).catch(e => void e);
        }

        if (node.getLevel() === 0) {
            node.getSource().setUrl((await page.url()));
        }

        elementsAccessed.push(node);
        const elementsIdentify = []
        elementsIdentify.push.apply(elementsIdentify, elementsAccessed);
        elementsIdentify.push.apply(elementsIdentify, queue);
        node = await CrawlerUtil.extractEdges(node, page, puppeteer, criterion.name, elementsIdentify);
        itens = await CrawlerUtil.identificationItens(criterion.name, page, itens);
        page = currentPage;
        queue.push.apply(queue, node.getEdges());
        node.setResearched(true);
    } catch (e) {
        console.log("************click error*****************", e);
    }

    while (queue.length > 0) {
        for (let edge of queue) {
            console.log("queue nodes: ****:", edge.getSource().value, ' level: ', edge.getLevel());
        }
        const newNode = queue.shift();
        if (newNode.getLevel() > 0) {
            await page.waitForNavigation().catch(e => void e);
            await PuppeteerUtil.accessParent(page, newNode.getSourcesParents());
        }
        return run2(newNode, puppeteer, criterion, elementsAccessed, itens);
    }

    await page.waitFor(3000);
    console.log("*********************close browser***********************************************");
    console.log("*********************itens***********************************************");
    console.log(itens);
    return (await puppeteer.getBrowser().close());



};



const logErrorAndExit = err => {
    console.log(err);
    process.exit();
};

let criterion = CrawlerUtil.createCriterion('Despesa Orçamentária')
run2(root, null, criterion, []).catch(logErrorAndExit);