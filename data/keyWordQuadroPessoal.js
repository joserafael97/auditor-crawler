const keywordSearchPessoal = ['folha de pagamento', 'QUADRO FUNCIONAL', 'Pessoal', 'Folha de Pessoal', 'Despesas com Servidores', 'TipoServidor','folhapag', 
'quadro pessoal', 'Folha Pagamento', 'Servidores', 'consultar', 'Acessar', 'Pesquisar', "/"+new Date().getFullYear(),];


const identificationKeyWordPessoal = {
    'nome': ['nome', 'Servidor'],
    'cpf': ['cpf', 'nome'],
    'cargo': ['cargo', 'CARGO/VINCULO'],
    'tipo_cargo': ['tipo do ato', 'Vinculo', 'secretaria', 'tipo cargo', 'tipo de cargo', 'regime', 'tipo', 'Tipo de Contratação'],
    'salario_cargo': ['salario', 'Total Vantagem*', 'sal. base', 'liquido', 'valor liquido', 'Vantagens','Vantagens (Bruto)', 'total liquido R$'],
};

export {identificationKeyWordPessoal};
export {keywordSearchPessoal};
