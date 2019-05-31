

# Auditor Crawler
Este projeto tem como objetivo avaliar o desempenho de técnicas do estado da arte para Web Crawler e extração de conteúdos em páginas Web no contexto da automatização da avaliação de portais de transparência no estado da Paraíba.

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

Para instalação das bibliotecas execute o comando abaixo dentro da diretório principal do repositório.

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
