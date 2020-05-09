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

function downloadTest(fileURL) {
    // var fileURL = fileURL;
    var filename = getFilenameFromUrl(fileURL);
    var downloadsFolder = "D:\\Downloads";

    function getFilenameFromUrl(url) {
        return url.substring(url.lastIndexOf('/') + 1);
    }

    var finalPath = downloadsFolder + "\\" + filename;

    downloadFile({
        remoteFile: fileURL,
        localFile: finalPath,
        onProgress: function (received,total){
            var percentage = (received * 100) / total;
            console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
        }
    }).then(function(){
        alert("File succesfully downloaded");
    });
}

function startDownload() {
    var download_button = document.getElementById('download-button');
    var items = ["command-line-tools", "jdk", "flutter-sdk"];
    download_button.onclick = '';
    download_button.classList.add("disabled");

    
}