'use strict';

import connectToDb from '../db/connect'

import { keywordSearchDespOrcamentaria, identificationKeyWordDespOrcamentaria } from '../data/keyWordDespesaOrcamentaria'
import { keywordSearchDespExtraOrcamentaria, identificationKeyWordDespExtraOrcamentaria } from '../data/keyWordDespesaExtraOrcamentaria'
import { keywordSearchRecOrcamentaria, identificationKeyWordRecOrcamentaria } from '../data/keyWordReceitaOrcamentaria'
import { keywordSearchRecExtraOrcamentaria, identificationKeyWordRecExtraOrcamentaria } from '../data/keyWordReceitaExtraOrcamentaria'
import { keywordSearchLicitacao, identificationKeyLicitacao } from '../data/keyWordLicitacao'
import { keywordSearchPessoal, identificationKeyWordPessoal } from '../data/keyWordQuadroPessoal'

import CriterionKeyWord from '../models/criterionKeyWord.model'
import ItemKeyWord from '../models/itemKeyWord.model'

connectToDb();

function saveCriterion(criterionKeyWord, identificationKeyWord) {
    criterionKeyWord.save(function(err, criterionKeyWord) {
        if (err) {
            return 'deu errado';
        }else {
            for (var key in identificationKeyWord){
                let itemKeyWord = ItemKeyWord({
                    name: key,
                    identificationKeyWord: identificationKeyWord[key]
                });
                itemKeyWord.save(function(err, itemKeyWord){
                    if (err) {
                        return 'deu errado';
                    }else {
                        criterionKeyWord.itens.push(itemKeyWord);
                        criterionKeyWord.save(function(err, criterionKeyWord) {
                            if (err) {
                                return 'deu errado';
                            }else {
                                console.log("DEU CERTO")
                            }
                        });
                    }
                });
        }
    }});
};

let criterionKeyWordDespOrc = CriterionKeyWord({
    name: 'Despesa Orçamentária',
    keywordSearch: keywordSearchDespOrcamentaria
});

saveCriterion(criterionKeyWordDespOrc, identificationKeyWordDespOrcamentaria)

let criterionKeyWordDespExtra = CriterionKeyWord({
    name: 'Despesa Extra Orçamentária',
    keywordSearch: keywordSearchDespExtraOrcamentaria
});

// saveCriterion(criterionKeyWordDespExtra, identificationKeyWordDespExtraOrcamentaria)


let criterionKeyWordRecOrc = CriterionKeyWord({
    name: 'Receita Orçamentária',
    keywordSearch: keywordSearchRecOrcamentaria
});

let criterionKeyWordRecExtraOrc = CriterionKeyWord({
    name: 'Receita Extra Orçamentária',
    keywordSearch: keywordSearchRecExtraOrcamentaria
});

let criterionKeyWordLicitacao  = CriterionKeyWord({
    name: 'Licitação',
    keywordSearch: keywordSearchLicitacao
});

let criterionKeyWordRecPessoal = CriterionKeyWord({
    name: 'Quadro Pessoal',
    keywordSearch: keywordSearchPessoal
});


