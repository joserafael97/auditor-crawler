'use strict';
import CriterionKeyWord from '../models/criterionKeyWord.model'
import TextUtil from './texUtil';
import QueryElement from '../models/queryElement.class'
import { QUERYTODYNAMICELEMENT } from '../models/queryElement.class'

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
                for (let i = 0; i < criterionKeyWords.itens[index].identificationKeyWord.length; i++) {
                    let valor = TextUtil.normalizeText(criterionKeyWords.itens[index].identificationKeyWord[i]);
                    if (i == 0) {
                        condicao += tipo.replace('{}', valor);
                    } else {
                        condicao += ' or ' + tipo.replace('{}', valor);
                    }
                }
                xpaths.push('//*[{}]'.replace('{}', condicao))
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
                xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord));
                xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord), keyWord));
                xpaths.push(new QueryElement('//*[{tagSearch}  = "{}"]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord));
                xpaths.push(new QueryElement('//*[{tagSearch} = "{}"]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord), keyWord));
                xpaths.push(new QueryElement('//*[contains({tagSearch},"{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@href')).replace('{}', keyWord), keyWord));
                xpaths.push(new QueryElement('//a[contains({tagSearch}, "{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@title')).replace('{}', keyWord), keyWord));
                xpaths.push(new QueryElement('//*[contains({tagSearch}, "{}")]/parent::a/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord));
                xpaths.push(new QueryElement('// *[{tagSearch} = "{}"]/following::td[1]//@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord));
                xpaths.push(new QueryElement('//*[contains({tagSearch}, "{}")]/@href'.replace('{tagSearch}', XpathUtil.normalizeXpath('@title')).replace('{}', keyWord), keyWord));
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
                        '//span[contains({tagSearch},"{}")]/parent::*'.replace('{tagSearch}', XpathUtil.normalizeXpath('text()')).replace('{}', keyWord), keyWord, QUERYTODYNAMICELEMENT)
                );
            }
        });
        return xpaths;
    }


}