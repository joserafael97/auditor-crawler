

# Auditor Crawler

Este projeto tem como objetivo avaliar e aplicar técnicas do estado da arte para Web Crawler e extração de conteúdos em páginas Web no contexto da automatização na avaliação de portais de transparência municipais do estado da Paraíba.

Em cada portal de transparência é verificado a presença ou ausência dos critérios fiscais como Despesas, Receitas, Licitações e Folha de Pagamento, utilizando com diretriz para a avaliação o [Índice de transparência Municipal](http://tce.pb.gov.br/indice-de-transparencia-publica).

A grande diversidade na forma de navegar e visualizar as informações fiscais nesses sites torna o processo de avaliação automatizada da transparência uma tarefa não trivial, exigindo técnicas robustas a mudanças de layout, as diferentes estruturas Web e ao custo de tempo e processamento.

## Pré-processamento

Para o melhor entendimento das técnicas utilizadas neste estudo, é necessário descrever os passos que precedem a varredura dos portais de transparência. Assim, a Figura abaixo apresenta esse fluxo.

![modeloBase](https://raw.githubusercontent.com/joserafael97/auditor-crawler/master/resources/modeloBase.png)

#### Data
São Coleções contendo metadados dos municípios da Paraíba, por exemplo Url do portal de transparência, prefeitura e palavras chaves de busca e identificação dos critérios. 

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
* ***Metadados dos municípios da Paraíba:*** Refere-se a informações básicas dos municípios como URL da prefeitura, portal da transparência, empresa que fornece o portal. Um exemplo de um metadado dos municípios é apresentado abaixo ([complete file](https://github.com/joserafael97/auditor-crawler/blob/master/data/municipiosPB.js)):

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


Para inserção dessas informações em uma base de dados foram criados scripts de dados. Estes podem ser encontrados no diretório [data](https://github.com/joserafael97/auditor-crawler/tree/master/data) do projeto.

TODO implementar end-point para colocar novas palavras ou atualizar existentes no banco;

#### Normalization of keywords

Na etapa de normalização das pavalavras chaves todos os termos de busca e identificação são normalizados, sendo removidos acentos, espaços em branco e convertendo todos as palavras em letras minúsculas (lowercase). Este processo tem como propósito expandir a cobertura dos termos durante as buscas nos sites. 

TODO exemplificar psedo code talvez com exemplo a normalizada com input e output

#### Creation of queries

Nesta etapa por meio dos termos chaves de busca e identificação são criadas consultas utilizando a linguagem XPath (XML Path Language) que servirão para buscar links, componentes dinâmicos e identificar os critérios fiscais nos portais de transparência. 

TODO explicar sobre a normalização dos xpaths e falar sobre a falta de suporte das novas versões do xpath 
TODO mostrar exemplo de xpath

## Breadth First Search  (BFS)

Por representar de forma similar as estruturas de links contidas nos Web sites, o Breadth First Search é um dos algoritmos mais utilizados para Web Crawler, onde a partir de um nó inicial os demais nós são acessados numa busca em largura, partindo dos nós mais próximos ao nó inicial para os mais distantes, até que todos os nós sejam pecorridos. Em resumo, quanto menor o nível do nó mais próximo ele estará do nó inicial (Raiz) e mais rápido ele será acessado. A Figura abaixo mostra um exemplo desse tipo de estrutura, os números representam a ordem que nós deverão ser acessados.

![bfs](https://raw.githubusercontent.com/joserafael97/auditor-crawler/master/resources/bfs.png)

Nesse contexto, para o estudo o BFS será o algoritmo base para percorrer as páginas/áreas em busca dos critérios fiscais nos portais de transparência. Este algoritmo fazerá parte de um Crawler que servirá como modelo base durante os experimentos. 

## Deep First Search  (DFS)

TODO

## Epsilon Greedy

TODO

## Flow 

Durante a execução do Crawler, a separação do processo de busca e identificação dos critérios nos portais fiscais garante melhores níveis de eficácia, devido a maior distinção das páginas/áreas acessadas por meio dos termos utilizados 
em cada critério, evitando problemas como a identificação de itens semelhantets em locais pertecentes a outros critérios. Além disso, a idenpendência entre os processos de avaliação dos critérios permite uma parelização entre eles, resultando num melhor aproveitamento dos recursos da disponíveis, tornando mais eficiente a execução.

De modo a exemplificar o fluxo de execução do Crawler na avaliação de cada critério 
a Figura abaixo é prosposta 

![luxo_bfs_avaliacao.png](https://raw.githubusercontent.com/joserafael97/auditor-crawler/master/resources/fluxo_bfs_avaliacao.png)

O detalhamento do das atividades do diagrama é apresentada abaixo:

* ***Start Crawler:*** Diz respeito ao processo de inicialização do Crawler mostrado na seção runing deste documento;

* ***Access Node (Access Web page):*** Esta atividade refere-se ao acesso de um novo nó no Grafo. Um nó pode ser representado por uma nova URL a ser acessada ou um novo elemento a ser clicado;

* ***Create queries:*** Após a realização da atividade anterior, são criadas consultas para buscar e identificar os itens do critério e econtrar nós filhos (urls e elementos clicáveis);

* ***Search items:*** Com as consultas criadas, os itens do critério avaliado é buscado. Nesse processo alguns validações são aplicadas, como por exemplo verificar se o item encontrado está contido está em uma tabela ou uma lista. Caso todos itens buscados forem encontrados o processo de avaliação do critério é finalizado;

* ***Search new Nodes:*** Caso todos os itens não sejam identificados, nesta atividade é procurado novos nós para serem acessados (nós filhos do nó atual) podendo ser uma URL ou um elemento HTMl clicável. Nesse sentido, caso novos nós filhos não sejam encontrados e todos os nós já tenham sido percorridos o processo de avaliação do critério é finalizado.

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

Para a execução do projeto é necessário a instalação das seguintes ferramentas 

* [Node](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com/get-npm)
* [MongoDB](https://www.mongodb.com/)

### Installing

Para instalação das bibliotecas execute o comando abaixo dentro do diretório principal do repositório.

```
npm install
```

## Running 


### Run Crawler

```
npm start county="Santa Rita" aproach="bandit"
```
Os parâmetros apresentados são descritos com mais detalhes abaixo: 

* ***County:*** deve ser informar o nome do município ao qual deseja avaliar;
* ***Aproach:*** deve ser informar a abordagem a ser utilizada durante a execução, podendo ser ***bfs***, ***dfs*** ou ***bandit***. Caso a abordagem não seja informada a opção bfs é utilizada.

### Run Rest Api

```
node_modules/.bin/babel-node api.js

```

## Authors

* **José Remígio** - *Initial work* - [José Remígio](https://github.com/joserafael97)

[***License MIT***](https://github.com/joserafael97/auditor-crawler/blob/master/LICENSE)
