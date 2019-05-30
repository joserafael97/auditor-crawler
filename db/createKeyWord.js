'use strict';

import connectToDb from './connect'

import {
    keywordSearchDespOrcamentaria,
    identificationKeyWordDespOrcamentaria
} from '../data/keyWordDespesaOrcamentaria'
import {
    keywordSearchDespExtraOrcamentaria,
    identificationKeyWordDespExtraOrcamentaria
} from '../data/keyWordDespesaExtraOrcamentaria'
import {
    keywordSearchRecOrcamentaria,
    identificationKeyWordRecOrcamentaria
} from '../data/keyWordReceitaOrcamentaria'
import {
    keywordSearchRecExtraOrcamentaria,
    identificationKeyWordRecExtraOrcamentaria
} from '../data/keyWordReceitaExtraOrcamentaria'
import {
    keywordSearchLicitacao,
    identificationKeyLicitacao
} from '../data/keyWordLicitacao'
import {
    keywordSearchPessoal,
    identificationKeyWordPessoal
} from '../data/keyWordQuadroPessoal'

import CriterionKeyWord from '../models/criterionKeyWord.model'

export default class CreateKeyWord {
    
    static async createColletionsKeyWordsDefault() {
        let criterionKeyWordDespOrc = CriterionKeyWord({
            name: 'Despesa Orçamentária',
            keywordSearch: keywordSearchDespOrcamentaria
        });

        CriterionKeyWord.addCriterionKeyWordModel(criterionKeyWordDespOrc, identificationKeyWordDespOrcamentaria);

        let criterionKeyWordDespExtra = CriterionKeyWord({
            name: 'Despesa Extra Orçamentária',
            keywordSearch: keywordSearchDespExtraOrcamentaria
        });

        CriterionKeyWord.addCriterionKeyWordModel(criterionKeyWordDespExtra, identificationKeyWordDespExtraOrcamentaria);


        let criterionKeyWordRecOrc = CriterionKeyWord({
            name: 'Receita Orçamentária',
            keywordSearch: keywordSearchRecOrcamentaria
        });

        CriterionKeyWord.addCriterionKeyWordModel(criterionKeyWordRecOrc, identificationKeyWordRecOrcamentaria);

        let criterionKeyWordRecExtraOrc = CriterionKeyWord({
            name: 'Receita Extra Orçamentária',
            keywordSearch: keywordSearchRecExtraOrcamentaria
        });

        CriterionKeyWord.addCriterionKeyWordModel(criterionKeyWordRecExtraOrc, identificationKeyWordRecExtraOrcamentaria);


        let criterionKeyWordLicitacao = CriterionKeyWord({
            name: 'Licitação',
            keywordSearch: keywordSearchLicitacao
        });

        CriterionKeyWord.addCriterionKeyWordModel(criterionKeyWordLicitacao, identificationKeyLicitacao);


        let criterionKeyWordRecPessoal = CriterionKeyWord({
            name: 'Quadro Pessoal',
            keywordSearch: keywordSearchPessoal
        });


        CriterionKeyWord.addCriterionKeyWordModel(criterionKeyWordRecPessoal, identificationKeyWordPessoal);

    }
}