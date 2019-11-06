import HtmlUtil from "./htmlUtil";
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


    static checkTextContainsArray(array, text, withOutNormalization = true) {
        for (let index = 0; index < array.length; index++) {
            const value = withOutNormalization ? TextUtil.normalizeText(TextUtil.removeWhiteSpace(array[index])) :
                TextUtil.removeWhiteSpace(array[index]).toLowerCase();
            text = text.toLowerCase();

            if (text === value || text.includes(value)) {

                return true;
            }

        }
        return false;
    }

    static extractTermsCriterionName(criterionKeyWordName) {
        criterionKeyWordName = criterionKeyWordName === "Licitação" ? "licitac" : criterionKeyWordName;
        let terms = [];

        if (criterionKeyWordName.indexOf(' ') >= 0) {
            terms = criterionKeyWordName.split(" ");
        }
        criterionKeyWordName = criterionKeyWordName.toLowerCase()
        terms.push(criterionKeyWordName)

        return terms;

    }

    static similarityTwoString(string01, string02) {
        return StringSimilarity.compareTwoStrings(string01, string02) > 0.95;
    }

    static checkUrlRelvant(urlPage, criterionName) {

        urlPage = urlPage.toLowerCase();

        for (const term of TextUtil.extractTermsCriterionName(criterionName)) {
            if (TextUtil.checkTextContainsInText(term.toLowerCase(), urlPage)) {
                return true;
            }
        }

        return false;
    }

    static checkEqualsArrays(array01, array02) {
        if (JSON.stringify(array01) == JSON.stringify(array02)) {
            return true
        } else {
            return false
        }
    }

    static checkArrayContainsInListArrays(arrayList, array02) {
        for (const array01 of arrayList) {
            if (TextUtil.checkEqualsArrays(array01, array02)) {
                return true;
            }

        }
        return false;

    }

    static similarityUrls(url1, UrlsList, similarityValue = 0.93) {
        url1 = url1.substr(url1.length - 1) === "/" ? url1.slice(0, -1) : url1;

        for (const currentUrl of UrlsList) {
            if ((StringSimilarity.compareTwoStrings(currentUrl, url1) > similarityValue)) {
                return true;
            }

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
                }

                if (StringSimilarity.compareTwoStrings(uri1, uri2) > similarityValue) {
                    return true;
                }
            } else {
                if (StringSimilarity.compareTwoStrings(url1, currentUrl) > similarityValue) {
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
                        TextUtil.checkTextContainsArray(tagNameParents, 'li') ? true :
                            TextUtil.checkTextContainsArray(tagNameParents, 'span') ? true : false


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
            'Despesa Extra Orçamentária': ['despesas-quadro-geral', 'gerenciamento-frota', 'despesas-favorecidos', 'quadro-geral', 'detalhamento', 'previsao', 'arrecadacao', 'sagresonline.tce.pb.gov.br', 'despesa orcamentaria', 'empenho', 'servicos', 'locomocao', 'despesas orcamentarias', 'receitas', 'receita', 'licitacao', 'licitacoes', 'pessoal', 'folha de pagamento',
                'demonstrativo', 'outras despesas', 'restos a pagar', ' por orgao', 'obras', 'diarias', 'passagens', 'transferencia', 'programatica', 'fornecedor',],
            'Despesa Orçamentária': ['sagresonline.tce.pb.gov.br', 'extra', 'elemento', 'favorecido', 'orgao', 'programatica', 'obras', 'passagens', 'transferencia', 'diarias', 'receitas', 'outras despesas', 'receita', 'pessoal', 'folha de pagamento', 'demonstrativo', 'restos a pagar'],
            'Receita Orçamentária': ['o que e receita?', 'sagresonline.tce.pb.gov.br', 'despesa', 'extra', 'divisorReceitaCompetencia', 'deducao', 'transferencias', 'transferencia', 'detalhado', 'receita de contribuicoes', 'receita de servicos', 'receita patrimonial', 'comparativo', 'restos a pagar', 'prevista', 'resumo geral', 'loalei', 'execucao', 'outras receitas', 'despesas', 'licitacao', 'licitacoes', 'pessoal', 'folha de pagamento', 'demonstrativo'],
            'Receita Extra Orçamentária': ['receitas-quadro-geral', 'quadro-geral', 'detalhamento', 'previsao', 'arrecadacao', 'sagresonline.tce.pb.gov.br', 'transferencias', 'receitas orcamentarias', 'despesas', 'licitacao', 'licitacoes', 'despesa', 'pessoal', 'restos a pagar', 'folha de pagamento', 'demonstrativo', 'outras receitas'],
            'Licitação': ['o que e uma licitacao?', 'receita', 'extra', 'extraorcamentarias', 'sagresonline.tce.pb.gov.br', 'contratos', 'receitas', 'despesa', 'despesas', 'receita', 'pessoal', 'folha de pagamento', 'demonstrativo', 'consultar restos a pagar'],
            'Quadro Pessoal': ['extra', 'receitas', 'outras despesas', 'receita', 'licitacao', 'licitacoes', 'demonstrativo', 'consultar restos a pagar']

        };

        const unusableCommumTerms = ["javascript", 'facebook', 'themes', 'wp-content', 'form', 'addtoany', 'staticxx', 'e=101095', 'insira o texto', 'facebook', 'assets', 'anexo', 'ldolei', 'http://sagresonline.tce.pb.gov.br#/municipal/execucao-orcamentaria', 'foot', 'graficos', 'token', 'maps', 'filtro', 'xmlrpc', 'feed', 'tutorial', "pwd", "transparencia.rn.gov.br", "css", "recuperar-senha", "cadastro", '.xml', "email", 'whatsapp', 'print', 'png', 'dist', 'src', '.css',
            '.js', 'download', 'widget', ".zip", '.jpg', ".jpeg", ".rar", "noticia", "publicidade", "noticia", "pinterest.com", 'javascript', 'wp-json', 'json'
        ];

        let unusableCommumTermsFinal = unusableTerms[criterionName];
        unusableCommumTermsFinal.push.apply(unusableCommumTermsFinal, unusableCommumTerms)
        return unusableCommumTermsFinal;
    };

}