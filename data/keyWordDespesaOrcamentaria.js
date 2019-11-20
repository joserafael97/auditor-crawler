const keywordSearchDespOrcamentaria = ['despesa', 'orcamentaria', 'detalharEmpenho','orcamentarias', 'lnkDespesasPor_NotaEmpenho', 'Despesa Geral', 'Detalhes do Empenho', 'empenhos', 'despesas orcamentaria', 'Consultar Despesas Orçamentárias', 'despesa com licitacao',
    'despesa por elemento', 'despesa por orgao', 'despesa por favorecido', 'despesa por funcional programatica', 'despesa por transferencia', 'consultar',
    'detalhesEmpenho', 'Pesquisar',  'Detalhes do Empenho','despesa/empenho/licitacao.xhtml', "Ordem de Pagamento", "/" + new Date().getFullYear(),
];

const identificationKeyWordDespOrcamentaria = {
    "funcao": ['funcao'],
    "sub_funcao": ['subfuncao', 'sub funcao'],
    "orgao_or_uni_orcamentaria": ['ORGÃO', 'unidade orcamentaria', 'descricao do orgao',
        'und. orcamentaria'],

    "programa": ['programa', 'descricao do programa', 'funcao programatica',
        'programa de governo'
    ],
    "categoria_economica": ['categoria economica', 'cat.economica', 'categoria economica (3 - Despesa Corrente)'],
    "acao": ['acao', 'classificacao', 'acao de governoNatuirezValor ', 'acao de governo'],
    "natureza_despesa": ['nat. desp.', 'natureza', 'natureza',
        'descricao da natureza da despesa',
        'natureza da despesa'
    ],
    "modalidade": ['modalidade', 'tipo da licitacao', 'modalidade de aplicacao',],
    "elemento": ['elemento', 'classificacao', 'elemento de depesa', 'elemento da despesa', 'Elemento da Despesa (30 - Material de Consumo)', 'Nome da Natureza', 'Elemento da Despesa (36 - Outros Serviços de Terceiros - Pessoa Física)'],
    "emp_numero": ['empenho', 'numero', 'Ficha', 'Número do Empenho'],
    "emp_data": ['data'],
    "emp_cnpj_cpf": ['cpf/cnpj', "cpf", "cnpj", 'CNPJ/CPF'],
    "emp_indicacao_licitacao": ['tipo da licitacao', 'nº licitacao', 'licitacao',
        'nº. da licitacao', 'tipo'
    ],
    "emp_valor": ['valor', 'valor empenhado(r$)', 'valor empenhado', 'Valor do Empenho R$'],
    "valor_fixado": ['valor Fixado(r$)', 'valor empenhado', 'Valor do Empenho R$'],
    "valor_liquidado": ['valor liquidado(r$)', 'valor liquidado', 'VALOR LIQUIDADO R$'],
    "valor_pago": ['valor pago(R$)', 'valor pago'],
    "lic_data_pag_ultima": ['dt. pag. ultima parcela.', 'DATA'],
    "lic_obj_servico": ['tipo do objeto', 'Descricao'],
    "sub_elemento": ['elemento', 'sub-elemento', 'subelemento', 'subelemento da despesa'],
    "lic_modalidade": ['modalidade', 'modalidade aplicacao', 'Modalidade de Aplicacao'],
    "lic_numero": ['nº licitacao', 'licitacao'],
    "lic_num_contrato": ['numero', 'historico'],
    "nome": ['orgao', 'unid. orcamentaria', 'UNIDADE ORÇAMENTÁRIA', 'credor']
};

export { identificationKeyWordDespOrcamentaria };
export { keywordSearchDespOrcamentaria };