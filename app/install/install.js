const fs = require('fs');
const request = require('request');
const dwn = require('../download-helper');
const extract = require('extract-zip');

const folder = "D:\\Android";

function unzipFiles() {
    var urls;
    var jdkDirName;
    dwn.getURLs('https://raw.githubusercontent.com/sampathbalivada/flutter_installer/master/urls.json?token=AGLFFNEZK75GHLTNLMTQOR26X57GO')
        .then((fetchedURLs) => {
            urls = fetchedURLs;
            console.log('Promise 0')

            // Unzip command-line-tools
            var fileName = dwn.getFilenameFromUrl(urls['command-line-tools'])
            return extract(folder + "\\" + fileName, {
                dir: folder + "\\cmdline-tools"
            });
        })
        .then(() => {
            console.log("Promise 1");

            // Unzip JDK
            var fileName = dwn.getFilenameFromUrl(urls['jdk']);
            return extract(folder + "\\" + fileName, {
                dir: folder
            });
        })
        .then(() => {
            console.log("Promise 2");

            // Unzip Flutter SDK
            var fileName = dwn.getFilenameFromUrl(urls['flutter-sdk'])
            return extract(folder + "\\" + fileName, {
                dir: folder
            });
        })
        .then(() => {
            console.log("Promise 3");
            renameDirectories();
        })


}

function renameDirectories() {
    fs.renameSync(folder + "\\cmdline-tools\\tools", folder + "\\cmdline-tools\\latest");
    fs.readdir(folder, (err, files) => {
        files.forEach((name) => {
            if (name.substr(0, 3) == 'jdk') {
                jdkDirName = name;
                fs.renameSync(folder + "\\" + name, folder + "\\openjdk");
            }
        });
    });
}

function testZip() {
    // var zip = new AdmZip(folder + "\\" + "OpenJDK8U-jdk_x86-32_windows_hotspot_8u252b09.zip");
    // var entries = zip.getEntries();
    // console.log(entries[0].entryName);
    // entries.forEach((entry)=>{
    //     console.log(entry.entryName);
    // })
    var source = folder + "\\flutter_windows_1.17.0-stable.zip";
    extract(source, {
        dir: folder
    }).then(() => {
        console.log('extracted');
    })
}