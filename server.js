var http = require('http');
var fs = require('fs');
var formidable = require('formidable');

var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(__dirname + '/'));
function error404() {
    response.writeHead(404);
    respone.write('Not found.');
}
var musicfiles = fs.readdirSync("music/");
var textfiles = fs.readdirSync("text/");
fs.writeFileSync("text/musicdir", "");
var POSTs = ["uploadmusic.request"];
var directory = ["index.html", "style.css", "script.js", "perfect_dos_vga_437-webfont.woff"];
for (let i = 0; i < musicfiles.length; i++) {
    directory.push("music/" + musicfiles[i]);
    fs.appendFileSync("text/musicdir", musicfiles[i] +
        "\r\n");
}
for (let i = 0; i < textfiles.length; i++) {
    directory.push("text/" + textfiles[i]);
}
for(let i = 0; i < POSTs.length; i++){ directory.push(POSTs[i])}
console.log(directory);


http.createServer(function (request, response) {
    let req;
    
    console.log(request.url);
    if (request.url == "/") {
        req = "\index.html";
    } else {
        req = request.url;
        req = req.replace("/", "");
    }
    if (req.endsWith(".css")) {
        response.writeHead(200, {
            'Content-Type': 'text/css'
        });
    }
    if (req.endsWith(".mp3")) {
        response.writeHead(200, {
            'Content-Type': 'audio/mp3'
        })
    }
    if (req.endsWith(".html")) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
    }
    if (directory.indexOf(req) == -1) {
        req = "\error.html"
    }

    console.log(req);
    if (request.url.endsWith(".request") == false) {
        fs.readFile(req, null, function (error, data) {
            if (error) {
                error404();
            } else {
                response.write(data);
            }
            response.end();
        });
    } else {
        try {
            console.log(request);
            var form = new formidable.IncomingForm();
            form.parse(request, function (err, fields, files) {
                var oldpath = files.filetoupload.path;
                var newpath = 'music/' + files.filetoupload.name;
                console.log(oldpath);
                console.log("bruh");
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    response.write('File uploaded and moved!');
                    response.end();
                });
            });
        }
        catch {
            response.end();
        }

    }
}).listen(1337);