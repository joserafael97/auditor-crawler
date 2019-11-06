const keywordSearchDespOrcamentaria = ['despesas', 'lnkDespesasPor_NotaEmpenho','Despesa Geral', 'Detalhes do Empenho', 'empenhos','despesas orcamentaria', 'Consultar Despesas Orçamentárias', 'despesa com licitacao',
    'despesa por elemento', 'despesa por orgao', 'despesa por favorecido', 'despesa por funcional programatica', 'despesa por transferencia', 'consultar', 
    'detalhesEmpenho', 'Pesquisar', "Ordem de Pagamento", "/"+new Date().getFullYear(),
];

const identificationKeyWordDespOrcamentaria = {
    "funcao": ['funcao'],
    "sub_funcao": ['subfuncao', 'sub funcao'],
    "orgao_or_uni_orcamentaria": ['ORGÃO', 'unidade orcamentaria', 'descricao do orgao',
    'und. orcamentaria'],

    "programa": ['programa', 'descricao do programa', 'funcao programatica',
        'programa de governo'
    ],
    "categoria_economica": ['categoria economica', 'cat.economica'],
    "acao": ['acao', 'classificacao', 'acao de governoNatuirezValor ', 'acao de governo'],
    "natureza_despesa": ['nat. desp.', 'natureza', 'natureza',
        'descricao da natureza da despesa',
        'natureza da despesa'
    ],
    "modalidade": ['modalidade', 'tipo da licitacao', 'modalidade de aplicacao', ],
    "elemento": ['elemento', 'classificacao', 'elemento de depesa', 'elemento da despesa', 'Nome da Natureza'],
    "emp_numero": ['empenho', 'numero', 'Ficha', 'Número do Empenho'],
    "emp_data": ['data'],
    "emp_cnpj_cpf": ['cpf/cnpj', "cpf", "cnpj"],
    "emp_indicacao_licitacao": ['tipo da licitacao', 'nº licitacao', 'licitacao',
        'nº. da licitacao', 'tipo'
    ],
    "emp_valor": ['valor', 'valor empenhado(r$)', 'valor empenhado'],
    "valor_fixado": ['valor Fixado(r$)', 'valor empenhado'],
    "valor_liquidado": ['valor liquidado(r$)', 'valor liquidado'],
    "valor_pago": ['valor pago(R$)', 'valor pago'],
    "lic_data_pag_ultima": ['dt. pag. ultima parcela.'],
    "lic_obj_servico": ['tipo do objeto'],
    "sub_elemento": ['elemento', 'sub-elemento', 'subelemento', 'subelemento da despesa'],
    "lic_modalidade": ['modalidade', 'modalidade aplicacao', 'Modalidade de Aplicacao'],
    "lic_numero": ['nº licitacao', 'licitacao'],
    "lic_num_contrato": ['numero', 'historico'],
    "nome": ['orgao', 'unid. orcamentaria', 'UNIDADE ORÇAMENTÁRIA', 'credor']
};

export {identificationKeyWordDespOrcamentaria};
export {keywordSearchDespOrcamentaria};