'use-strict';

import Node from './bfs/node'
import Graph from './bfs/graph'
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

                if (queryElement.getTypeQuery() === QUERYTOSTATICCOMPONENT) {
                    text = HtmlUtil.isUrl(text) ? text :
                        HtmlUtil.isUrl(urljoin(HtmlUtil.extractHostname(page.url()), text)) ?
                        urljoin(HtmlUtil.extractHostname(page.url()), text) : undefined;
                }
                if (text !== undefined) {
                    text = HtmlUtil.isUrl(text) ? text : TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));

                    if (!TextUtil.checkTextContainsArray(validation(criterionKeyWordName), text)) {

                        if ((edgesList.filter((n) => n.getSource().getValue() === text)[0]) === undefined &&
                            ((node.getSourcesParents().filter((n) => n.getSource().getValue() === text)[0]) === undefined)) {
                            edgesList.push(new Node(new Element(text, element, queryElement.getXpath(), queryElement.getTypeQuery(), puppeteer), node));
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
    try {
        if (puppeteer == null) {
            puppeteer = await PuppeterUtil.createPuppetterInstance();
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

        if (node.getLevel() > 0) {
            await page.waitForNavigation().catch(e => void e);
        }

        if (isUrl) {
            await Promise.all([page.goto(value).catch(e => void e), page.waitForNavigation().catch(e => void e)]);
        } else {
            let element = node.getSource().getElement();
            element = await PuppeterUtil.selectElementPage(page, xpath, value);
            await element.click();
            await page.waitForNavigation().catch(e => void e);


            page = await PuppeterUtil.detectContext(page, xpath).catch(e => void e);;
        }

        node = await extractEdges(node, page, puppeteer, 'Despesa Extra Orçamentária');
        node.setResearched(true);

        //change to page if iframe in use;
        page = currentPage
        queue.push.apply(queue, node.getEdges());

        if (node.getLevel() > 0) {
            try {
                await page.waitForNavigation().catch(e => void e)
                const parents = node.getSourcesParents()
                const nodeParent = parents[parents.length - 1];

                if (!HtmlUtil.isUrl(nodeParent.getSource().getValue())) {
                    console.log('URL PAI: ', nodeParent.getSource().getValue());
                    Promise.all([page.goBack(nodePar    ent.getSource().getValue()).catch(e => void e), page.waitForNavigation().catch(e => void e)])
                } else {
                    if (parents.length > 0) {
                        for (let parent of parents) {
                            const source = parent.getSource();
                            if (HtmlUtil.isUrl(source.getValue())) {
                                if (!isUrl) {
                                    Promise.all([page.reload().catch(e => void e), page.waitForNavigation().catch(e => void e)])
                                } else {
                                    Promise.all([page.goBack(source.getValue()).catch(e => void e), page.waitForNavigation().catch(e => void e)])
                                }
                            } else {
                                await (await PuppeterUtil.selectElementPage(page, xpath, source.value)).click();
                                await page.waitForNavigation().catch(e => void e);
                            }

                        }
                    }
                }
            } catch (e) {
                console.log("error no reloading", e)
            }
        }

        while (queue.length > 0) {
            for (let edge of queue) {
                console.log("queue nodes: ****:", edge.getSource().value, ' level: ', edge.getLevel());
            }
            const newNode = queue.shift();
            await run2(newNode, puppeteer);
        }

        await page.waitFor(3000);
        console.log("*********************close browser***********************************************")
        return await puppeteer.getBrowser().close();
    } catch (e) {
        console.log("************click error*****************", e)
    }

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