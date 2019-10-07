'use strict';

import connectToDb from './db/connect'
import CrawlerUtil from './utils/crawlerUtil';
import Criterion from './models/criterion.model'
import Evaluation from './models/evaluation.model'
import Bfs from './bfs'
import Element from './models/element.class'
import Node from './models/node';
import CriterionKeyWord from './models/criterionKeyWord.model'
import CreateKeyWord from './db/createKeyWord'
import County from './models/county.model'
import CreateCountyMetaData from './db/createCountyMetaData'
import CliParamUtil from './utils/cliParamUtil';
import AproachType from './consts/aproachType'
import BanditProcess from './banditProcess';
import EpsilonGreedy from './epsilonGreedy';
import { GaussianNB } from 'ml-naivebayes';
import Dfs from './dfs';


const logErrorAndExit = err => {
    console.log(err);
    process.exit();
};

let moogoseInstace = null;

const run = async (criterion, evaluation, root) => {

    const aproachSelected = CliParamUtil.aproachParamExtract(process.argv.slice(3)[0])
    let itens = [];

    if (aproachSelected == AproachType.BFS || aproachSelected == '' || aproachSelected == "default") {
        console.log("-------------------------------AproachType: ", AproachType.BFS)
        evaluation.aproach = AproachType.BFS
        itens = await Bfs.initilize(root, null, [], criterion, evaluation, [], null).catch(logErrorAndExit)
    } else if (aproachSelected == AproachType.BANDIT) {
        console.log("-------------------------------AproachType: ", AproachType.BANDIT)
        evaluation.aproach = AproachType.BANDIT
        itens = await BanditProcess.initilize(root, null, [], criterion, evaluation, [], null, new EpsilonGreedy(10000, 0.1)).catch(logErrorAndExit)
    } else if (aproachSelected == AproachType.DFS) {
        console.log("-------------------------------AproachType: ", AproachType.DFS)
        evaluation.aproach = AproachType.DFS
        itens = await Dfs.initilize(root, null, [], criterion, evaluation, [], null).catch(logErrorAndExit)
    }

    evaluation.dateEnd = new Date();
    const duration = evaluation.dateEnd.getTime() - evaluation.date.getTime();
    const delta = Math.abs(new Date() - evaluation.date) / 1000;
    const minutes = Math.floor(delta / 60) % 60;

    evaluation.duration = duration;
    evaluation.durationMin = minutes;
    criterion.duration = duration;
    criterion.durationMin = minutes;

    criterion = await Criterion.addCriterion(criterion, itens);
    await Evaluation.addEvaluationWithOneCriterion(evaluation, criterion)

    console.log("============================================================================");
    console.log("Duration: ", minutes, ' min')
};

const initColletions = async () => {
    await CriterionKeyWord.getAllWithOutItens().then(async (criterionsKeyWords) => {
        if (criterionsKeyWords.length == 0) {
            await CreateKeyWord.createColletionsKeyWordsDefault();

        }
    });

    await County.getAll().then(async (counties) => {
        if (counties.length == 0) {
            await CreateCountyMetaData.createColletionsCounty();
        }
    });
}



const startCrawler = async () => {
    moogoseInstace = await connectToDb();

    await initColletions();
    const county = await County.findByName(CliParamUtil.countyParamExtract(process.argv.slice(2)[0]));

    let evaluation = Evaluation({
        date: new Date(),
        county: county.name,
        cityHallUrl: county.cityHallUrl,
        transparencyPortalUrl: county.transparencyPortalUrl,
    });

    const element = new Element(evaluation.transparencyPortalUrl, null, null, null, null);

    let root = new Node(element, null, [], false);
    process.setMaxListeners(0);

    let criterionDespesaOrc = CrawlerUtil.createCriterion('Despesa Orçamentária');
    let criterionDespesaExtra = CrawlerUtil.createCriterion('Despesa Extra Orçamentária');
    let criterionReceitaOrc = CrawlerUtil.createCriterion('Receita Orçamentária');
    let criterionReceitaExtra = CrawlerUtil.createCriterion('Receita Extra Orçamentária');
    let criterionLicit = CrawlerUtil.createCriterion('Licitação');
    let criterionPessoal = CrawlerUtil.createCriterion('Quadro Pessoal');

    Promise.all([
        run(criterionDespesaOrc, evaluation, root),
        run(criterionDespesaExtra, evaluation, root),
        run(criterionReceitaExtra, evaluation, root),
        run(criterionReceitaOrc, evaluation, root),
        run(criterionLicit, evaluation, root),
        run(criterionPessoal, evaluation, root)
    ]
    ).then((result) => {
        console.log("testando =======================================================================================================");
        moogoseInstace.connection.close(function(){
            process.exit(0);
        })
    });

}


startCrawler();