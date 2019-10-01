import express from 'express';
import Evaluation from '../../models/evaluation.model'

module.exports = {

    /**
     * .
     * @returns {Evaluation[]}
     */
    getAllEvaluation: async (req, res, next) => {
        Evaluation.getAll().then((evaluations) => {
            if (!evaluations) {
                res.status(404).send({
                    'message': 'evaluations not found'
                });
            }
            res.status(200).send(evaluations);
        });

    },


    /**
     * .
     * @returns {Evaluation[]}
     */
    getLastEvaluationByCounty: async (req, res, next) => {

        Evaluation.findLastByCounty(req.params.county).then((evaluations) => {
            if (!evaluations) {
                res.status(404).send({
                    'message': 'evaluations not found'
                });
            }

            res.status(200).send(evaluations);
        });

    },

    /**
     * .
     * @returns {Evaluation[]}
     */
    getEvaluationsByCounty: async (req, res, next) => {

        Evaluation.findByCounty(req.params.county).then((evaluations) => {
            if (!evaluations) {
                res.status(404).send({
                    'message': 'evaluations not found'
                });
            }
            res.status(200).send(evaluations);
        });

    },

}