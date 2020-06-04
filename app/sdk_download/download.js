const fs = require('fs');
const dwn = require('../download-helper');

function startDownload() {
    var download_button = document.getElementById('download-button');
    var urls;
    var downloadPath = "C:\\Android";
    const progressIndicator = document.getElementById('progress-bar');
    download_button.onclick = '';
    download_button.classList.add("disabled");
    dwn.getURLs()
        .then((fetchedURLs) => {
            urls = fetchedURLs;
            showFileNames(urls);

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
        })
        .then(() => {
            document.getElementById('sdk-loader').style.display = 'none';
            document.getElementById('sdk-done').style.visibility = 'visible';
            progressIndicator.value = 100;
            download_button.classList.remove("disabled");
            download_button.innerHTML = 'Install Components';
            download_button.setAttribute('onclick', 'sdkNextPage(1)');
        })
}

function showFileNames(urls) {
    document.getElementById('sdk-name').innerHTML += dwn.getFilenameFromUrl(urls['flutter-sdk']);
}