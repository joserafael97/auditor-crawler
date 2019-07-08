import HtmlUtil from "../utils/htmlUtil";
import StringSimilarity from 'string-similarity'

export default class TextUtil {

    static normalizeText(text) {
        text = text.replace('-', '').replace(':', '').replace('º', '').replace('°', '')
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        return text.toLowerCase();
    }

    static removeWhiteSpace(text) {
        return text.replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g, '').trim();
    }

    static countyParamExtract(param) {
        return param.replace('county=', '').trim()
    }

    static checkTextContainsArray(array, text) {
        for (let index = 0; index < array.length; index++) {
            const value = TextUtil.normalizeText(TextUtil.removeWhiteSpace(array[index]));
            if (text === value || text.includes(value)) {
                return true;
            }

        }
        return false;
    }

    static similarityUrls(url1, UrlsList) {

        for (const currentUrl of UrlsList) {
            const host1 = HtmlUtil.extractHost(url1);
            const host2 = HtmlUtil.extractHost(currentUrl);
            const url1Isnum = /^\d+$/.test(url1);
            let uri1 = !url1Isnum ? HtmlUtil.extractUri(url1).replace('/', '').replace(/[0-9]/g, '') : HtmlUtil.extractUri(url1).replace('/', '');

            if (host1 === host2 && uri1.length > 0) {
                const consturi2Isnum = /^\d+$/.test(currentUrl);
                let uri2 = !consturi2Isnum ? HtmlUtil.extractUri(currentUrl).replace('/', '').replace(/[0-9]/g, '') : HtmlUtil.extractUri(currentUrl).replace('/', '');
              

                if ((uri1.split('/').length - 1) > 0 && (uri2.split('/').length - 1) > 0) {
                    uri1 = uri1.split('/')[uri1.split('/').length - 2];
                    uri2 = uri2.split('/')[uri2.split('/').length - 2];
                    console.log("=================SIM==================", StringSimilarity.compareTwoStrings(uri1, uri2));
                    console.log("=================URI-01===================", uri1);
                    console.log("=================URI-01===================", uri1.split('/')[uri1.split('/').length - 2]);
                    console.log("=================URI-02===================", uri2)
                    console.log("=================URI-02==================", uri2.split('/')[uri2.split('/').length - 2]);
                }

                console.log("**************************************************************************************************")

                if (StringSimilarity.compareTwoStrings(uri1, uri2) > 0.95) {
                    return true;
                }
            } else {
                if (StringSimilarity.compareTwoStrings(url1, currentUrl) > 0.95) {
                    return true;
                }

            }

        }
        return false;


    }

    static checkRelevantTagInTagsNameItem(tagNameParents) {
        return TextUtil.checkTextContainsArray(tagNameParents, 'td') ? true :
            TextUtil.checkTextContainsArray(tagNameParents, 'th') ? true :
                TextUtil.checkTextContainsArray(tagNameParents, 'thead') ? true :
                    TextUtil.checkTextContainsArray(tagNameParents, 'tr') ? true :
                        TextUtil.checkTextContainsArray(tagNameParents, 'li') ? true : false

    }


    static checkTextContainsInText(textValidation, text) {
        if (text === textValidation || text.includes(textValidation)) {
            return true;
        }
        return false;
    }

    static getUrlsNodes(array) {
        let urls = [];
        for (let index = 0; index < array.length; index++) {
            const value = array[index].getSource().getValue();
            const urlParent = array[index].getSource().getUrl();
            if (HtmlUtil.isUrl(value)) {
                urls.push(value);
            }

            if (value !== urlParent && TextUtil.checkTextContainsArray(urls, urlParent)) {
                urls.push(urlParent);
            }

        }
        return urls;
    }

    static validateItemSearch(criterionName) {
        const unusableTerms = {
            'Despesa Extra Orçamentária': ['despesa orcamentaria', 'despesas orcamentarias', 'receitas', 'receita', 'licitacao', 'licitacoes', 'pessoal', 'folha de pagamento',
                'demonstrativo', 'outras despesas', 'restos a pagar', ' por orgao', 'obras', 'diarias', 'passagens', 'transferencia', 'programatica', 'fornecedor',],
            'Despesa Orçamentária': ['extra', 'elemento', 'favorecido', 'orgao', 'programatica', 'obras', 'passagens', 'transferencia', 'diarias', 'receitas', 'outras despesas', 'receita', 'pessoal', 'folha de pagamento', 'demonstrativo', 'restos a pagar'],
            'Receita Orçamentária': ['extra', 'divisorReceitaCompetencia', 'deducao', 'transferencias', 'transferencia', 'detalhado', 'receita de contribuicoes', 'receita de servicos', 'receita patrimonial', 'comparativo', 'restos a pagar', 'prevista', 'resumo geral', 'loalei', 'execucao', 'outras receitas', 'despesas', 'licitacao', 'licitacoes', 'pessoal', 'folha de pagamento', 'demonstrativo'],
            'Receita Extra Orçamentária': ['transferencias', 'receitas orcamentarias', 'despesas', 'licitacao', 'licitacoes', 'despesa', 'pessoal', 'restos a pagar', 'folha de pagamento', 'demonstrativo', 'outras receitas'],
            'Licitação': ['extra', 'contratos', 'receitas', 'despesa', 'despesas', 'receita', 'pessoal', 'folha de pagamento', 'demonstrativo', 'consultar restos a pagar'],
            'Quadro Pessoal': ['extra', 'receitas', 'outras despesas', 'receita', 'licitacao', 'licitacoes', 'demonstrativo', 'consultar restos a pagar']

        };

        const unusableCommumTerms = ["javascript", 'filtro', 'xmlrpc', 'feed', 'tutorial', "pwd", "transparencia.rn.gov.br", "css", "recuperar-senha", "cadastro", '.xml', "email", 'whatsapp', 'print', 'png', 'dist', 'src', '.css',
            '.js', 'download', 'widget', ".zip", ".jpeg", ".rar", "noticia", "publicidade", "noticia", "pinterest.com", 'javascript', 'wp-json', 'json'
        ];

        let unusableCommumTermsFinal = unusableTerms[criterionName];
        unusableCommumTermsFinal.push.apply(unusableCommumTermsFinal, unusableCommumTerms)
        return unusableCommumTermsFinal;
    };

}