const fs = require('fs');
const dwn = require('../download-helper');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const extract = require('extract-zip');

const folder = "D:\\Android";

// Set this constant to `true` while debugging
// Should always be `false` while building a release
const debug = true;

function installComponents() {
    var urls;
    var jdkDirName;
    dwn.getURLs('https://raw.githubusercontent.com/sampathbalivada/flutter_installer/master/urls.json?token=AGLFFNEZK75GHLTNLMTQOR26X57GO')
        .then((fetchedURLs) => {
            urls = fetchedURLs;

            // Show loaders
            document.getElementById('cmd-loader').style.visibility = 'visible';


            // Unzip command-line-tools
            if (debug) {
                return;
            }
            var fileName = dwn.getFilenameFromUrl(urls['command-line-tools'])
            return extract(folder + "\\" + fileName, {
                dir: folder + "\\cmdline-tools"
            });

        })
        .then(() => {
            // Reflect progress and modify loaders for current state
            document.getElementById('progress-bar').value = 20;
            document.getElementById('cmd-loader').style.display = 'none';
            document.getElementById('cmd-done').style.visibility = 'visible';
            document.getElementById('jdk-loader').style.visibility = 'visible';

            // Unzip JDK
            if (debug) {
                return;
            }
            var fileName = dwn.getFilenameFromUrl(urls['jdk']);
            return extract(folder + "\\" + fileName, {
                dir: folder
            });

        })
        .then(() => {
            // Reflect progress and modify loaders for current state
            document.getElementById('progress-bar').value = 40;
            document.getElementById('jdk-loader').style.display = 'none';
            document.getElementById('jdk-done').style.visibility = 'visible';
            document.getElementById('sdk-loader').style.visibility = 'visible';

            // Unzip Flutter SDK
            if (debug) {
                return;
            }
            var fileName = dwn.getFilenameFromUrl(urls['flutter-sdk'])
            return extract(folder + "\\" + fileName, {
                dir: folder
            });

        })
        .then(() => {
            // Reflect progress and modify loaders for current state
            document.getElementById('progress-bar').value = 75;
            document.getElementById('sdk-loader').style.display = 'none';
            document.getElementById('sdk-done').style.visibility = 'visible';
            document.getElementById('path-loader').style.visibility = 'visible';

            renameDirectories();
        })


}

function renameDirectories() {
    if (debug) {
        document.getElementById('progress-bar').value = 80;
        addComponentsToPath();
    } else {
        fs.renameSync(folder + "\\cmdline-tools\\tools", folder + "\\cmdline-tools\\latest");
        fs.readdir(folder, (err, files) => {
            files.forEach((name) => {
                if (name.substr(0, 3) == 'jdk') {
                    jdkDirName = name;
                    fs.renameSync(folder + "\\" + name, folder + "\\openjdk");
                    document.getElementById('progress-bar').value = 80;
                    addComponentsToPath();
                }
            });
        });
    }
}

function addComponentsToPath() {
    if (debug) {
        document.getElementById('progress-bar').value = 100;
        document.getElementById('path-loader').style.display = 'none';
        document.getElementById('path-done').style.visibility = 'visible';
        enableFinish();
        return
    } else {
        exec('setx ANDROID_HOME "C:\\Android\\')
            .then((stdout, stderr) => {
                if (stderr) {
                    console.log("Error Encountered");
                    console.log(stderr.toString());
                }
                document.getElementById('progress-bar').value = 85;
                return exec('setx JAVA_HOME "C:\\Android\\openjdk\\');
            })
            .then((stdout, stderr) => {
                if (stderr) {
                    console.log("Error Encountered");
                    console.log(stderr.toString());
                }
                document.getElementById('progress-bar').value = 90;
                return exec('setx path "%path%;"C:\\Android\\;C:\\Android\\cmdline-tools\\latest\\bin;C:\\Android\\flutter\\bin" ');
            })
            .then((stdout, stderr) => {
                if (stderr) {
                    console.log("Error Encountered");
                    console.log(stderr.toString());
                }
                document.getElementById('path-loader').style.display = 'none';
                document.getElementById('path-done').style.visibility = 'visible';
                document.getElementById('progress-bar').value = 100;
            })
    }
}

function enableFinish(params) {
    document.getElementById('finish-button').classList.remove('disabled');
}

// Comment this line while debugging. 
document.onload = installComponents();