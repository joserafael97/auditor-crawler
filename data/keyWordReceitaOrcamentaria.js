const keywordSearchRecOrcamentaria = ['ORÇAMENTÁRIA', 'Receitas', 'receita-orcamentaria', 'Consultar Receitas Orçamentárias',
    'receita prevista com arrecadada', 'Receitas Orçamentárias', 'receita', 'Consultar', 'consultando', 'DetalhesReceita', 'Pesquisar', "/"+new Date().getFullYear(),
];

const identificationKeyWordRecOrcamentaria = {
    "uni_gestora": ['nome', 'unidade gestora', 'orgao', 'entidade', 'Nome Entidade',
        'fonte de recurso', 'Entidade'
    ],
    "previsao": ['valor previsto(r$)', 'receita prevista', 'previsao de receitas',
        'Valor Previsto', 'Previsão',
        'prevista'
    ],
    "arrecadacao": ['valor arrecadado(r$)', 'receita arrecadada', 'realizada ate o mes',
        'Arrecadada',
        'arrecadado ate o momento', 'arrecadacao de receitas',
        'Valor Arrecadado', 'Arrecadação'
    ],
    "lancado": ['valor lancado(r$)', 'valor', 'lançada'],
    "categoria_economica": ['categoria da receita', 'receita l.o.a.', 'CATEGORIA ECONÔMICA'],
    "origem": ['origem dos recursos a conta', 'descricao da receita', 'nome',
        'descricao receita (STN)',  'Descrição STN', 'Descrição',
        'Fonte Recurso', 'Fonte de Recurso', 'ORIGEM', 'Fonte do Recurso'
    ],
    "especie": ['especie'],
    "rubrica": ['rubrica'],
    "alinea": ['alinea'],
    "sub_alinea": ['subalinea', 'sub alinea'],
};

export {identificationKeyWordRecOrcamentaria};
export {keywordSearchRecOrcamentaria};

