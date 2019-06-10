

# Auditor Crawler

Este projeto tem como objetivo avaliar o desempenho de técnicas do estado da arte para Web Crawler e extração de conteúdos em páginas Web no contexto da automatização na avaliação de portais de transparência municipais do estado da Paraíba.

Em cada portal de transparência é verificado a presença ou ausência dos critérios fiscais Despesas, Receitas, Licitações e Folha de Pagamento, utilizando com diretriz para a avaliação o [Índice de transparência Municipal](http://tce.pb.gov.br/indice-de-transparencia-publica).

A grande diversidade na forma de navegar e visualizar as informações fiscais nesses sites torna o processo de avaliação automatizada da transparência uma tarefa não trivial, exigindo técnicas robustas a mudanças de layout, as diferentes estruturas Web e ao custo de tempo e processamento.

## Breadth First Search  (BFS)

A pesquisa propõe como modelo base um Web Crawler que utiliza um grafo em forma de BFS para acessar e buscar as páginas web dos portais de transparência para identificar os critérios de transparência. 

Para o melhor entendimento do algoritmo utilizado no modelo base, é necessário descrever todos os passsos anteriores ao início da execução do Crawler. Assim, a Figura abaixo apresenta com maior detalhe esse fluxo.

![modeloBase](https://raw.githubusercontent.com/joserafael97/auditor-crawler/master/resources/modeloBase.png)

* ***Data:*** Coleções contendo metadados dos municípios da Paraíba, por exemplo Url do portal de transparência, prefeitura, e palavras chaves de busca e identificação dos critérios; 

* ***Palavras chaves de busca :*** Refere-se a termos utilizados para identificar ***urls, e elementos HTML clicáveis***  (buttons, input, a e etc.) que darão acesso à novas páginas/áreas relevantes considerando os critérios de transparência buscados. Um exemplo de palavras de busca é a coleção apresentada abaixo, que apresenta os termos para buscar o critério Despesa Orçamentária: 
 ```
['despesas extras-orcamentarias', 'Consultar Despesas Extras-Orçamentárias','Consultar Despesas Extras','despesaextraorcamentaria.aspx','despesasextras', 'despesas', 'despesa com diarias', 'detalhamentos das despesas',  'consultar', 'pesquisar'];
```

* ***Palavras chaves de identificação :*** Refere-se a termos utilizados para identificar os itens pertecentes aos critérios buscados. Em cada nova página/área é verificada a existência dos termos chaves para cada uns dos itens. Um exemplo de termos utilizados na busca dos itens do critério Despesa Orçamentária é apresentado abaixo. 
    
```
{
    "valor": ['valor', 'empenhado(r$)'],
    "codigo": ['codigo', 'cod. despesa'],
    "nomenclatura": ['descricao', 'nome da despesa'],
};
```
* ***Metadados dos municípios da Paraíba:*** Refere-se a informações básicas dos municípios como URL da prefeitura, portal da transparência, empresa que fornece o portal. Um exemplo de um metadado dos municípios é apresentado abaixo:

```
 {
    name: 'Campina Grande',
    codSepro: '1981',
    empresas: [PUBLICSOFT, ALFA_CONSULTORIA],
    cityHallUrl: 'http://campinagrande.pb.gov.br',
    transparencyPortalUrl: 'http://transparencia.campinagrande.pb.gov.br',
    population: 0
  }
```

Para inserção dessas informações iniciais em uma base de dados foram criados scripts de dados. Estes podem ser encontrados no diretório [data](https://github.com/joserafael97/auditor-crawler/tree/master/data) do projeto.



No projeto utilizamos como abordagem base um grafo com sua varredura na forma de uma BFS. A Figura a seguir apresenta um exemplo desse tipo de estrutura.

![bfs](https://raw.githubusercontent.com/joserafael97/auditor-crawler/master/resources/bfs.png)




## Getting Started
Este projeto foi desenvolvido sobre a linguagem Javascript com a ferramenta [Puppeteer](https://github.com/GoogleChrome/puppeteer) para criação de Crawlers.

### Estructure
A estrutura de diretórios do projeto está descrita abaixo 

```bash
.
├── config                            # Arquivos de configurações do projeto, por exemplo configurações do banco de dados
├── core                              # Arquivos de configurações do ambiente
├── data                              # Arquivos contendo dados pré-definidos para gerar collections como palavras chaves
├── db                                # Arquivos de gerenciamento de conexões com o banco de dados
├── log                               # Arquivos de logs
├── models                            # Models de dados e classes auxiliares
├── proof                             # Diretório contendo printscreen com provas dos itens encontrados (criada automáticamente)
├── utils                             # Classes utilitárias com functions para auxiliar durante a execução do crawler  
├── bfs.js                            # Arquivo contendo lógica para execução de um BFS para varrer portais de transparência  
├── api.js                            # Arquivo contendo end-points para acesso das avaliações  
└── app.js                            # Aquivo principal para execução do Crawler
```

### Prerequisites

Para a execução do projeto é necessário a instalação das seguintes bibliotecas 

* [Node](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com/get-npm)

### Installing

Para instalação das bibliotecas execute o comando abaixo dentro do diretório principal do repositório.

```
npm install
```

## Running 


### Run Crawler

```
npm start county="Ouro Velho"
```

### Run Rest Api

```
node_modules/.bin/babel-node api.js

```

## Authors

* **José Remígio** - *Initial work* - [José Remígio](https://github.com/joserafael97)
