'use strict';

const PUBLICSOFT = 'publicsoft'
const ELMAR = 'elmar'
const E_TICONS = 'e_ticons'
const PORTAL_JOAO_PESSOA = 'portal_joao_pessoa'
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
    }
];

export {counties};
