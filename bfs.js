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

// let root = new Node(new Element('http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=O5w=&uf=PB',
//         null, null, null, null),
//     [], [], false);

let root = new Node(new Element('https://transparencia.joaopessoa.pb.gov.br',
    null, null, null, null),
    [], [], false);

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
                    text = HtmlUtil.isUrl(text) ? text : TextUtil.normalizeText(TextUtil.removeWhiteSpace(text));
                    if (!TextUtil.checkTextContainsArray(validation(criterionKeyWordName), text)) {
                        if ((edgesList.filter((n) => n.getSource().getValue() === text)[0]) === undefined &&
                            ((node.getSourcesParents().filter((n) => n.getValue() === text)[0]) === undefined)) {

                            edgesList.push(new Node(new Element(text, element, queryElement.getXpath(), queryElement.getTypeQuery(), puppeteer), node));
                        }
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

        const value = node.getSource().getValue();
        const numPages = (await puppeteer.getBrowser().pages()).length;

        console.log("VALUE: ", value)

        if (HtmlUtil.isUrl(value)) {
            console.log("is URL");
            await Promise.all([page.goto(value), page.waitForNavigation()]);
        } else {
            console.log("is element HTML");
            const element = node.getSource().getElement();
            const xpath = node.getSource().getXpath();
            await element.click();
            try {
                page = await PuppeterUtil.detectContext(page, xpath);
            } catch (e) {
                console.log("deu erro na mudança,,,", e);
            }
            //extract new components
            //TODO
        }


        console.log("********************************************************************")
        console.log("numPagesOpened: ", numPages);
        console.log("value clicked: ", value);
        console.log("level: ", node.getLevel());
        // console.log("parents: ", node.getSourcesParents());

        await page.waitFor(5000);

        node = await extractEdges(node, page, puppeteer, 'Despesa Extra Orçamentária');


        node.setResearched(true);
        

        //reset page state
        // page = await PuppeterUtil.resetPage(page, node);
        //level 01 e 02 use url and max single xpath.
        if (node.getLevel() > 0) {
            try {
                await page.evaluate(() => window.stop());
                await Promise.all([page.reload(), page.waitForNavigation()]);
            } catch (e) {
                console.log("error no reloading")
            }

            const parents = node.getSourcesParents()
            if (parents.length > 1) {
                for (let element of parents) {
                    console.log("parent: ****:", element.value);
                    await element.click();

                }
            }

        }


        //detect itens of criterion
        while (node.getEdges().length > 0) {
            const newNode = node.shiftEdge();
            await run2(newNode, puppeteer);
        }

        await page.waitFor(3000);

        console.log("*********************close browser***********************************************")
        return await puppeteer.getBrowser().close();
    } catch (e) {
        console.log("************click error*****************")
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