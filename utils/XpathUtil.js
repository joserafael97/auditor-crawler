class XpathUtil {
                    
    test() {
                        DESPESA.PALAVRAS_CHAVES_BUSCA;:
                            [{'palavra_chave': 'despesas', 'prioridade': 1},
                             {'palavra_chave': 'despesas orcamentaria', 'prioridade': 1},
                             {'palavra_chave': 'despesa com licitacao', 'prioridade': 2},
                             {'palavra_chave': 'despesa por elemento', 'prioridade': 2},
                             {'palavra_chave': 'despesa por orgao', 'prioridade': 2},
                             {'palavra_chave': 'despesa por favorecido', 'prioridade': 2},
                             {'palavra_chave': 'despesa por funcional programatica', 'prioridade': 2},
                             {'palavra_chave': 'despesa por transferencia', 'prioridade': 2},
                            ];
                    

                    }
    

    cria_xpath_palavras_chaves(palavra_chave, lista, tipo, portal, item); {
        lista = cls.seleciona_dicionario(item);

        consulta = '';
        consulta_palavra_espacos = '';

        for valor in lista[palavra_chave]:

            contem_espaco = ' ' in valor; and; tipo == XpathUtil.CONTEM;

        if (lista[palavra_chave].index(valor)) == 0;:
            valor = ValidacaoUtil.normalize_texto(str(valor));
        condicao = tipo % (XpathUtil.__normalize_xpath('text()'), valor);
        else :
            valor = ValidacaoUtil.normalize_texto(str(valor));
        condicao = 'or ' + tipo % (XpathUtil.__normalize_xpath('text()'), valor);

        if contem_espaco:
            valor = ValidacaoUtil.normalize_texto(str(valor));
        condicao_espaco = XpathUtil._cria_xpath_com_espaco(valor);
        consulta_palavra_espacos = ' | '.join([consulta_palavra_espacos, condicao_espaco]);

        consulta = ' '.join([consulta, condicao]);

        return '//*[%s] %s' % (str(consulta), str(consulta_palavra_espacos));
    }

    cria_xpath_busca(lista_termos_chaves); {
        lista_xpath = [];
        prioridade = 1;
        while prioridade < 11:
            for valor in lista_termos_chaves:
            palavra_chave = ValidacaoUtil.normalize_texto(str(valor['palavra_chave'])
                .lower()).replace(':-_', '');
        if valor['prioridade'] == prioridade:
            lista_xpath.append('//*[contains(%s,"%s")]/@href ' %
                (XpathUtil.__normalize_xpath('text()'), palavra_chave));
        lista_xpath.append('//*[contains(%s,"%s")]/@href' %
            (XpathUtil.__normalize_xpath('@href'), palavra_chave));
        lista_xpath.append('//*[%s  = "%s"]/@href' %
            (XpathUtil.__normalize_xpath('text()'), palavra_chave));
        lista_xpath.append('//*[%s = "%s"]/@href' %
            (XpathUtil.__normalize_xpath('@href'), palavra_chave));
        lista_xpath.append('//*[contains(%s,"%s")]/@href' %
            (XpathUtil.__normalize_xpath('@href'), palavra_chave));
        lista_xpath.append('//a[contains(%s, "%s")]/@href' %
            (XpathUtil.__normalize_xpath('@title'), palavra_chave));
        lista_xpath.append('//*[contains(%s, "%s")]/parent::a/@href' %
            (XpathUtil.__normalize_xpath('text()'), palavra_chave));
        lista_xpath.append('// *[%s = "%s"]/following::td[1]//@href' %
            (XpathUtil.__normalize_xpath('text()'), palavra_chave));
        lista_xpath.append('//*[contains(%s, "%s")]/@href' %
            (XpathUtil.__normalize_xpath('@title'), palavra_chave));

        prioridade += 1;
        return lista_xpath;
    }

}