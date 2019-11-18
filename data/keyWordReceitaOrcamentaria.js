const keywordSearchRecOrcamentaria = ['orcamentaria', 'orcamentarias', 'lnkReceitaOrcamentaria', 'Receita Geral','Receitas', 'receita-orcamentaria', 'Consultar Receitas Orçamentárias',
    'receita prevista com arrecadada', 'Receitas Orçamentárias', 'receita', 'onCellClick','Consultar', 'consultando', 'DetalhesReceita', 'Pesquisar', "/"+new Date().getFullYear(),
];

const identificationKeyWordRecOrcamentaria = {
    "uni_gestora": ['nome', 'unidade gestora', 'orgao', 'entidade', 'Nome Entidade',
        'fonte de recurso', 'Entidade'
    ],
    "previsao": ['valor previsto(r$)', 'receita prevista', 'previsao de receitas',
        'Valor Previsto', 'Previsão', 'Prev. Inicial', 
        'prevista'
    ],
    "arrecadacao": ['valor arrecadado(r$)', 'receita arrecadada', 'realizada ate o mes',
        'Arrecadada',
        'arrecadado ate o momento', 'arrecadacao de receitas',
        'Valor Arrecadado', 'Arrecadação', 'Arrec. Total'
    ],
    "lancado": ['valor lancado(r$)', 'valor', 'lançada' , 'Prev. Atualizada'],
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

