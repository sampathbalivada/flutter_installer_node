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
            document.getElementById('sdk-loader').style.visibility = 'visible';


            // Unzip Flutter SDK
            if (debug) {
                return;
            }
            var fileName = dwn.getFilenameFromUrl(urls['flutter-sdk'])
            if (fs.existsSync(folder + "\\flutter")) {
                return
            } else {
                return extract(folder + "\\" + fileName, {
                    dir: folder
                });
            }
        })
        .then(() => {
            // Reflect progress and modify loaders for current state
            document.getElementById('progress-bar').value = 90;
            document.getElementById('sdk-loader').style.display = 'none';
            document.getElementById('sdk-done').style.visibility = 'visible';
            document.getElementById('path-loader').style.visibility = 'visible';

            addComponentsToPath();
        })


}

function addComponentsToPath() {
    if (debug) {
        document.getElementById('progress-bar').value = 100;
        document.getElementById('path-loader').style.display = 'none';
        document.getElementById('path-done').style.visibility = 'visible';

        enableNext();
        return
    } else {
        exec('setx path "%path%;"C:\\Android\\flutter\\bin"')
            .then((stdout, stderr) => {
                if (stderr) {
                    console.log("Error Encountered");
                    console.log(stderr.toString());
                }
                document.getElementById('path-loader').style.display = 'none';
                document.getElementById('path-done').style.visibility = 'visible';
                document.getElementById('progress-bar').value = 100;

                enableNext();
            })
    }
}

function enableNext(params) {
    document.getElementById('next-button').classList.remove('disabled');
}

// Comment this line while debugging. 
document.onload = installComponents();