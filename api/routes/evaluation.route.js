import express from 'express'
import EvalutionCrl from '../controllers/evaluation.controller'

const router = express.Router();

router.get('/', EvalutionCrl.getAllEvaluation)
router.get('/last', EvalutionCrl.getAllLastEvaluation);
router.get('/:aproach/last', EvalutionCrl.getAllLastEvaluationByAproach)
router.get('/:county/last', EvalutionCrl.getLastEvaluationByCounty)
router.get('/:county', EvalutionCrl.getEvaluationsByCounty)

module.exports = router;

