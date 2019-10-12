import fs from 'fs';
import http from 'http';
import { sha256 } from 'js-sha256';
import mongoose, { Document } from 'mongoose';
import path from 'path';
import sendmail from 'sendmail';
import url from 'url';
import { v4 } from 'uuid';

mongoose.connect("mongodb://localhost/fashionbar", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("db connected");
});

interface IRegistration extends Document {
  date: Date;
  email: string;
  location: {
    country: string;
    town: string;
  };
  relativeBagBrand: string;
  relativeBagPath: string;
  id: string;
}

const registartionSchema = new mongoose.Schema({
  date: Date,
  email: String,
  id: String,
  location: {
    country: String,
    town: String
  },
  relativeBagBrand: String,
  relativeBagPath: String
});
const Registration = mongoose.model<IRegistration>(
  "Registration",
  registartionSchema
);

Registration.find()
  .exec()
  .then(regs => regs.forEach(r => console.log(r.toJSON())));

const { password } = require("../password.json");
console.log({ password });

// tslint:disable:no-if-statement no-object-mutation no-array-mutation

const buildPath = "../../build";
const bagsFolderPath = "../../public/data/bags";
const brendPhotoPrefix = "Depositphotos_";
const dataPath = "./build/data";
const bagsClientPath = "data/bags";

const PORT = 3000;

const foldersToCreate = ["./build", "./build/data"];

const bagsMapJSON = loadBrendsData(bagsFolderPath);

interface IRegistartionData {
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
      case "/variables": {
        break;
      }
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

        request.on("end", async () => {
          try {
            const recievedToken = JSON.parse(tokensBody);
            const { token } = recievedToken;

            const tokenIndex = authenticationTokens.indexOf(token);
            if (tokenIndex === -1) {
              response.writeHead(403);
              response.end();
            } else {
              authenticationTokens.splice(tokenIndex, 1);

              console.log("'getRegistrations' request approved");

              const regs = await Registration.find().exec();
              const jsons = regs.map(r => r.toJSON());

              response.end(JSON.stringify(jsons));
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
        // console.log(allBags);
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
            const data: Partial<IRegistartionData> = JSON.parse(body);
            if (
              !data.email ||
              !data.date ||
              !data.location ||
              !data.location.city ||
              !data.location.country ||
              !data.id
            )
              throw new Error("Invalid data type");

            const dataR = data as IRegistartionData;
            const id = request.connection.remoteAddress || dataR.id;
            if (id !== "::1") sendHelloEmail(dataR.email);
            saveData({
              ...dataR,
              id
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
            // console.warn("file read success");
            response.writeHead(200, { "Content-Type": contentType });
            response.end(content, "utf-8");
          }
        });
        break;
    }
  })
  .listen(PORT);
console.log(`Server running at http://127.0.0.1:${PORT}/`);

function sendHelloEmail(mail: string): void {
  sendmail({})(
    {
      from: "no-reply@fashionbar.online",
      to: mail,
      subject: "test sendmail",
      html: "Mail of test sendmail "
    },
    err => (err ? console.log(err) : null)
  );
}

async function isUnique(data: IRegistartionData): Promise<boolean> {
  const { email } = data;

  return (await Registration.findOne({ email }).exec()) === null;
}

async function saveData(data: IRegistartionData): Promise<void> {
  const unique = await isUnique(data);

  if (!unique) return;

  const { date, email, location, choosenBag, id } = data;
  const registration: IRegistration = new Registration({
    date,
    email,
    id,
    location,
    relativeBagBrand: (choosenBag || {}).name || "",
    relativeBagPath: (choosenBag || {}).image || ""
  });

  await registration.save();
  console.log(`save ${email}`);
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
