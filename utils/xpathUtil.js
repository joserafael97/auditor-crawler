'use strict';
import CriterionKeyWord from '../models/criterionKeyWord.model'
import connectToDb from '../db/connect'
import mongoose from 'mongoose';

const EQUALTYPESEARCH = 'tagSearch = "{}"';
const CONTAINSTYPESEARCH = 'contains(tagSearch, "{}")';


export {EQUALTYPESEARCH};
export {CONTAINSTYPESEARCH};


export default class XpathUtil {

    static async createIdentificationKeyWordXpath(criterionKeyWordName, tipo = CONTAINSTYPESEARCH, tagSearch = 'text()') {
        tipo = tipo.replace('tagSearch', tagSearch);
        let xpaths = []

        await CriterionKeyWord.findByName(criterionKeyWordName).then(function (criterionKeyWords) {
            for (let index = 0; index < criterionKeyWords.itens.length; index++) {
                let condicao = '';
                for (let i = 0; i < criterionKeyWords.itens[index].identificationKeyWord.length; i++) {
                    let valor = criterionKeyWords.itens[index].identificationKeyWord[i]
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


    // static createkeywordSearchXpath(lista_termos_chaves) {
    //     lista_xpath = [];
    //     prioridade = 1;
    //     while prioridade < 11:
    //         for valor in lista_termos_chaves:
    //         palavra_chave = ValidacaoUtil.normalize_texto(str(valor['palavra_chave'])
    //             .lower()).replace(':-_', '');
    //     if valor['prioridade'] == prioridade:
    //         lista_xpath.append('//*[contains(%s,"%s")]/@href ' %
    //             (XpathUtil.__normalize_xpath('text()'), palavra_chave));
    //     lista_xpath.append('//*[contains(%s,"%s")]/@href' %
    //         (XpathUtil.__normalize_xpath('@href'), palavra_chave));
    //     lista_xpath.append('//*[%s  = "%s"]/@href' %
    //         (XpathUtil.__normalize_xpath('text()'), palavra_chave));
    //     lista_xpath.append('//*[%s = "%s"]/@href' %
    //         (XpathUtil.__normalize_xpath('@href'), palavra_chave));
    //     lista_xpath.append('//*[contains(%s,"%s")]/@href' %
    //         (XpathUtil.__normalize_xpath('@href'), palavra_chave));
    //     lista_xpath.append('//a[contains(%s, "%s")]/@href' %
    //         (XpathUtil.__normalize_xpath('@title'), palavra_chave));
    //     lista_xpath.append('//*[contains(%s, "%s")]/parent::a/@href' %
    //         (XpathUtil.__normalize_xpath('text()'), palavra_chave));
    //     lista_xpath.append('// *[%s = "%s"]/following::td[1]//@href' %
    //         (XpathUtil.__normalize_xpath('text()'), palavra_chave));
    //     lista_xpath.append('//*[contains(%s, "%s")]/@href' %
    //         (XpathUtil.__normalize_xpath('@title'), palavra_chave));

    //     prioridade += 1;
    //     return lista_xpath;
    // }

}