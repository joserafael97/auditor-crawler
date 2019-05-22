'use strict';


export default class ExtractUtil {

    // let itemToAdd = Item({
    //     name: 'teste item2',
    //     found: true,
    //     foundText: 'teste encontrado2',
    //     xpath: '*//[sdks == sas2]',
    //     pathSought: '',
    //     proof: '',
    //     proofText: ''
    // });
    // connectToDb();

    // try {
    //     const savedItem = Item.addItem(itemToAdd);
    //     logger.info('Item saved...');
    //     console.log('added: ' + Item.getAll());
    // } catch (err) {
    //     logger.error('Error in- ' + err);
    //     console.log('Got error in getAll');
    // }

    static asycn criaItem(response, item_obj, origem = None, html_response = None) {
        item_obj['avaliacao'] = cls.criar_avaliacao_item(response.meta['municipio'])

        let queryElements = await XpathUtil.createXpathsToExtractUrls(criterionKeyWordName);

        if lista:
            for chave in lista.keys():
                if ValidacaoUtil.campo_nao_preenchido(chave, item_obj):
                    item_obj = cls.__valida_e_cria_item(item_obj, response, chave, lista, XpathUtil.IGUAL, origem, html_response)

        return item_obj

    }

    // @classmethod
    // def __valida_e_cria_item(cls, item_obj, response, chave, lista, tipo_busca, origem, html_response=None):
    //     """
    //         Extrai e valida critério avaliado representado pelo item_obj passado como parâmetro.
    //         Args:
    //             item_obj: objeto que representa o critério avaliado
    //             response: scrapy.Response objeto com todos as informações da resquisão
    //             chave: item ao qual deseja extrair valores
    //             lista: lista de palavras chaves relacionadas ao critério avaliado
    //             lista: tipo de busca utilizada podendo ser ConsultaUtil.IGUAL ou ConsultaUtil.CONTEM
    //         Returns:
    //             Objeto com informações extraídas e validadas.
    //     """
    //     empresa_portal = UrlPortais.mapeamento_municipios[response.meta['municipio']]['empresa_portal']

    //     isSerieHistorica = True if item_obj.__class__.__name__ == 'SerieHistoricaItem' else False

    //     xpath_criterio = XpathUtil.cria_xpath_palavras_chaves_serie_historica(chave, lista, tipo_busca, empresa_portal, item_obj, chave) \
    //         if isSerieHistorica else XpathUtil.cria_xpath_palavras_chaves(chave, lista, tipo_busca, empresa_portal, item_obj)

    //     valor = response.meta['html_response_selenium'].xpath(xpath_criterio).extract_first() \
    //         if response.meta['html_response_selenium'] else response.xpath(xpath_criterio).extract_first()

    //     # no caso do uso da função count o valor 0 representa falso
    //     valor_formatado = HtmlUtil.remove_todas_tags_html(valor).strip() if valor else valor

    //     if valor and len(valor_formatado) > 0 and valor != '0' and(chave == "extracao_dos_dados" or ValidacaoUtil.valida_palavra_chave(valor_formatado, chave, lista, item_obj)):
    //         valor_formatado = HtmlUtil.extrai_data_into_string(valor_formatado, chave) if isSerieHistorica else valor_formatado
    //         item_obj[chave] = cls.cria_resultado_item(True, valor_formatado, xpath_criterio, origem, item_obj, chave, response)

    //     elif tipo_busca == XpathUtil.IGUAL:
    //         cls.__valida_e_cria_item(item_obj, response, chave, lista, XpathUtil.CONTEM, origem, html_response)
    //     else:
    //         item_obj[chave] = cls.cria_resultado_item(False, 'Não foi extraído', xpath_criterio, origem, response=response)

    //     return item_obj

    // @staticmethod
    // def __extrai_dados(chave, lista, item_obj, response):
    //     """
    //         Extrai dados relacionados a chave passada como parâmetro
    //         Args:
    //             chave: item ao qual deseja extrair valores
    //             lista: lista de palavras chaves relacionadas ao critério avaliado
    //             item_obj: objeto que representa o critério avaliado
    //             response: scrapy.Response objeto com todos as informações da requisição
    //         Returns:
    //             Objeto ResultadoItem com as informações extraídas do crawler, inseridas no item.
    //     """
    //     xpath_valores_criterio = XpathUtil.cria_xpath_valor(chave, lista, type(item_obj).__name__,
    //                                                         response.url)
    //     valores_extraidos = []
    //     valores = response.xpath(xpath_valores_criterio).extract()
    //     for valor_extraido in valores:
    //         valores_extraidos.append(HtmlUtil.remove_todas_tags_html(valor_extraido)
    //                                  .replace("\r\n", '').replace("\t", '').replace("\n", '').strip())
    //     return valores_extraidos

    // @staticmethod
    // def cria_resultado_item(encontrado, texto_encontrado, xpath, origem, item=None, chave=None, response=None):
    //     """Cria objeto para retorno de resultado das informações buscadas nos critérios
    //         Args:
    //             encontrado: retorna um boolean, que representa a presença ou não do item avaliado.
    //             texto_encontrado: texto da coluna encontrada.
    //             xpath: xpath usado para encontrar as informações
    //         Returns:
    //             Objeto ResultadoItem com as informações extraídas do crawler, inseridas no item.
    //     """
    //     resultado_item = EntidadeResultadoItem()
    //     resultado_item[CONSTANTES_AVALIACAO.ENCONTRADO] = encontrado
    //     resultado_item[CONSTANTES_AVALIACAO.TEXTO_ENCONTRADO] = texto_encontrado
    //     resultado_item[CONSTANTES_AVALIACAO.XPATH] = xpath
    //     resultado_item[CONSTANTES_AVALIACAO.EVIDENCIA] = None

    //     response_temp = response.meta['html_response_selenium'] if response.meta['html_response_selenium'] else response
    //     resultado_item[CONSTANTES_AVALIACAO.ONDE_FOI_ENCONTRADO] = response_temp.url if encontrado else ''

    //     if encontrado:
    //         resultado_item[CONSTANTES_AVALIACAO.ORIGEM] = origem
    //         origem = []
    //         resultado_item = ValidacaoUtil.valida_resultado_item(chave, texto_encontrado, resultado_item, item, response)

    //     else:
    //         resultado_item[CONSTANTES_AVALIACAO.ORIGEM] = None
    //         resultado_item[CONSTANTES_AVALIACAO.VALIDO] = False

    //     return resultado_item

    

    // @classmethod
    // def verifica_existencia_de_portal_transp(cls, item):
    //     xpath_padrao = "//a[text()='Transparência Fiscal']/@href"
    //     url_portal = None
    //     url_prefeitura = item['avaliacao']['url_prefeitura']

    //     response = requests.get(url_prefeitura)
    //     response_html = html.fromstring(response.content)
    //     xpath_results = response_html.xpath(xpath_padrao)
    //     if xpath_results:
    //         url_portal = xpath_results[0]

    //     return cls.cria_item_para_acesso_em_site_oficial(url_portal, xpath_padrao, url_prefeitura)

    // @staticmethod
    // def cria_item_para_acesso_em_site_oficial(url_portal=None, xpath="", url_prefeitura=""):
    //     chave = CONSTANTES_ITENS_USABILIDADE.ACESSO_NO_SITE_OFICIAL
    //     item = Item()
    //     item.nome_item = chave
    //     item.xpath = xpath
    //     item.encontrado = url_portal != None
    //     item.texto_encontrado = url_portal if item.encontrado else "Não foi extraído"
    //     item.valido = True
    //     item.origem = [url_prefeitura]
    //     item.pontuacao = EntidadePontuacao().calc_pontuacao_criterio(CONSTANTES_CRITERIOS.USABILIDADE, chave) if item.encontrado else 0
    //     item.evidencia = None
    //     item.onde_foi_encontrado = url_portal if item.encontrado else ""

    //     return item


}