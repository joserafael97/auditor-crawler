const keywordSearchPessoal = ['folha de pagamento', 'QUADRO FUNCIONAL', 'Pessoal', 'Folha de Pessoal', 'Despesas com Servidores', 'TipoServidor','folhapag', 
'quadro pessoal', 'Folha Pagamento', 'Servidores', 'consultar', 'Acessar', 'Pesquisar', "/"+new Date().getFullYear(),];


const identificationKeyWordPessoal = {
    'nome': ['nome', 'Servidor'],
    'cpf': ['cpf', 'nome'],
    'cargo': ['cargo', 'CARGO/VÍNCULO'],
    'tipo_cargo': ['tipo do ato', 'secretaria', 'tipo cargo', 'tipo de cargo', 'regime', 'tipo', 'Tipo de Contratação'],
    'salario_cargo': ['salario', 'Total Vantagem*', 'sal. base', 'liquido', 'valor liquido', 'Vantagens','Vantagens (Bruto)'],
};

export {identificationKeyWordPessoal};
export {keywordSearchPessoal};
