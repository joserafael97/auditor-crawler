const keywordSearchLicitacao = ['consultar licitacoes', 'Consultar Licitações Empenhadas','Licitações Empenhadas', 'licitacao', 'licitacoes.aspx', 'acesso licitacoes',
    'despesa com licitacao', 'Licitacao', 'Licitacoes', 'Licitações', 'Dados de Licitações', 'Procedimentos Licitatórios', 'consultar', 'Pesquisar'
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
        "data da homologacao", "Publicação",
        "data da publicacao", "dt. homologacao", "homologacao"
    ],
    "valor": ["valor", 'VALOR R$'],
    "cnpj_cpf": ["cpf", "cnpj", 'CNPJ/CPF', 'CPF/CNPJ'],
    "edital": ["edital"],
    "nome_vencedores": ["fornecedor", "favorecido", "Participantes", 'Status', 'propostas'],
    "nome_perdedores": ["participante", "participantes", 'propostas'],
    "data_realizacao": ["assinatura", 'DATA ASSINATURA', "abertura / realizacao", "data inicial"],
    "setor_interessado": ["setor interessado", "reparticao/setor interessado:", "orgao"],
    "integra": ["integra"],
    "termo_ratificacao": ["ratificacao", ],
    "pregao": ["pregao", "pregao eletronico"],
    "aviso": ["edital", "publicacao", "aviso"],
    "licitado": ["licitado", "licitacao"]
}

export {keywordSearchLicitacao};
export {identificationKeyLicitacao};
