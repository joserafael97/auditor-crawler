'use strict';

import {
    counties,
} from '../data/municipiosPB'
import County from '../models/county.model'

export default class CreateCountyMetaData {

    static async createColletionsCounty() {
        for (const county of counties) {
            let countyInstance = County({
                name: county.name,
                codSepro: county.codSepro,
                cityHallUrl: county.cityHallUrl,
                transparencyPortalUrl: county.transparencyPortalUrl,
                population: county.population,
                empresas: county.empresas,
            });
            County.addCounty(countyInstance);
        }
    }
}