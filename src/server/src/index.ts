import fs from 'fs';
import http from 'http';
import lineReader from 'line-reader';
import path from 'path';

const buildPath = "../../build";
const dataPath = "./build/data";
const emailsStoreFile = dataPath + "/emails.csv";

initDataStore();

http
  .createServer((request, response) => {
    console.log("request starting...");

    const filePathAbs = request.url || "/";
    const filePath = filePathAbs === "/" ? "/index.html" : filePathAbs;

    const extname = path.extname(filePath);
    const map: Record<string, string> = {
      ".css": "text/css",
      ".jpg": "image/jpg",
      ".js": "text/javascript",
      ".json": "application/json",
      ".png": "image/png"
    };
    const contentType = map[extname] || "text/html";

    fs.readFile(buildPath + filePath, (error, content) => {
      // tslint:disable:no-if-statement
      if (error) {
        if (error.code === "ENOENT") {
          fs.readFile("./404.html", (err, errContent) => {
            response.writeHead(200, { "Content-Type": contentType });
            response.end(errContent, "utf-8");
          });
        } else {
          response.writeHead(500);
          response.end(
            "Sorry, check with the site admin for error: " +
              error.code +
              " ..\n"
          );
          response.end();
        }
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
      // tslint:enable:no-if-statement
    });
  })
  .listen(8125);
console.log("Server running at http://127.0.0.1:8125/");

function initDataStore(): void {
  function initCSV(): void {
    fs.writeFileSync(emailsStoreFile, "");
  }

  fs.existsSync(dataPath) || fs.mkdirSync(dataPath);
  fs.existsSync(emailsStoreFile) || initCSV();

  lineReader.eachLine(emailsStoreFile, line => {
    console.log(line);
  });
}
