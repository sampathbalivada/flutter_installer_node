const fs = require('fs');
const dwn = require('../download-helper');

function startDownload() {
    var download_button = document.getElementById('download-button');
    var urls;
    var downloadPath = "C:\\Android";
    const progressIndicator = document.getElementById('progress-bar');
    download_button.onclick = '';
    download_button.classList.add("disabled");
    dwn.getURLs('https://raw.githubusercontent.com/sampathbalivada/flutter_installer/master/urls.json?token=AGLFFNEZK75GHLTNLMTQOR26X57GO')
        .then((fetchedURLs) => {
            urls = fetchedURLs;

            // Downloading Android command-line tools
            document.getElementById('cmd-loader').style.visibility = 'visible';
            var finalPath = downloadPath + "\\" + dwn.getFilenameFromUrl(urls['command-line-tools']);
            if (fs.existsSync(finalPath)) {
                return
            }
            return dwn.downloadFile({
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
            var finalPath = downloadPath + "\\" + dwn.getFilenameFromUrl(urls['jdk']);
            if (fs.existsSync(finalPath)) {
                return
            }
            return dwn.downloadFile({
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
            var finalPath = downloadPath + "\\" + dwn.getFilenameFromUrl(urls['flutter-sdk']);
            if (fs.existsSync(finalPath)) {
                return
            }
            return dwn.downloadFile({
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