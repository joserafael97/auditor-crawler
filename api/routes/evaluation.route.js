import express from 'express'
import EvalutionCrl from '../controllers/evaluation.controller'

const router = express.Router();

router.get('/', EvalutionCrl.getAllEvaluation)
router.get('/last', EvalutionCrl.getAllLastEvaluation);
router.get('/:aproach/last', EvalutionCrl.getAllLastEvaluationByAproach)
router.get('/:county/all', EvalutionCrl.getEvaluationsByCounty)
router.get('/:aproach/:county/last', EvalutionCrl.getLastEvaluationByCounty)

module.exports = router;

