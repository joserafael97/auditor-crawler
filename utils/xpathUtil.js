'use strict';
import CriterionKeyWord from '../models/criterionKeyWord.model'
import TextUtil from './texUtil';
import QueryElement from '../models/queryElement.class'
import { QUERYTODYNAMICELEMENT, QUERYTOSTATICCOMPONENT } from '../models/queryElement.class'

const EQUALTYPESEARCH = 'tagSearch = "{}"';
const CONTAINSTYPESEARCH = 'contains(tagSearch, "{}")';
const XPATHIFRAME = '//*/iframe';
const UNUSABLEIFRAMES = ['limpo', 'blank'];


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
                keyWord = TextUtil.normalizeText(keyWord);
                xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//*[{tagSearch}  = "{}"]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//*[{tagSearch} = "{}"]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//a[contains({tagSearch}, "{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@title')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//*[contains({tagSearch}, "{}")]/parent::a/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('// *[{tagSearch} = "{}"]/following::td[1]//@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//*[contains({tagSearch}, "{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@title')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//div[contains({tagSearch},"{}")]/following::a[1]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch)); 
                xpaths.push(new QueryElement('//span[contains({tagSearch},"{}")]/parent::*/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/parent::a/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch));
                xpaths.push(new QueryElement('//*[contains(@src, {tagSearch})]/@src'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTOSTATICCOMPONENT, criterionKeyWords.keywordSearch, true));            
            
            
            }
        });

        return xpaths
    }

    static async createXpathsToExtractDynamicComponents(criterionKeyWordName) {
        let xpaths = [];
        await CriterionKeyWord.findByName(criterionKeyWordName).then(function (criterionKeyWords) {
            for (let keyWord of criterionKeyWords.keywordSearch) {
                keyWord = TextUtil.normalizeText(keyWord);
                xpaths.push(
                    new QueryElement('//div[contains({tagSearch},"{}")]/following::a[1]'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord) + ' | ' +
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
                        '//span[contains({tagSearch},"{}")]/parent::*'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTODYNAMICELEMENT, criterionKeyWords.keywordSearch)
                );
            }
        });
        return xpaths;
    }


}