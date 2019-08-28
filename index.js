/*---------------------------------------------------------------------------------------------
 *  Copyright (c) kkChan(694643393@qq.com). All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict'

const fs = require('fs');
const path = require('path');

require('node-type-extensions');

const $ = {
    //搜索文件
    getFiles: (dir, search, searchAllDirs) => {
        let files = [];

        if (typeof search === 'boolean') {
            searchAllDirs = search;
            search = undefined;
        }

        fs.readdirSync(dir).forEach(function (item, index) {
            let targetPath = path.join(dir, item);
            let stat = fs.statSync(targetPath);

            if (searchAllDirs && stat.isDirectory()) {
                files.addRange($.getFiles(targetPath));
            } else if (stat.isFile() && (!search || search.test(item))) {
                files.push(targetPath);
            }
        });

        return files;
    },
    //循环创建目录
    mkdir: (dir) => {
        return new Promise((resolve, reject) => {
            fs.exists(dir, function (exists) {
                if (exists) {
                    resolve(true);
                } else {
                    $.mkdir(path.dirname(dir)).then(() => {
                        fs.mkdir(dir, err => {
                            resolve(!err);
                        });
                    });
                }
            });
        });
    },
    //写入文件, 文件不存在则创建新文件
    writeFile: (filename, content) => {
        return new Promise((resolve, reject) => {
            $.mkdir(path.dirname(filename)).then((result) => {
                if (result) {
                    fs.writeFile(filename, content, err => {
                        resolve(!err);
                    });
                }
            });
        });
    }
};

module.exports = $;