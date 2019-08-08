const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const reader = require("read-console");
const notifier = require('node-notifier');

let console_read_instance_count = 0;

function readConsole() {
	if (console_read_instance_count == 0) {
		console_read_instance_count++;
		reader.read("Link do Video: ", (url) => {
			if (ytdl.validateURL(url)) {
				const video = ytdl(url, { format: 'mp4' });

				const videoID = ytdl.getVideoID(url);

				ytdl.getInfo(videoID, (err, info) => {
					console.log('title:', info.title);
					console.log('uploaded by:', info.author.name);

					const title = info.title;
					const author = info.author.name;
					const filename = title.replace(/[^a-zA-Z ]/g, "") + '.mp4';

					var writeStream = fs.createWriteStream(filename);

					// start download
					video.pipe(writeStream);

					writeStream.on('open', () => {
						console.log("Download Iniciado");
						notify('Download Iniciado!');
					});

					writeStream.on('close', () => {
						console.log("Download Concluido");

						notify(`Download do video concluido:\n${filename}`);

						console_read_instance_count--;
						readConsole();
					});
				});

			} else {
				console.log("Link invalido");
				console_read_instance_count--;
				readConsole();
			}
		});
	}
}

function notify(msg) {
	notifier.notify({
		title: 'Youtube Downloader',
		message: msg,
		icon: path.join(__dirname, './images/youtube_icon.png')
	});
}

readConsole();
