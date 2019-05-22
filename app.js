'use strict';
import connectToDb from './db/connect'
import XpathUtil from './utils/xpathUtil'
import { CONTAINSTYPESEARCH } from './utils/xpathUtil'
import CrawlerUtil from './utils/crawlerUtil';
import Criterion from './models/criterion.model'
import Evaluation from './models/evaluation.model'

connectToDb();

let criterionDespExtra = Criterion({
    name: 'Despesa Extra Orçamentária',
});


let evaluation = Evaluation({
    date: new Date(),
    county: 'Monteiro',
    cityHallUrl: 'https://www.monteiro.pb.gov.br',
    transparencyPortalUrl: 'https://www.monteiro.pb.gov.br',
});



const run2 = async () => {
    console.log(await CrawlerUtil.initializeItens('Despesa Extra Orçamentária'))
    console.log(await CrawlerUtil.initializeItens('Despesa Extra Orçamentária'))

    // const list = await XpathUtil.createXpathsToIdentificationKeyWord('Despesa Extra Orçamentária')
    // let itens = [];
    // for (let ob of list) {
    //     itens.push(CrawlerUtil.createItem(ob.getKeyWord(), ob.getXpath()));
    // }
    // criterionDespExtra = await Criterion.addCriterion(criterionDespExtra, itens);
    // let criterion = [];
    // criterion.push(criterionDespExtra);
    // evaluation = await Evaluation.addEvaluation(evaluation, criterion);

}

run2()




// CriterionKeyWord.addCriterionKeyWordModel(criterionKeyWordDespExtra, identificationKeyWordDespExtraOrcamentaria);

