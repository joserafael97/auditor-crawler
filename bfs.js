'use-strict';

import Node from './bfs/node'
import PuppeteerUltil from './utils/puppeteerUtil';
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

let root = new Node(new Element('http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=O5w=&uf=PB',
        null, null, null, null),
    [], [], false);

// let root = new Node(new Element('https://transparencia.joaopessoa.pb.gov.br',
//     null, null, null, null),
//     [], [], false);

//checar se o node URL encontrado tem como pai um xpath e não mudou a página (mesma URL). Caso isso seja verificado, a URL pode ser duplicada.
//adicionar lista de termos não úteis
//alimentar palavras não úteis para despesas Extra. 
//Posso afirmar se a partir de clicar num xpath não pode existir uma URL nova caso após clicar a URL atual não mude? 

connectToDb();

let queue = [];

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
                let currentUrl = await page.url();

                if (queryElement.getTypeQuery() === QUERYTOSTATICCOMPONENT) {
                    text = HtmlUtil.isUrl(text) ? text :
                        HtmlUtil.isUrl(urljoin(HtmlUtil.extractHostname(currentUrl), text)) ?
                        urljoin(HtmlUtil.extractHostname(page.url()), text) : undefined;
                }
                if (text !== undefined) {
                    text = HtmlUtil.isUrl(text) ? text : TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));

                    if (!TextUtil.checkTextContainsArray(validation(criterionKeyWordName), text)) {

                        if ((edgesList.filter((n) => n.getSource().getValue() === text)[0]) === undefined &&
                            ((node.getSourcesParents().filter((n) => n.getSource().getValue() === text)[0]) === undefined)) {
                            let source = new Element(text, element, queryElement.getXpath(), queryElement.getTypeQuery(), puppeteer, currentUrl);
                            edgesList.push(new Node(source, node));
                        }
                    }
                }
            }

        }
    }
    node.setEdgesList(edgesList);
    return node;
}

const run2 = async (node, puppeteer = null) => {

    if (puppeteer == null) {
        puppeteer = await PuppeteerUltil.createPuppetterInstance();
    }

    let page = puppeteer.getFirstPage();
    const value = node.getSource().getValue();

    //save page instance if change to iframe;
    const currentPage = page;

    const numPages = (await puppeteer.getBrowser().pages()).length;
    const isUrl = HtmlUtil.isUrl(value);
    const xpath = node.getSource().getXpath();

    console.log("********************************************************************")
    console.log("numPagesOpened: ", numPages);
    console.log("value: ", value);
    console.log("level: ", node.getLevel());

    try {

        if (node.getLevel() > 0) {
            await page.waitForNavigation().catch(e => void e);
        }

        if (isUrl) {
            await Promise.all([page.goto(value).catch(e => void e), page.waitForNavigation().catch(e => void e)]);
        } else {
            let element = node.getSource().getElement();
            element = await PuppeteerUltil.selectElementPage(page, xpath, value);
            await element.click();
            await page.waitForNavigation().catch(e => void e);
            page = await PuppeteerUltil.detectContext(page, xpath).catch(e => void e);
        }

        if (node.getLevel() === 0) {
            node.getSource().setUrl((await page.url()));
        }

        node = await extractEdges(node, page, puppeteer, 'Despesa Extra Orçamentária');
        node.setResearched(true);

        //change to page if iframe in use;
        page = currentPage
        queue.push.apply(queue, node.getEdges());
    } catch (e) {
        console.log("************click error*****************", e)
    }



    while (queue.length > 0) {
        for (let edge of queue) {
            console.log("queue nodes: ****:", edge.getSource().value, ' level: ', edge.getLevel());
        }

        const newNode = queue.shift();

        if (newNode.getLevel() > 0) {
            await page.waitForNavigation().catch(e => void e)
            PuppeteerUltil.accessParent(page, newNode.getSourcesParents())
        }

        await run2(newNode, puppeteer);
    }

    await page.waitFor(3000);
    console.log("*********************close browser***********************************************")
    return await puppeteer.getBrowser().close();

}

const logErrorAndExit = err => {
    console.log(err);
    process.exit();
};

run2(root).catch(logErrorAndExit);

const validation = (criterionName) => {
    const listNotValid = [''];

    const unusableTerms = {
        'Despesa Extra Orçamentária': ['despesa orcamentaria', 'despesas orcamentarias', 'receitas', 'receita', 'licitacao', 'pessoal', 'folha de pagamento'],
        'Despesa Orçamentária': ['extra']
    }

    return unusableTerms[criterionName];
}