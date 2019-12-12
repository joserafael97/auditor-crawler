export default class CliParamUtil {

    static countyParamExtract(param) {
        return param.replace('county=', '').trim()
    }

    static aproachParamExtract(param) {
        return param.replace('aproach=', '').trim()
    }

    static classifierParamExtract(param) {
        return param.replace('classifier=', '').trim()
    }

    static sequentialParamExtract(param) {
        return param.replace('sequential=', '').trim()
    }


    static allItensParamExtract(param) {
        return param.replace('allitens=', '').trim()
    }

    static allKeyWordsParamExtract(param) {
        return param.replace('allkeywords=', '').trim()
    }
}