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
import { MultinomialNB } from 'ml-naivebayes';
import Dfs from './dfs';
import BanditProcessClassifier from './banditProcessClassifier';
import logger from './core/logger/app-logger'
import ObjectsToCsv from 'objects-to-csv';
import csv from 'csvtojson';
import fs from 'fs';
import FeaturesConst from './consts/featuares';

const logErrorAndExit = err => {
    console.log(err)
    logger.error(err);
    process.exit();

};

let trainModel = [];
connectToDb();
const dateStart = new Date();
let nbModel = new MultinomialNB();
let trained = false;

let run = async (criterion, evaluation, root) => {

    const aproachSelected = CliParamUtil.aproachParamExtract(process.argv.slice(3)[0])
    let itens = [];
    let resultEvaluation = await selectAproachToRun(aproachSelected, root, criterion, evaluation, itens);

    itens = resultEvaluation.itens;
    criterion = resultEvaluation.criterion;
    evaluation = resultEvaluation.evaluation;

    evaluation.dateEnd = new Date();
    const duration = (evaluation.dateEnd.getTime() - evaluation.date.getTime());
    const minutes = Math.round(Math.abs(((duration / 1000) / 60)));
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
            let train = await readTrainData();
            if (train['x_train'].length > 0 && !trained) {
                nbModel.train(train['x_train'], train['y_train']);
                trained = true;
            }
            
            resultCrawlingCriterion = await BanditProcessClassifier.initilize(root, null, [], criterion, evaluation, [], null, nbModel, new EpsilonGreedy(10000, 0.1), [], [], 0, 1, trainModel).catch(logErrorAndExit)

        } else {
            resultCrawlingCriterion = await BanditProcess.initilize(root, null, [], criterion, evaluation, [], null, new EpsilonGreedy(1000, 0.1)).catch(logErrorAndExit)
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

const readTrainData = async () => {
    let dataTrain = [];
    let data = [];
    let labels = [];

    try {
        dataTrain = await csv().fromFile('test.csv');
    } catch (e) {
        logger.info("not found file");
    }

    for (const item of dataTrain) {
        data.push([
            item[FeaturesConst.URL_RELEVANT],
            item[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT_PARENT],
            item[FeaturesConst.URL_RELEVANT_PARENT],
            item[FeaturesConst.TERM_CRITERION_PARENT],
            item[FeaturesConst.ONE_ITEM_CRITERIO_PARENT],
            item[FeaturesConst.MORE_ITEM_CRITERIO_PARENT],
            item[FeaturesConst.URL_RELEVANT_BRORHER],
            item[FeaturesConst.MORE_THAN_ONE_NEW_COMPONENT_BRORHER],
            item[FeaturesConst.ONE_ITEM_CRITERIO_BRORHER],
            item[FeaturesConst.MORE_ITEM_CRITERIO_BRORHER],
            item[FeaturesConst.TERM_CRITERION_BRORHER],
        ]);
        item['result'] = item['result'] === 'component_relevant' ? 1 : item['result'] === 'no_relevant' ? 0 : 2;

        labels.push(item['result'])
    }

    return { 'x_train': data, 'y_train': labels };
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

let startCrawler = async (evaluation, criterion) => {

    await initColletions();
    const county = await County.findByName(CliParamUtil.countyParamExtract(process.argv.slice(2)[0]));

    evaluation.county = county.name;
    evaluation.cityHallUrl = county.cityHallUrl;
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

// startCrawler(evaluation, criterionDespesaOrc);
// startCrawler(evaluation, criterionDespesaExtra);
startCrawler(evaluation, criterionReceitaOrc);
// startCrawler(evaluation, criterionReceitaExtra);
// startCrawler(evaluation, criterionLicit);
// startCrawler(evaluation, criterionPessoal);

