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
}