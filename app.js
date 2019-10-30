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
import ObjectsToCsv from 'objects-to-csv';
import moment from 'moment';


const logErrorAndExit = err => {
    console.log(err)
    logger.error(err);
    process.exit();

};

let trainModel = [];
connectToDb();
const dateStart = new Date();

let run = async (criterion, evaluation, root) => {

    const aproachSelected = CliParamUtil.aproachParamExtract(process.argv.slice(3)[0])
    let itens = [];
    let resultEvaluation = await selectAproachToRun(aproachSelected, root, criterion, evaluation, itens);

    itens = resultEvaluation.itens;
    criterion = resultEvaluation.criterion;
    evaluation = resultEvaluation.evaluation;

    evaluation.dateEnd = new Date();
    const duration = (evaluation.dateEnd - evaluation.date);
    const minutes = Math.round(((duration % 86400000) % 3600000) / 60000); 
    evaluation.dateEnd = evaluation.dateEnd.getTime();

    evaluation.duration = duration;
    evaluation.durationMin = minutes;
    criterion.duration = duration;
    criterion.durationMin = minutes;

    criterion = await Criterion.addCriterion(criterion, itens);
    await Evaluation.addEvaluationWithOneCriterion(evaluation, criterion)

    logger.info("Duration in crawling proccess for the criterion " + criterion.name + " was: " + minutes + ' min')

};


let selectAproachToRun = async (aproachSelected, root, criterion, evaluation, itens) => {

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
            resultCrawlingCriterion = await BanditProcess.initilize(root, null, [], criterion, evaluation, [], null, new EpsilonGreedy(100, 0.1)).catch(logErrorAndExit)
        }


    } else if (aproachSelected == AproachType.DFS) {
        evaluation.aproach = AproachType.DFS
        resultCrawlingCriterion = await Dfs.initilize(root, null, [], criterion, evaluation, [], null).catch(logErrorAndExit)
    }

    itens = resultCrawlingCriterion.itens;
    criterion.contNodeNumberAccess = resultCrawlingCriterion.contNodeNumber;
    trainModel = resultCrawlingCriterion.trainModel !== undefined ? trainModel.concat(resultCrawlingCriterion.trainModel) : trainModel;

    await (new ObjectsToCsv(trainModel).toDisk('./test.csv', { append: true }));

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



let startCrawler = async (evaluation, criterion) => {

    await initColletions();
    const county = await County.findByName(CliParamUtil.countyParamExtract(process.argv.slice(2)[0]));
    
    evaluation.county = county.name;
    evaluation.cityHallUrl = county.cityHallUrl;
    evaluation.transparencyPortalUrl = county.transparencyPortalUrl;
    evaluation.transparencyPortalUrl = county.transparencyPortalUrl;

    const element = new Element(evaluation.transparencyPortalUrl, null, null, null, null);

    let root = new Node(element, null, [], false);

    run(criterion, evaluation, root)
}

process.setMaxListeners(0);

let evaluation = Evaluation({
    date: dateStart,
    county: '',
    cityHallUrl: '',
    transparencyPortalUrl: '',
});


let criterionDespesaOrc = CrawlerUtil.createCriterion('Despesa Orçamentária');
let criterionDespesaExtra = CrawlerUtil.createCriterion('Despesa Extra Orçamentária');
let criterionReceitaOrc = CrawlerUtil.createCriterion('Receita Orçamentária');
let criterionReceitaExtra = CrawlerUtil.createCriterion('Receita Extra Orçamentária');
let criterionLicit = CrawlerUtil.createCriterion('Licitação');
let criterionPessoal = CrawlerUtil.createCriterion('Quadro Pessoal');


startCrawler(evaluation, criterionDespesaOrc);
// startCrawler(evaluation, criterionDespesaExtra);
// startCrawler(evaluation, criterionReceitaOrc);
// startCrawler(evaluation, criterionReceitaExtra);
// startCrawler(evaluation, criterionLicit);
// startCrawler(evaluation, criterionPessoal);

