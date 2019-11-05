const keywordSearchLicitacao = ['consultar licitacoes', 'Dados de Licitações', 'Consultar Licitações Empenhadas','Licitações Empenhadas', 'licitacao', 'licitacoes.aspx', 'acesso licitacoes',
    'despesa com licitacao', 'Licitacao', 'Licitacoes', 'Licitações', 'Dados de Licitações', 'detalharLicitacao' ,'Procedimentos Licitatórios', 'consultar', 'Pesquisar', "/"+new Date().getFullYear(),
];

const identificationKeyLicitacao = {
    "numero_licitacao": ["numero da licitacao", "nº licitacao", "numero", "processo",
        "numero", "N° Processo"
    ],
    "objeto_licitacao": ["Objeto", "Objeto da Licitação", "descricao do objeto", "objeto resumido",
        "tipo do objeto"
    ],
    "modalidade_licitacao": ["tipo", "modalidade", "categoria"],
    "data_publicacao_licitacao": ["data publicacao", "data", "data da homogacao",
        "data da homologacao", "Publicação", 'Dt. Publicação do Edital',
        "data da publicacao", "dt. homologacao", "homologacao", 
    ],
    "valor": ["valor", 'VALOR R$', 'Valor Contratado'],
    "cnpj_cpf": ["cpf", "cnpj", 'CNPJ/CPF', 'CPF/CNPJ'],
    "edital": ["edital"],
    "nome_vencedores": ["fornecedor", "favorecido", "Participantes", 'Status', 'propostas'],
    "nome_perdedores": ["participante", "participantes", 'propostas'],
    "data_realizacao": ["assinatura", 'DATA ASSINATURA', 'Abertura / Realização', 'Data do Contrato','Dt. Abertura/Realização', "abertura / realizacao", "data inicial"],
    "setor_interessado": ["setor interessado", "reparticao/setor interessado", "orgao", 'Órgão / UO / UG Licitante'],
    "integra": ["integra"],
    "termo_ratificacao": ["ratificacao", ],
    "pregao": ["pregao", "pregao eletronico"],
    "aviso": ["edital", "publicacao", "aviso"],
    "licitado": ["licitado", "licitacao"]
}

export {keywordSearchLicitacao};
export {identificationKeyLicitacao};
