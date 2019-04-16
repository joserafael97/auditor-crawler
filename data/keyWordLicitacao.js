const keywordSearchLicitacao = ['consultar licitacoes', 'licitacao', 'licitacoes.aspx', 'acesso licitacoes',
    'despesa com licitacao', 'Licitacao', 'Licitacoes', 'Licitações', 'Procedimentos Licitatórios'
];

const identificationKeyLicitacao = {
    "numero_licitacao": ["numero da licitacao", "nº licitacao", "numero", "processo",
        "numero", "N° Processo"
    ],
    "objeto_licitacao": ["Objeto", "descricao do objeto", "objeto resumido",
        "tipo do objeto"
    ],
    "modalidade_licitacao": ["tipo", "modalidade", "categoria"],
    "data_publicacao_licitacao": ["data", "data publicacao", "data da homogacao",
        "data da homologacao",
        "data da publicacao", "dt. homologacao", "homologacao"
    ],
    "valor": ["valor"],
    "cnpj_cpf": ["cpf", "cnpj"],
    "edital": ["edital"],
    "nome_vencedores": ["fornecedor", "favorecido", "Participantes"],
    "nome_perdedores": ["participante", "participantes"],
    "data_realizacao": ["assinatura", "abertura / realizacao", "data inicial"],
    "setor_interessado": ["setor interessado", "reparticao/setor interessado:", "orgao"],
    "integra": ["integra"],
    "termo_ratificacao": ["ratificacao", ],
    "pregao": ["pregao", "pregao eletronico"],
    "aviso": ["edital", "publicacao", "aviso"],
    "licitado": ["licitado", "licitacao"]
}

export {keywordSearchLicitacao};
export {identificationKeyLicitacao};
