import fs from 'fs';
import http from 'http';
import lineReader, { eachLine } from 'line-reader';
import path from 'path';
import url from 'url';

// tslint:disable:no-if-statement
const buildPath = "../../build";
const bagsPath = "../../public/data/bags.json";
const dataPath = "./build/data";
const emailsStoreFile = dataPath + "/emails.csv";

initDataStore();

interface DataType {
  email: string;
  date: string;
  location: { country: string; city: string };
}

function shuffleArray(array: any[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

http
  .createServer((request, response) => {
    const { pathname: requestPath, query } = url.parse(
      request.url as string,
      true
    );

    switch (requestPath) {
      case "/bags":
        const { count } = query;

        if (
          !count &&
          typeof count === "string" &&
          typeof parseInt(count, 10) === "number"
        ) {
          response.writeHead(400);
          response.end();
          return;
        }

        fs.readFile(bagsPath, (error, content) => {
          if (!error) {
            const bags: Array<
              [string, { name: string; image: string }]
            > = Object.entries(JSON.parse(content.toString()));
            shuffleArray(bags);

            const countToTake = Math.min(
              bags.length,
              parseInt(count as string, 10)
            );
            const bagsToTake = bags
              .slice(0, countToTake)
              .map(([key, val]) => val);
            const json = JSON.stringify(bagsToTake);

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(json, "utf-8");
            return;
          }
        });
        break;
      case "/subscribe":
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
            if (
              !data.email ||
              !data.date ||
              !data.location ||
              !data.location.city ||
              !data.location.country
            )
              throw new Error("Invalid data type");

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

        break;
      default:
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
            if (error.code === "ENOENT") {
              console.warn("no such file error");
              fs.readFile("./404.html", (err, errContent) => {
                response.writeHead(200, { "Content-Type": contentType });
                response.end(errContent, "utf-8");
              });
            } else {
              console.warn("file read error");
              response.writeHead(500);
              response.end(
                "Sorry, check with the site admin for error: " +
                  error.code +
                  " ..\n"
              );
              response.end();
            }
          else {
            console.warn("file read success");
            response.writeHead(200, { "Content-Type": contentType });
            response.end(content, "utf-8");
          }
        });
        break;
    }
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
  return [
    data.email,
    data.date,
    `${data.location.country} ${data.location.city}`
  ].join(",");
}

async function isUnique(data: DataType): Promise<boolean> {
  const { email } = data;

  return new Promise<boolean>(resolve => {
    lineReader.open(emailsStoreFile, (err, reader) => {
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

          if (last) reader.close(_ => null);
        });
      else {
        reader.close(_ => null);
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
