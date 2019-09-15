import fs from 'fs';
import http from 'http';
import { sha256 } from 'js-sha256';
import lineReader, { eachLine } from 'line-reader';
import path from 'path';
import url from 'url';
import { v4 } from 'uuid';

const { password } = require("../password.json");
console.log({ password });

// tslint:disable:no-if-statement no-object-mutation no-array-mutation

const buildPath = "../../build";
const bagsFolderPath = "../../public/data/bags";
const brendPhotoPrefix = "Depositphotos_";
const dataPath = "./build/data";
const bagsClientPath = "data/bags";
const emailsStoreFile = dataPath + "/emails.csv";

const PORT = 3000;

const foldersToCreate = ["./build", "./build/data"];

const bagsMapJSON = loadBrendsData(bagsFolderPath);

initDataStore();

interface DataType {
  email: string;
  date: string;
  location: { country: string; city: string };
  choosenBag?: { name: string; image: string };
  id: string;
}

function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const authenticationTokens: string[] = [];

http
  .createServer((request, response) => {
    const { pathname: requestPath, query } = url.parse(
      request.url as string,
      true
    );

    switch (requestPath) {
      case "/auth": {
        const token = v4();
        const data = { token };

        const tokenAwaiting = sha256(token + password);
        authenticationTokens.push(tokenAwaiting);

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(data), "utf-8");
        break;
      }
      case "/getRegistrations": {
        let tokensBody = "";
        request.on("data", data => {
          tokensBody += data;

          // Too much POST data, kill the connection!
          // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
          if (tokensBody.length > 1e6) request.connection.destroy();
        });

        request.on("end", () => {
          try {
            const recievedToken = JSON.parse(tokensBody);
            const { token } = recievedToken;

            const tokenIndex = authenticationTokens.indexOf(token);
            if (tokenIndex === -1) {
              response.writeHead(403);
              response.end();
            } else {
              authenticationTokens.splice(tokenIndex, 1);

              console.log("done");

              fs.readFile(emailsStoreFile, "utf-8", (err, data) => {
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ data }), "utf-8");
              });
            }
          } catch (e) {
            console.log(e);
          }
        });

        break;
      }
      case "/bags":
        const { count: countString } = query;

        if (
          !countString &&
          typeof countString === "string" &&
          typeof parseInt(countString, 10) === "number"
        ) {
          response.writeHead(400);
          response.end();
          return;
        }

        const allBags = Object.entries(bagsMapJSON).reduce(
          (acc: Array<{ name: string; image: string }>, [brend, photos]) => [
            ...acc,
            ...photos.map(ph => ({
              image: `${bagsClientPath}/${brend}/${ph}`,
              name: brend
            }))
          ],
          []
        );
        console.log(allBags);
        shuffleArray(allBags);

        const count = parseInt(countString as string, 10);
        const countToTake = Math.min(allBags.length, count);
        const extraBags = Math.max(count - allBags.length, 0);

        const bagsToTake = allBags
          .slice(0, countToTake)
          .concat(shuffleArray(allBags).slice(0, extraBags));
        const json = JSON.stringify(bagsToTake);

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(json, "utf-8");
        return;

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
              !data.location.country ||
              !data.id
            )
              throw new Error("Invalid data type");

            saveData({
              ...(data as DataType),
              id: request.connection.remoteAddress || data.id
            });
          } catch (e) {
            console.log(e);
            response.writeHead(400);
            response.end((e as Error).toString());
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
        const filePath =
          filePathAbs === "/" || filePathAbs === "/registrations"
            ? "/index.html"
            : filePathAbs;
        // const filePathDecoded = decodeURIComponent(
        //   filePath.includes("__") ? filePath.split("__")[0] : filePath
        // );
        const filePathDecoded = decodeURIComponent(filePath);

        const extname = path.extname(filePathDecoded);
        const map: Record<string, string> = {
          ".css": "text/css",
          ".jpg": "image/jpg",
          ".js": "text/javascript",
          ".json": "application/json",
          ".png": "image/png"
        };
        const contentType = map[extname] || "text/html";

        fs.readFile(buildPath + filePathDecoded, (error, content) => {
          if (error)
            if (error.code === "ENOENT") {
              console.warn("no such file error", filePathDecoded);
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
  .listen(PORT);
console.log(`Server running at http://127.0.0.1:${PORT}/`);

function initDataStore(): void {
  function initCSV(): void {
    fs.writeFileSync(emailsStoreFile, "");
  }

  foldersToCreate.forEach(
    folder => fs.existsSync(folder) || fs.mkdirSync(folder)
  );
  fs.existsSync(emailsStoreFile) || initCSV();

  // lineReader.eachLine(emailsStoreFile, line => {
  //   console.log(line);
  // });
}

function formatData(data: DataType): string {
  return [
    data.email,
    data.date,
    `${data.location.country} ${data.location.city}`,
    ...(data.choosenBag
      ? [data.choosenBag.name, data.choosenBag.image]
      : [null, null]),
    data.id
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

function loadBrendsData(folder: string): Record<string, string[]> {
  const brends = fs
    .readdirSync(folder, { withFileTypes: true })
    .filter(entity => entity.isDirectory())
    .map(dir => dir.name);

  const bags: Array<[string, string[]]> = brends.map(brendFolderName => {
    const photos = fs
      .readdirSync(`${folder}/${brendFolderName}`, { withFileTypes: true })
      .filter(entity => entity.name.startsWith(brendPhotoPrefix))
      .map(ph => ph.name);
    return [brendFolderName, photos];
  });

  const bagsMap: Record<string, string[]> = bags.reduce(
    (acc, [brend, photos]) => ({ ...acc, [brend]: photos }),
    {}
  );
  return bagsMap;
}
