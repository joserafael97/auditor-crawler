import HtmlUtil from "../utils/htmlUtil";

export default class TextUtil {

    static normalizeText(text) {
        text = text.replace('-', '').replace(':', '').replace('º', '').replace('°', '')
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        return text.toLowerCase();
    }

    static removeWhiteSpace(text) {
        return text.replace(/(\r\n|\n|\r)/gm, '').replace(/ +(?= )/g, '').trim();
    }

    static checkTextContainsArray(array, text) {
        for (let index = 0; index < array.length; index++) {
            const value = array[index].toLowerCase();
            if (text === value || text.includes(value)) {
                return true;
            }

        }
        return false;
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
            if (HtmlUtil.isUrl(value)) {
                urls.push(value);
            }

        }
        return urls;
    }

    static validateItemSearch(criterionName) {
        const unusableTerms = {
            'Despesa Extra Orçamentária': ['despesa orcamentaria', 'despesas orcamentarias', 'receitas', 'receita', 'licitacao', 'licitacoes', 'pessoal', 'folha de pagamento',
                'demonstrativo', 'outras despesas', 'restos a pagar', ' por orgao', 'obras', 'diarias', 'passagens', 'transferencia', 'programatica', 'fornecedor',],
            'Despesa Orçamentária': ['extra', 'receitas', 'outras despesas','receita', 'licitacao', 'licitacoes', 'pessoal', 'folha de pagamento', 'demonstrativo', 'restos a pagar'],
            'Receita Orçamentária': ['extra', 'detalhado', 'receita de contribuicoes', 'receita de servicos', 'receita patrimonial', 'comparativo', 'restos a pagar', 'prevista', 'resumo geral', 'loalei','execucao','outras receitas', 'despesas','licitacao', 'licitacoes', 'pessoal', 'folha de pagamento', 'demonstrativo'],
            'Receita Extra Orçamentária': ['receitas orcamentarias','despesas', 'licitacao', 'licitacoes', 'pessoal', 'restos a pagar', 'folha de pagamento', 'demonstrativo', 'outras receitas'],
            'Licitação': ['extra', 'receitas', 'outras despesas','receita', 'pessoal', 'folha de pagamento', 'demonstrativo', 'consultar restos a pagar'],
            'Quadro Pessoal': ['extra', 'receitas', 'outras despesas','receita', 'licitacao', 'licitacoes', 'demonstrativo', 'consultar restos a pagar']

        };

        const unusableCommumTerms = ["transparencia.rn.gov.br", "css", "email", 'whatsapp', 'print', 'png', 'dist', 'src', '.css',
            '.js', 'download', 'widget', ".zip", ".jpeg", ".rar", "noticia", "publicidade", "noticia", "pinterest.com",
        ];

        let unusableCommumTermsFinal = unusableTerms[criterionName];
        unusableCommumTermsFinal.push.apply(unusableCommumTermsFinal, unusableCommumTerms)
        return unusableCommumTermsFinal;
    };

}