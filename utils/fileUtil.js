'use strict';

import fs from 'fs';


export default class FileUtil {

    static createDirectory(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
}

