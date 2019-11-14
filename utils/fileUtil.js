'use strict';

import fs from 'fs';


export default class FileUtil {

    static createDirectory(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    static createMultiDirecttory(path1, path2, path3) {
        FileUtil.createDirectory('./proof');
        FileUtil.createDirectory(path1);
        FileUtil.createDirectory(path1 + path2);
        FileUtil.createDirectory(path1 + path2 + path3);
        return path1 + path2 + path3;
    }

    static deleteFile(filePath) {
        fs.unlinkSync(filePath);
    }

    static getLastMonthInExtensionName() {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const d = new Date();
        return monthNames[d.getMonth() - 1];
    }
}

