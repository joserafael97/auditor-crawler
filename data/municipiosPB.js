'use strict';

const PUBLICSOFT = 'publicsoft'
const ELMAR = 'elmar'
const E_TICONS = 'e_ticons'
const NEW_SITES = 'new_sites'
const INFO_PUBLIC = 'info_public'
const PADRAO = 'padrao'
const EASYWEB = 'easyweb'
const ALFA_CONSULTORIA = 'alfa_consultoria'
const GRUPO_ASSESI = 'grupo_assesi'
const INFORMACAO_PUBLICA = 'informacao_publica'
const LH_SYSTEM = 'lh_system'
const FRAN_INFORMATICA = 'fran_informatica'
const FIORILLI = 'fiorilli';
const PORTAL_PROPRIO = 'portal_proprio'
const DC_SOLUCOES = 'dc_solucoes'

const counties = [
    {
        name: 'Ouro Velho',
        codSepro: '2113',
        empresas: [PUBLICSOFT],
        cityHallUrl: 'http://ourovelho.pb.gov.br',
        transparencyPortalUrl: 'http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=O5w=&uf=PB',
        population: 0
    },
    {
        name: 'Campina Grande',
        codSepro: '1981',
        empresas: [PUBLICSOFT, ALFA_CONSULTORIA],
        cityHallUrl: 'http://campinagrande.pb.gov.br',
        transparencyPortalUrl: 'http://transparencia.campinagrande.pb.gov.br',
        population: 0
    },
    {
        name: 'Arara',
        codSepro: '1917',
        empresas: [ELMAR],
        cityHallUrl: 'http://www.arara.pb.gov.br',
        transparencyPortalUrl: 'http://transparencia.elmar.inf.br/?e=201012',
        population: 0
    },
    {
        name: 'Santa Rita',
        codSepro: '2175',
        empresas: [E_TICONS],
        cityHallUrl: 'https://www.santarita.pb.gov.br',
        transparencyPortalUrl: 'http://siteseticons.com.br/portal/ws/empresa/MDkxNTk2NjYwMDAxNjE=',
        population: 0
    },
    {
        name: 'Esperança',
        codSepro: '2021',
        empresas: [INFO_PUBLIC],
        cityHallUrl: 'http://www.esperanca.pb.gov.br',
        transparencyPortalUrl: 'http://www.transparenciaativa.com.br/Principal.aspx?Entidade=175',
        population: 0
    },

    {
        name: 'João Pessoa',
        codSepro: '2051',
        empresas: [PORTAL_PROPRIO],
        cityHallUrl:'http://www.joaopessoa.pb.gov.br',
        transparencyPortalUrl: 'https://transparencia.joaopessoa.pb.gov.br',
        population: 0
    },

    {
        name: 'Areia de Baraúnas',
        codSepro: '0448',
        empresas: [PUBLICSOFT, EASYWEB, E_TICONS],
        cityHallUrl:'http://areiadebaraunas.pb.gov.br',
        transparencyPortalUrl: 'http://areiadebaraunas.pb.gov.br/assuntos/portal-da-transparencia',
        population: 0
    }, 

    {
        name: 'Curral de Cima',
        codSepro: '0476',
        empresas: [ALFA_CONSULTORIA, ELMAR],
        cityHallUrl:'http://www.curraldecima.pb.gov.br',
        transparencyPortalUrl: 'http://transparencia.curraldecima.pb.gov.br',
        population: 0
    },
    {
        name: 'Itabaiana',
        codSepro: '2039',
        empresas: [PORTAL_PROPRIO, ELMAR],
        cityHallUrl:'http://itabaiana.pb.gov.br/site/',
        transparencyPortalUrl: 'http://transparencia.itabaiana.pb.gov.br',
        population: 0
    },

    {
        name: 'Bom Sucesso',
        codSepro: '1947',
        empresas: [DC_SOLUCOES],
        cityHallUrl:'http://bomsucesso.pb.gov.br',
        transparencyPortalUrl: 'http://bomsucesso.pb.gov.br/portal-da-transparencia',
        population: 0
    },

    {
        name: 'Pedra Lavrada',
        codSepro: '2039',
        empresas: [LH_SYSTEM, ELMAR],
        cityHallUrl:'http://pedralavrada.pb.gov.br',
        transparencyPortalUrl: 'http://portaldatransparencia.lhsystem.com.br/PMPL',
        population: 0
    },

    {
        name: 'Gado Bravo',
        codSepro: '0480',
        empresas: [FRAN_INFORMATICA, PUBLICSOFT],
        cityHallUrl:'http://www.gadobravo.pb.gov.br',
        transparencyPortalUrl: 'http://www.gadobravo.pb.gov.br/transparencia',
        population: 0
    },

    {
        name: 'Belém do Brejo do Cruz',
        codSepro: '1941',
        empresas: [PUBLICSOFT],
        cityHallUrl: 'https://www.belemdobrejodocruz.pb.gov.br',
        transparencyPortalUrl: 'http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/views/views_control/index.php?cidade=Ow==&uf=PB',
        population: 0
    },

    {
        name: 'Bom Jesus',
        codSepro: '1945',
        empresas: [ELMAR],
        cityHallUrl: 'https://www.prefeiturabomjesus.pb.gov.br',
        transparencyPortalUrl: 'http://transparencia.elmar.inf.br/?e=201031',
        population: 0
    },

    {
        name: 'Bayeux',
        codSepro: '1937',
        empresas: [E_TICONS],
        cityHallUrl: 'https://www.bayeux.pb.gov.br',
        transparencyPortalUrl: 'http://siteseticons.com.br/portal/ws/empresa/MDg5MjQ1ODEwMDAxNjA=',
        population: 0
    },

    {
        name: 'Umbuzeiro',
        codSepro: '2205',
        empresas: [INFO_PUBLIC],
        cityHallUrl: 'https://www.umbuzeiro.pb.gov.br',
        transparencyPortalUrl: 'http://transparenciaativa.com.br/?Entidade=189',
        population: 0
    },
    {
        name: 'Serraria',
        codSepro: '2219',
        empresas: [ALFA_CONSULTORIA, ELMAR],
        cityHallUrl: 'http://www.serraria.pb.gov.br',
        transparencyPortalUrl: 'http://transparencia.serraria.pb.gov.br',
        population: 0
    },
    {
        name: 'Areia',
        codSepro: '1921',
        empresas: [ALFA_CONSULTORIA, PUBLICSOFT],
        cityHallUrl: 'https://areia.pb.gov.br',
        transparencyPortalUrl: 'http://transparencia.areia.pb.gov.br',
        population: 0
    },
    {
        name: 'Cruz do Espírito Santo',
        codSepro: '1999',
        empresas: [PUBLICSOFT],
        cityHallUrl: 'https://cruzdoespiritosanto.pb.gov.br',
        transparencyPortalUrl: 'http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/accessdirect.php?link=MLN0',
        population: 0
    },
    {
        name: 'Pocinhos',
        codSepro: '2141',
        empresas: [PUBLICSOFT],
        cityHallUrl: 'http://www.pocinhos.pb.gov.br',
        transparencyPortalUrl: 'http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/accessdirect.php?link=O5g%3D',
        population: 0
    },
    {
        name: 'Santa Cecília',
        codSepro: '0510',
        empresas: [PUBLICSOFT],
        cityHallUrl: 'http://www.santacecilia.pb.gov.br',
        transparencyPortalUrl: 'http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/accessdirect.php?link=ML00',
        population: 0
    },
    {
        name: 'Alcantil',
        codSepro: '0440',
        empresas: [PUBLICSOFT],
        cityHallUrl: 'http://alcantil.pb.gov.br',
        transparencyPortalUrl: 'http://portaldatransparencia.publicsoft.com.br/sistemas/ContabilidadePublica/accessdirect.php?link=MLvr',
        population: 0
    },
    {
        name: 'Carrapateira',
        codSepro: '1983',
        empresas: [ELMAR],
        cityHallUrl: 'http://carrapateira.pb.gov.br',
        transparencyPortalUrl: 'http://transparencia.elmar.inf.br/?e=201054',
        population: 0
    },
    {
        name: 'Ingá',
        codSepro: '2037',
        empresas: [PORTAL_PROPRIO, PUBLICSOFT],
        cityHallUrl: 'https://inga.pb.gov.br',
        transparencyPortalUrl: 'https://inga.pb.gov.br/portal-da-transparencia',
        population: 0
    },
    {
        name: 'Puxinanã',
        codSepro: '2149',
        empresas: [PORTAL_PROPRIO, PUBLICSOFT],
        cityHallUrl: 'https://www.puxinana.pb.gov.br',
        transparencyPortalUrl: 'https://www.puxinana.pb.gov.br/portal/transparencia-fiscal',
        population: 0
    },
    {
        name: 'Quixaba',
        codSepro: '2153',
        empresas: [EASYWEB, PUBLICSOFT],
        cityHallUrl: 'http://quixaba.pb.gov.br',
        transparencyPortalUrl: 'http://quixaba.pb.gov.br/assuntos/portal-da-transparencia',
        population: 0
    },
    {
        name: 'Serra Grande',
        codSepro: '2215',
        empresas: [EASYWEB, PUBLICSOFT],
        cityHallUrl: 'http://serragrande.pb.gov.br',
        transparencyPortalUrl: 'http://serragrande.pb.gov.br/assuntos/portal-da-transparencia',
        population: 0
    },
    {
        name: 'Barra de Santa Rosa',
        codSepro: '1933',
        empresas: [PORTAL_PROPRIO, ELMAR],
        cityHallUrl: 'http://www.barradesantarosa.pb.gov.br',
        transparencyPortalUrl: 'https://www.barradesantarosa.pb.gov.br/portal/transparencia-fiscal',
        population: 0
    },
    {
        name: 'Conceição',
        codSepro: '1989',
        empresas: [EASYWEB, E_TICONS],
        cityHallUrl: 'http://conceicao.pb.gov.br',
        transparencyPortalUrl: 'http://conceicao.pb.gov.br/assuntos/portal-da-transparencia',
        population: 0
    },
    {
        name: 'Mogeiro',
        codSepro: '2089',
        empresas: [ALFA_CONSULTORIA, E_TICONS],
        cityHallUrl: 'http://mogeiro.pb.gov.br',
        transparencyPortalUrl: 'http://mogeiro.pb.gov.br/transparencia',
        population: 0
    },
    {
        name: 'Mulungu',
        codSepro: '2097',
        empresas: [PORTAL_PROPRIO, E_TICONS],
        cityHallUrl: 'http://mulungu.pb.gov.br',
        transparencyPortalUrl: 'http://mulungu.pb.gov.br/transparencia/prefeitura.html',
        population: 0
    },
    {
        name: 'Sossêgo',
        codSepro: '0536',
        empresas: [PORTAL_PROPRIO, INFO_PUBLIC],
        cityHallUrl: 'http://www.sossego.pb.gov.br',
        transparencyPortalUrl: 'https://www.sossego.pb.gov.br/portal/transparencia-fiscal',
        population: 0
    },
    {
        name: 'Serra da Raiz',
        codSepro: '2213',
        empresas: [ALFA_CONSULTORIA, INFO_PUBLIC],
        cityHallUrl: 'http://www.serradaraiz.pb.gov.br/',
        transparencyPortalUrl: 'http://transparencia.serradaraiz.pb.gov.br',
        population: 0
    },
    {
        name: 'Areia de Baraúnas',
        codSepro: '0448',
        empresas: [EASYWEB, PUBLICSOFT, E_TICONS],
        cityHallUrl: 'http://areiadebaraunas.pb.gov.br',
        transparencyPortalUrl: 'http://areiadebaraunas.pb.gov.br/assuntos/portal-da-transparencia',
        population: 0
    },
    {
        name: 'Cabedelo',
        codSepro: '1965',
        empresas: [PORTAL_PROPRIO, PUBLICSOFT, ELMAR],
        cityHallUrl: 'http://cabedelo.pb.gov.br',
        transparencyPortalUrl: 'http://cabedelo.pb.gov.br/portal-da-transparencia',
        population: 0
    },
];

export {counties};
