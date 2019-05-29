'use strict';
import connectToDb from './db/connect'
import XpathUtil from './utils/xpathUtil'
import {
    CONTAINSTYPESEARCH
} from './utils/xpathUtil'
import CrawlerUtil from './utils/crawlerUtil';
import Criterion from './models/criterion.model'
import Evaluation from './models/evaluation.model'
import Bfs from './bfs'
import Element from './models/element.class'
import Node from './bfs/node';


connectToDb(); // let root = new Node('http://www.transparenciaativa.com.br/Principal.aspx?Entidade=175',
//     [], null, false);

const element = new Element('http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=O5w=&uf=PB',
    null, null, null, null)

let root = new Node(element, [], [], false);

//checar se o node URL encontrado tem como pai um xpath e não mudou a página (mesma URL). Caso isso seja verificado, a URL pode ser duplicada.
//adicionar lista de termos não úteis
//alimentar palavras não úteis para despesas Extra. 
//Posso afirmar se a partir de clicar num xpath não pode existir uma URL nova caso após clicar a URL atual não mude? 

connectToDb();

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

let initDate = new Date();

let criterionDespesaOrc = CrawlerUtil.createCriterion('Despesa Orçamentária');
let criterionDespesaExtra = CrawlerUtil.createCriterion('Despesa Extra Orçamentária');
let criterionReceitaOrc = CrawlerUtil.createCriterion('Receita Orçamentária');
let criterionReceitaExtra = CrawlerUtil.createCriterion('Receita Extra Orçamentária');
let criterionLicit = CrawlerUtil.createCriterion('Licitação');
let criterionPessoal = CrawlerUtil.createCriterion('Quadro Pessoal');

const run = async (criterion) => {
    criterion = await Criterion.addCriterion(criterion, await Bfs.bfsInit(root, null, [], criterion, evaluation, []).catch(logErrorAndExit));
    await Evaluation.addEvaluationWithOneCriterion(evaluation, criterion)
    const hours = Math.abs(new Date() - initDate) / 36e5
    console.log(criterion);
    console.log("============================================================================");
    let delta = Math.abs(new Date() - initDate) / 1000;
    var minutes = Math.floor(delta / 60) % 60;
    console.log("Duration: ", minutes, ' min')

};

// run(criterionDespesaOrc);
// run(criterionDespesaExtra);
// run(criterionReceitaExtra);
// run(criterionReceitaOrc);
run(criterionLicit);
// run(criterionPessoal);
