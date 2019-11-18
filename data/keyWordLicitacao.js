const keywordSearchLicitacao = ['consultar licitacoes', 'licitacoes empenhadas',  'Dados de Licitacoes', 'Consultar Licitações Empenhadas','Licitações Empenhadas', 'licitacao', 'licitacoes.aspx', 'acesso licitacoes',
    'despesa com licitacao', 'Licitacao', 'Licitacoes', 'Licitacoes', 'Dados de Licitacoes', 'detalharLicitacao' ,'Procedimentos Licitatórios', 'consultar', 'Pesquisar', "/"+new Date().getFullYear(),
];

const identificationKeyLicitacao = {
    "numero_licitacao": ["numero da licitacao", "nº licitacao", "numero", "processo",
        "numero", "N° Processo"
    ],
    "objeto_licitacao": ["Objeto", "Objeto da Licitação", "descricao do objeto", "objeto resumido",
        "tipo do objeto"
    ],
    "modalidade_licitacao": ["tipo", "modalidade", "categoria", 'Modalidade de Licitacao'],
    "data_publicacao_licitacao": ["data publicacao", 'Data de Publicacao', "data", "data da homogacao",
        "data da homologacao", "Publicação", 'Dt. Publicação do Edital',
        "data da publicacao", "dt. homologacao", "homologacao", 
    ],
    "valor": ["valor", 'VALOR R$', 'Valor Contratado', 'Valor da Proposta ou do ultimo Lance'],
    "cnpj_cpf": ["cpf", "cnpj", 'CNPJ/CPF', 'CPF/CNPJ', 'CNPJ ou CPF'],
    "edital": ["edital"],
    "nome_vencedores": ["fornecedor", 'Nomes dos Participantes Vencedores', "favorecido", "Participantes", 'Status', 'propostas'],
    "nome_perdedores": ["participante", "participantes", 'propostas', 'Nome dos Participantes perdedores'],
    "data_realizacao": ['Data de Realizacao', "assinatura", 'DATA ASSINATURA', 'Abertura / Realização', 'Data do Contrato','Dt. Abertura/Realização', "abertura / realizacao", "data inicial"],
    "setor_interessado": ["setor interessado", 'Reparticao ou Setor Interessado', "reparticao/setor interessado", "orgao", 'Órgão / UO / UG Licitante'],
    "integra": ["integra"],
    "termo_ratificacao": ["ratificacao", ],
    "pregao": ["pregao", "pregao eletronico"],
    "aviso": ["edital", "publicacao", "aviso"],
    "licitado": ["licitado"]
}

export {keywordSearchLicitacao};
export {identificationKeyLicitacao};
