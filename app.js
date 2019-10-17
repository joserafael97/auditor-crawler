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
import BanditProcessClassifier from './banditProcessClassifier';
import logger from './core/logger/app-logger'


const logErrorAndExit = err => {
    logger.error(err);
    process.exit();

};

let trainModel = [];
let moogoseInstace = null;

const run = async (criterion, evaluation, root) => {

    const aproachSelected = CliParamUtil.aproachParamExtract(process.argv.slice(3)[0])
    let itens = [];
    let resultEvaluation = await selectAproachToRun(aproachSelected, root, criterion, evaluation, itens);

    itens = resultEvaluation.itens;
    criterion = resultEvaluation.criterion;
    evaluation = resultEvaluation.evaluation;

    evaluation.dateEnd = new Date();
    const duration = evaluation.dateEnd.getTime() - evaluation.date.getTime();
    const delta = Math.abs(new Date() - evaluation.date) / 1000;
    const minutes = Math.floor(delta / 60) % 60;
    evaluation.dateEnd = evaluation.dateEnd.getTime();

    evaluation.duration = duration;
    evaluation.durationMin = minutes;
    criterion.duration = duration;
    criterion.durationMin = minutes;

    criterion = await Criterion.addCriterion(criterion, itens);
    await Evaluation.addEvaluationWithOneCriterion(evaluation, criterion)

    logger.info("Duration in crawling proccess for the criterion " + criterion.name + " was: " + minutes + ' min')

};


const selectAproachToRun = async (aproachSelected, root, criterion, evaluation, itens) => {

    let classifierCli = '';
    let resultCrawlingCriterion = null;

    logger.info("AproachType: " + aproachSelected);


    if (aproachSelected == AproachType.BFS || aproachSelected == '' || aproachSelected == "default") {
        evaluation.aproach = AproachType.BFS
        resultCrawlingCriterion = await Bfs.initilize(root, null, [], criterion, evaluation, [], null).catch(logErrorAndExit)

    } else if (aproachSelected == AproachType.BANDIT) {
        evaluation.aproach = AproachType.BANDIT

        if (process.argv.slice(4)[0] !== undefined) {
            classifierCli = CliParamUtil.classifierParamExtract(process.argv.slice(4)[0])
        }

        logger.info("Classier: " + classifierCli);

        if (classifierCli === 'naivebayes') {
            resultCrawlingCriterion = await BanditProcessClassifier.initilize(root, null, [], criterion, evaluation, [], null, new GaussianNB(), new EpsilonGreedy(10000, 0.1), [], [], 0, 1, trainModel).catch(logErrorAndExit)

        } else {
            resultCrawlingCriterion = await BanditProcess.initilize(root, null, [], criterion, evaluation, [], null, new EpsilonGreedy(10000, 0.1)).catch(logErrorAndExit)
        }


    } else if (aproachSelected == AproachType.DFS) {
        evaluation.aproach = AproachType.DFS
        resultCrawlingCriterion = await Dfs.initilize(root, null, [], criterion, evaluation, [], null).catch(logErrorAndExit)
    }

    itens = resultCrawlingCriterion.itens;
    criterion.contNodeNumberAccess = resultCrawlingCriterion.contNodeNumber

    return { 'itens': itens, 'criterion': criterion, 'evaluation': evaluation };
}

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

    ]).then((result) => {
        moogoseInstace.connection.close(function () {
            console.log("Finished process, crawling finalized");
            process.exit(0);
        })
    });

}


startCrawler();