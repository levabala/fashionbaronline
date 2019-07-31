// tslint:disable:no-if-statement
import fs from 'fs';
import http from 'http';
import lineReader, { eachLine } from 'line-reader';
import path from 'path';

const buildPath = "../../build";
const dataPath = "./build/data";
const emailsStoreFile = dataPath + "/emails.csv";

initDataStore();

interface DataType {
  email: string;
}

http
  .createServer((request, response) => {
    if (request.url === "/subscribe") {
      let body = "";

      request.on("data", data => {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) request.connection.destroy();
      });

      request.on("end", () => {
        try {
          const data: Partial<DataType> = JSON.parse(body);
          if (!data.email) throw new Error("Invalid data type");

          saveData(data as DataType);
        } catch (e) {
          response.writeHead(400);
          response.end(e);
          response.end();
        } finally {
          response.writeHead(200);
          response.end();
        }
      });

      return;
    }

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
      if (error)
        if (error.code === "ENOENT")
          fs.readFile("./404.html", (err, errContent) => {
            response.writeHead(200, { "Content-Type": contentType });
            response.end(errContent, "utf-8");
          });
        else {
          response.writeHead(500);
          response.end(
            "Sorry, check with the site admin for error: " +
              error.code +
              " ..\n"
          );
          response.end();
        }
      else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
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

  // lineReader.eachLine(emailsStoreFile, line => {
  //   console.log(line);
  // });
}

function formatData(data: DataType): string {
  return [data.email].join(",");
}

async function isUnique(data: DataType): Promise<boolean> {
  const { email } = data;

  return new Promise<boolean>(resolve => {
    lineReader.open(emailsStoreFile, (err, reader) => {
      if (err) throw err;

      if (reader.hasNextLine())
        eachLine(emailsStoreFile, (line, last, cb) => {
          const recordedEmail = line.split(",")[0];
          const unique = email !== recordedEmail;

          const doNext = cb as (val?: boolean) => void;

          if (unique) {
            doNext();
            if (last) resolve(true);
          } else {
            doNext(false);
            resolve(false);
          }

          if (last)
            reader.close(err2 => {
              if (err2) throw err2;
            });
        });
      else {
        reader.close(err2 => {
          if (err2) throw err2;
        });
        resolve(true);
      }
    });
  });
}

async function saveData(data: DataType): Promise<void> {
  const unique = await isUnique(data);
  if (unique) writeData(data);
  else console.log("this email is already registered:", data.email);
}

function writeData(data: DataType): void {
  fs.appendFile(emailsStoreFile, `${formatData(data)}\n`, err => {
    if (err) console.warn("Error writing data");
    else console.log(`${data.email} user is written down`);
  });
}
