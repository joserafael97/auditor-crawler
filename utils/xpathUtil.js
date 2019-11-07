'use strict';
import CriterionKeyWord from '../models/criterionKeyWord.model'
import TextUtil from './textUtil';
import QueryElement from '../models/queryElement.class'
import { QUERYTODYNAMICELEMENT, QUERYTOSTATICCOMPONENT } from '../models/queryElement.class'

const EQUALTYPESEARCH = 'tagSearch = "{}"';
const CONTAINSTYPESEARCH = 'contains(tagSearch, "{}")';
const XPATHIFRAME = '//*/iframe';
const UNUSABLEIFRAMES = ['limpo', 'youtube', 'tweet', 'blank', 'google', 'sharethis','graficos', 'Graficos', 'DXR.axd', "javascript", 
'assets','anexo', 'download', 'widget', ".zip", ".jpeg", ".rar", "noticia", "publicidade",'facebook', "email", 'whatsapp', 'print', 'png', 'dist'];
const CONSULTAR = "consultar";
const PESQUISAR = "pesquisar";
const ACESSAR = "acessar";


export {
    EQUALTYPESEARCH
};
export {
    CONTAINSTYPESEARCH
};

export {
    XPATHIFRAME
};

export {
    UNUSABLEIFRAMES
};

export {
    CONSULTAR
}

export {
    PESQUISAR
}

export {
    ACESSAR
}

export default class XpathUtil {

    static async createXpathsToIdentificationKeyWord(criterionKeyWordName, tipo = EQUALTYPESEARCH, tagSearch = 'text()') {
        tagSearch = XpathUtil.normalizeXpath(tagSearch);
        tipo = tipo.replace('tagSearch', tagSearch)
        let xpaths = []

        await CriterionKeyWord.findByName(criterionKeyWordName).then(function (criterionKeyWords) {
            for (let index = 0; index < criterionKeyWords.itens.length; index++) {
                let condicao = '';
                let item = '';
                for (let i = 0; i < criterionKeyWords.itens[index].identificationKeyWord.length; i++) {
                    item = criterionKeyWords.itens[index].name;
                    let valor = TextUtil.normalizeText(criterionKeyWords.itens[index].identificationKeyWord[i]);
                    if (i == 0) {
                        condicao += tipo.replace('{}', valor);
                    } else {
                        condicao += ' or ' + tipo.replace('{}', valor);
                    }
                }
                xpaths.push(new QueryElement('//*[{}]'.replace('{}', condicao), item, QUERYTODYNAMICELEMENT, criterionKeyWords.itens[index].identificationKeyWord));
            }
        });

        return xpaths
    }

    static normalizeXpath(tagSearch) {
        const xp = 'translate(translate(translate(normalize-space({tagSearch}),' +
            '"ABCDEFGHIJKLMNOPQRSTUVWXYZÇ", "abcdefghijklmnopqrstuvwxyzc"),' +
            '"ãáâàÃÁÀÂẽéêèẼÉÈÊõóôòÒÓÔÕĩìíîÌĨÎÍúùûũÚÙŨÛç", "aaaaaaaaeeeeeeeeooooooooiiiiiiiiuuuuuuuuc"),' +
            '":-º°", "")';
        return xp.replace('{tagSearch}', tagSearch);
    }


    static async createXpathsToExtractUrls(criterionKeyWordName) {
        let xpaths = []
        await CriterionKeyWord.findByName(criterionKeyWordName).then(function (criterionKeyWords) {
            for (let keyWord of criterionKeyWords.keywordSearch) {
                xpaths = XpathUtil.createXpathsUrls(keyWord, criterionKeyWords.keywordSearch, xpaths);
            }
        });
        return xpaths
    }

    static async createXpathsToExtractUrlsByCriterion(criterionKeyWordName) {
        let xpaths = [];
        let terms = TextUtil.extractTermsCriterionName(criterionKeyWordName)
        terms = XpathUtil.addGenericTerms(terms);

        for (let keyWord of terms) {
            xpaths = XpathUtil.createXpathsUrls(keyWord, terms, xpaths);
        }

        return xpaths
    }


    static createXpathsUrls(keyWord, terms, xpaths) {

        keyWord = TextUtil.normalizeText(keyWord);
        xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//*[{tagSearch}  = "{}"]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//*[{tagSearch} = "{}"]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//a[contains({tagSearch}, "{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@title')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//*[contains({tagSearch}, "{}")]/parent::a/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('// *[{tagSearch} = "{}"]/following::td[1]//@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//*[contains({tagSearch}, "{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@title')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//div[contains({tagSearch},"{}")]/following::a[1]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//span[contains({tagSearch},"{}")]/parent::*/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/parent::a/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms));
        xpaths.push(new QueryElement('//*[contains(@src, {tagSearch})]/@src'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, terms, true));

        return xpaths;
    }


    static createXpathToExtractIframe() {
        return new QueryElement('//iframe/@src', '', QUERYTOSTATICCOMPONENT, [], true);
    }


    static async createXpathsToExtractDynamicComponents(criterionKeyWordName) {
        let xpaths = [];
        await CriterionKeyWord.findByName(criterionKeyWordName).then(function (criterionKeyWords) {
            for (let keyWord of criterionKeyWords.keywordSearch) {
                const queryElement = XpathUtil.createXpathQuery(keyWord, criterionKeyWords.keywordSearch)
                xpaths.push(queryElement);
            }
        });
        return xpaths;
    }

    static addGenericTerms(terms) {
        terms.push(CONSULTAR);
        terms.push(PESQUISAR);
        terms.push(ACESSAR);

        return terms;
    }

    static async createXpathsToExtractDynamicComponentsByCriterion(criterionKeyWordName) {
        let xpaths = [];
        let terms = TextUtil.extractTermsCriterionName(criterionKeyWordName)
        terms = XpathUtil.addGenericTerms(terms);

        for (let keyWord of terms) {
            keyWord = TextUtil.normalizeText(keyWord);
            const queryElement = XpathUtil.createXpathQuery(keyWord, terms)
            xpaths.push(queryElement);
        }
        return xpaths;
    }

    static createXpathQuery(keyWord, terms) {
        keyWord = TextUtil.normalizeText(keyWord);
        return new QueryElement('//div[contains({tagSearch},"{}")]/following::a[1]'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord) + ' | ' +
            '//button[contains({tagSearch},"{}")]'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord) + ' | ' +
            '//input[contains({tagSearch},"{}")]'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord) + ' | ' +
            '//input[contains({tagSearch},"{}")]'.replace('{tagSearch}', XpathUtil.normalizeXpath('@value')).replace('{}', keyWord) + ' | ' +
            '//a[contains({tagSearch},"{}")]'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord) + ' | ' +
            '//input[contains({tagSearch},"{}")]'.replace('{tagSearch}', XpathUtil.normalizeXpath('@onclick')).replace('{}', keyWord) + ' | ' +
            '//input[contains({tagSearch},"{}")]'.replace('{tagSearch}', XpathUtil.normalizeXpath('@id')).replace('{}', keyWord) + ' | ' +
            '//a[contains({tagSearch},"{}")]'.replace('{tagSearch}', XpathUtil.normalizeXpath('@title')).replace('{}', keyWord) + ' | ' +
            '//a[contains({tagSearch},"{}")]'.replace('{tagSearch}', XpathUtil.normalizeXpath('@onclick')).replace('{}', keyWord) + ' | ' +
            '//a[contains({tagSearch},"{}")]'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord) + ' | ' +
            '//*[contains({tagSearch},"{}")]/parent::a'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord) + ' | ' +
            '//a[contains({tagSearch},"{}")]/following::span'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord) + ' | ' +
            '//span[contains({tagSearch},"{}")]/parent::*'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTODYNAMICELEMENT, terms);

    }

    static createXpathsToIdentifyPage(criterionKeyWordName) {
        criterionKeyWordName = criterionKeyWordName === "Licitação" ? "licitac" : criterionKeyWordName;
        let xpaths = [];
        let terms = [];
        if (criterionKeyWordName.indexOf(' ') >= 0) {
            terms = criterionKeyWordName.split(" ");

            terms.push(criterionKeyWordName)
            if (terms.length < 3) {
                return new QueryElement('//*[contains({tagSearch},"{}")]/text()'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', TextUtil.normalizeText(criterionKeyWordName)) + ' | ' +
                    '//*[contains({tagSearch},"{}")]/text()'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', TextUtil.normalizeText(terms[0])) + ' | ' +
                    '//*[contains({tagSearch},"{}")]/text()'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', TextUtil.normalizeText(terms[1])), criterionKeyWordName, QUERYTODYNAMICELEMENT, terms)


            } else {
                return new QueryElement('//*[contains({tagSearch},"{}")]/text()'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', TextUtil.normalizeText(criterionKeyWordName)) + ' | ' +
                    '//*[contains({tagSearch},"{}")]/text()'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', TextUtil.normalizeText(terms[0])) + ' | ' +
                    '//*[contains({tagSearch},"{}")]/text()'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', TextUtil.normalizeText(terms[1] + " " + terms[2])) + ' | ' +
                    '//*[contains({tagSearch},"{}")]/text()'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', TextUtil.normalizeText(terms[1])), criterionKeyWordName, QUERYTODYNAMICELEMENT, terms)

            }
        } else {
            return new QueryElement('//*[contains({tagSearch},"{}")]/text()'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', TextUtil.normalizeText(criterionKeyWordName)), criterionKeyWordName, QUERYTODYNAMICELEMENT, [criterionKeyWordName])
        }

        return xpaths;
    }


}