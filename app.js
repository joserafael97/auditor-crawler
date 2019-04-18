'use strict';
import connectToDb from './db/connect'
import XpathUtil from './utils/xpathUtil'
import {CONTAINSTYPESEARCH} from './utils/xpathUtil'

connectToDb();


XpathUtil.createIdentificationKeyWordXpath('Despesa Extra Orçamentária').then(function (result) {
    console.log(result);
});