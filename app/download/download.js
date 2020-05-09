const request = require('request');
const fs = require('fs');

function downloadFile(configuration) {
    return new Promise(function (resolve, reject) {
        // Save variable to know progress
        var received_bytes = 0;
        var total_bytes = 0;

        var req = request({
            method: 'GET',
            uri: configuration.remoteFile
        });

        var out = fs.createWriteStream(configuration.localFile);
        req.pipe(out);

        req.on('response', function (data) {
            // Change the total bytes value to get progress later.
            total_bytes = parseInt(data.headers['content-length']);
        });

        // Get progress if callback exists
        if (configuration.hasOwnProperty("onProgress")) {
            req.on('data', function (chunk) {
                // Update the received bytes
                received_bytes += chunk.length;

                configuration.onProgress(received_bytes, total_bytes);
            });
        } else {
            req.on('data', function (chunk) {
                // Update the received bytes
                received_bytes += chunk.length;
            });
        }

        req.on('end', function () {
            resolve();
        });
    });
}

function getURLs(remoteURL) {
    return new Promise(function (resolve, reject) {
        var req = request.get(remoteURL, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    })
}

function getFilenameFromUrl(url) {
    return url.substring(url.lastIndexOf('/') + 1);
}

// Use this function to test file downloads
// Will be removed when stable
function downloadTest(fileURL) {
    var filename = getFilenameFromUrl(fileURL);
    var downloadsFolder = "D:\\Downloads";

    var finalPath = downloadsFolder + "\\" + filename;

    downloadFile({
        remoteFile: fileURL,
        localFile: finalPath,
        onProgress: function (received, total) {
            var percentage = (received * 100) / total;
            console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
        }
    }).then(function () {
        alert("File succesfully downloaded");
    });
}

function startDownload() {
    var download_button = document.getElementById('download-button');
    var urls;
    var downloadPath = "C:\\Android";
    const progressIndicator = document.getElementById('progress-bar');
    download_button.onclick = '';
    download_button.classList.add("disabled");
    getURLs('https://raw.githubusercontent.com/sampathbalivada/flutter_installer/master/urls.json?token=AGLFFNEZK75GHLTNLMTQOR26X57GO')
        .then((fetchedURLs) => {
            urls = fetchedURLs;

            // Downloading Android command-line tools
            document.getElementById('cmd-loader').style.visibility = 'visible';
            var finalPath = downloadPath + "\\" + getFilenameFromUrl(urls['command-line-tools']);
            if (fs.existsSync(finalPath)) {
                return
            }
            return downloadFile({
                remoteFile: urls['command-line-tools'],
                localFile: finalPath,
                onProgress: function (received, total) {
                    var percentage = (received * 100) / total;
                    progressIndicator.value = percentage;
                }
            })
        })
        .then(() => {
            document.getElementById('cmd-loader').style.display = 'none';
            document.getElementById('cmd-done').style.visibility = 'visible';

            //Downloading JDK8
            document.getElementById('jdk-loader').style.visibility = 'visible';
            var finalPath = downloadPath + "\\" + getFilenameFromUrl(urls['jdk']);
            if (fs.existsSync(finalPath)) {
                return
            }
            return downloadFile({
                remoteFile: urls['jdk'],
                localFile: finalPath,
                onProgress: function (received, total) {
                    var percentage = (received * 100) / total;
                    progressIndicator.value = percentage;
                }
            })
        })
        .then(() => {
            document.getElementById('jdk-loader').style.display = 'none';
            document.getElementById('jdk-done').style.visibility = 'visible';

            //Downloading Flutter SDK
            document.getElementById('sdk-loader').style.visibility = 'visible';
            var finalPath = downloadPath + "\\" + getFilenameFromUrl(urls['flutter-sdk']);
            if (fs.existsSync(finalPath)) {
                return
            }
            return downloadFile({
                remoteFile: urls['flutter-sdk'],
                localFile: finalPath,
                onProgress: function (received, total) {
                    var percentage = (received * 100) / total;
                    progressIndicator.value = percentage;
                }
            })
        }).then(() => {
            document.getElementById('sdk-loader').style.display = 'none';
            document.getElementById('sdk-done').style.visibility = 'visible';
            progressIndicator.value = 100;
            download_button.classList.remove("disabled");
            download_button.innerHTML = 'Install Components';
            download_button.setAttribute('onclick', 'nextPage(1)');
        })
}