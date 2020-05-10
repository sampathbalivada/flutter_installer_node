const fs = require('fs');
const dwn = require('../download-helper');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const extract = require('extract-zip');

const folder = "C:\\Android";

// Set this constant to `true` while debugging
// Should always be `false` while building a release
const debug = false;

function installComponents() {
    var urls;
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
            if (fs.existsSync(folder + "\\cmdline-tools\\latest")) {
                return
            }
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
            if (fs.existsSync(folder + "\\openjdk")) {
                return
            }
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
            if (fs.existsSync(folder + "\\flutter")) {
                return
            }
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
        if (!fs.existsSync(folder + "\\cmdline-tools\\latest")) {
            fs.renameSync(folder + "\\cmdline-tools\\tools", folder + "\\cmdline-tools\\latest");
        }
        if (!fs.existsSync(folder + "\\openjdk")) {
            //find JDK folder in the directory and rename
            fs.readdir(folder, (err, files) => {
                files.forEach((name) => {
                    if (name.substr(0, 3) == 'jdk') {
                        jdkDirName = name;
                        fs.renameSync(folder + "\\" + name, folder + "\\openjdk");
                    }
                });
            });
        }
        document.getElementById('progress-bar').value = 80;
        addComponentsToPath();
    }
}

function addComponentsToPath() {
    if (debug) {
        document.getElementById('progress-bar').value = 100;
        document.getElementById('path-loader').style.display = 'none';
        document.getElementById('path-done').style.visibility = 'visible';
        document.getElementById('tools-loader').style.visibility = 'visible';

        installSDKComponents();
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
                document.getElementById('tools-loader').style.visibility = 'visible';
                document.getElementById('progress-bar').value = 95;

                installSDKComponents();
            })
    }
}

function installSDKComponents() {
    if (debug) {
        document.getElementById('progress-bar').value = 100;
        document.getElementById('tools-loader').style.display = 'none';
        document.getElementById('tools-done').style.visibility = 'visible';
        enableNext();
        return
    } else {
        exec('sdkmanager "platform-tools" "platforms;android-28" "build-tools;28.0.3"')
            .then(() => {
                document.getElementById('tools-loader').style.display = 'none';
                document.getElementById('tools-done').style.visibility = 'visible';
                enableNext();
            })
    }
}

function enableNext(params) {
    document.getElementById('next-button').classList.remove('disabled');
}

// Comment this line while debugging. 
document.onload = installComponents();