'use strict';

import connectToDb from './db/connect'
import {
    CONTAINSTYPESEARCH
} from './utils/xpathUtil'
import CrawlerUtil from './utils/crawlerUtil';
import Criterion from './models/criterion.model'
import Evaluation from './models/evaluation.model'
import Bfs from './bfs'
import Element from './models/element.class'
import Node from './models/bfs/node';
import CriterionKeyWord from './models/criterionKeyWord.model'
import CreateKeyWord from './db/createKeyWord'

//checar se o node URL encontrado tem como pai um xpath e não mudou a página (mesma URL). Caso isso seja verificado, a URL pode ser duplicada.
//adicionar lista de termos não úteis
//alimentar palavras não úteis para despesas Extra. 
//Posso afirmar se a partir de clicar num xpath não pode existir uma URL nova caso após clicar a URL atual não mude? 

connectToDb();

const element = new Element('http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=O5w=&uf=PB',
    null, null, null, null)

let root = new Node(element, [], [], false);


const logErrorAndExit = err => {
    console.log(err);
    process.exit();
};

let evaluation = Evaluation({
    date: new Date(),
    county: 'Ouro Velho',
    cityHallUrl: 'http://ourovelho.pb.gov.br',
    transparencyPortalUrl: element.getValue(),
});

let criterionDespesaOrc = CrawlerUtil.createCriterion('Despesa Orçamentária');
let criterionDespesaExtra = CrawlerUtil.createCriterion('Despesa Extra Orçamentária');
let criterionReceitaOrc = CrawlerUtil.createCriterion('Receita Orçamentária');
let criterionReceitaExtra = CrawlerUtil.createCriterion('Receita Extra Orçamentária');
let criterionLicit = CrawlerUtil.createCriterion('Licitação');
let criterionPessoal = CrawlerUtil.createCriterion('Quadro Pessoal');

const run = async (criterion) => {
    criterion = await Criterion.addCriterion(criterion, await Bfs.bfsInit(root, null, [], criterion, evaluation, []).catch(logErrorAndExit));
    evaluation.dateEnd = new Date();
    evaluation.duration = evaluation.dateEnd.getTime() - evaluation.date.getTime()
    const delta = Math.abs(new Date() - evaluation.date) / 1000;
    const minutes = Math.floor(delta / 60) % 60;
    evaluation.durationMin = minutes;
    await Evaluation.addEvaluationWithOneCriterion(evaluation, criterion)

    console.log(criterion);
    console.log("============================================================================");
    console.log("Duration: ", minutes, ' min')

};


const init = async () => {
    await CriterionKeyWord.getAllWithOutItens().then(async (criterionsKeyWords) => {
        if (criterionsKeyWords.length == 0) {
            await CreateKeyWord.createColletionsKeyWordsDefault();

        }
    });
    run(criterionDespesaOrc);
    run(criterionDespesaExtra);
    run(criterionReceitaExtra);
    run(criterionReceitaOrc);
    run(criterionLicit);
    run(criterionPessoal);

}

init();