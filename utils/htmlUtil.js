'use strict';

import url from 'url'

export default class HtmlUtil {

    static extractHostname(url) {
        let hostname;

        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        } else {
            hostname = url.split('/')[0];
        }
        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return 'http://' + hostname;
    }

    static extractUri(urlstring) {
        let pathname = url.parse(urlstring).pathname;
        return pathname
    }


    static extractHost(urlstring) {
        const host = url.parse(urlstring).host;
        return host 
    }

    static isUrl(url) {
        const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(url);
    }
}