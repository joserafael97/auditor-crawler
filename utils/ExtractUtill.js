

class ExtractUtil {

    url_extract(html) {
        
        lista_urls = []
        termos = [i.get('palavra_chave') for i in TermosComuns.palavras_chaves_buscas['comum']] + \
                 TermosComuns.termos_nao_uteis

        for xpath in lista_xpath:
            for valor in response_temp.xpath(xpath).extract():
                valor = str(valor).lstrip().replace('"', '').replace('\\', "")
                if valor and SpiderUtil.valida_url_uteis(valor=valor, termos=termos):
                    if SpiderUtil.checar_url_e_valida(valor) \
                            and not ValidacaoUtil.verificar_similaridade_entre_urls(valor, lista_urls):
                        lista_urls.append(valor)

                    elif SpiderUtil.checar_url_e_valida(urljoin(response_temp.url, valor)) \
                            and not ValidacaoUtil.verificar_similaridade_entre_urls(urljoin(response_temp.url, valor),
                                                                                    lista_urls):
                        lista_urls.append(urljoin(response_temp.url, valor))
        return lista_urls
    }

}