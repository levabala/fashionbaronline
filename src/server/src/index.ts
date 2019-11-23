import fs from 'fs';
import http from 'http';
import { sha256 } from 'js-sha256';
import mongoose, { Document } from 'mongoose';
import path from 'path';
import url from 'url';
import { v4 } from 'uuid';

import mailEnglish from './mailEnglish';
import mailGerman from './mailGerman';

const { id: emailId, secret: emailSecret } = require("../email_keys.json");
const sendpulse = require("sendpulse-api");

const API_USER_ID = emailId;
const API_SECRET = emailSecret;

const TOKEN_STORAGE = "/tmp/";
sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, (token: any) => {
  console.log("authorized", token);
});

mongoose.connect("mongodb://localhost/fashionbar", {
  useFindAndModify: false,
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
  verified?: boolean;
  unsubscribed?: boolean;
}

interface IBagData {
  id: string;
  brandName: string;
  nameOfModel: string;
  price: number;
}

interface IDay extends Document {
  time: Date;
  registrations: number;
  visits: number;
  subscriptions: number;
}

type IBag = IBagData & Document;

const registartionSchema = new mongoose.Schema({
  date: {
    required: true,
    type: Date
  },
  email: {
    required: true,
    type: String
  },
  id: {
    required: true,
    type: String
  },
  location: {
    required: true,
    type: {
      country: String,
      town: String
    }
  },
  relativeBagBrand: String,
  relativeBagPath: String,
  unsubscribed: Boolean,
  verified: Boolean
});

const bagSchema = new mongoose.Schema({
  brandName: String,
  id: String,
  nameOfModel: String,
  price: Number
});

const daySchema = new mongoose.Schema({
  _id: String,
  registrations: Number,
  subscriptions: Number,
  time: Date,
  visits: Number
});

const Registration = mongoose.model<IRegistration>(
  "Registration",
  registartionSchema
);

const Bag = mongoose.model<IBag>("Bag", bagSchema);

const Day = mongoose.model<IDay>("Day", daySchema);

Bag.find()
  .exec()
  .then(bagsCollection => {
    console.log("bags collection:");
    bagsCollection.forEach(bag =>
      console.log(`\t${bag.brandName}: ${bag.price}`)
    );
  });

Day.find()
  .exec()
  .then(days => console.log(`stored data for ${days.length} days`));

const { password } = require("../password.json");
console.log({ password });

// tslint:disable:no-if-statement no-object-mutation no-array-mutation

const buildPath = "../../build";
const bagsFolderPath = "../../public/data/bags";
const brendPhotoPrefix = "Depositphotos_";
// const dataPath = "./build/data";
const bagsClientPath = "data/bags";

const PORT = 3000;

// const foldersToCreate = ["./build", "./build/data"];

const bagsMapJSON = loadBrendsData(bagsFolderPath);

interface IRegistartionData {
  email: string;
  date: string;
  location: { country: string; city: string };
  choosenBag?: { name: string; image: string };
  id: string;
  language?: string;
}

function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const authenticationTokensPage: string[] = [];
const authenticationTokensEmail: Record<string, string> = { testToken: "qwe" };

http
  .createServer(async (request, response) => {
    const { pathname: requestPath, query } = url.parse(
      request.url as string,
      true
    );

    const defaultChecker = () => {
      const filePathAbs = requestPath || "/";
      const filePath =
        filePathAbs === "/" ||
        filePathAbs === "/registrations" ||
        filePathAbs === "/manageBags" ||
        filePathAbs === "/unsubscribe" ||
        filePathAbs === "/verifyEmail" ||
        filePathAbs === "/getDaysData" ||
        filePathAbs === "/registerUniqualUser"
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
        // ".js": "gzip",
        ".json": "application/json",
        ".png": "image/png"
      };
      const contentType = map[extname] || "text/html";

      const isJS = extname === ".js";
      fs.readFile(
        buildPath + filePathDecoded + (isJS ? ".gz" : ""),
        (error, content) => {
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
            const contentEncoding = isJS ? { "Content-Encoding": "gzip" } : {};
            const head = {
              "Content-Type": contentType,
              ...contentEncoding
            };
            response.writeHead(200, head);

            // response.writeHead(200, { "Content-Type": "gzip" });
            response.end(content, "utf-8");
          }
        }
      );
    };

    switch (requestPath) {
      case "/registerUniqualUser": {
        addVisit();
        break;
      }
      case "/unsubscribe": {
        console.log("user has been unsubscribed");
        defaultChecker();
        break;
      }
      case "/verifyEmail": {
        const { token } = query;
        const email = authenticationTokensEmail[(token || "").toString()];
        console.log(authenticationTokensEmail);
        console.log(email, token);

        // if (!email) {
        //   response.end(
        //     "This email was already verified. (or you have used very strange token)"
        //   );
        //   return;
        // }

        // tslint:disable-next-line:no-delete
        delete authenticationTokensEmail[(token || "").toString()];

        const registration = await Registration.findOne({ email }).exec();
        if (registration) {
          if (!registration.verified) {
            const emailObj = {
              from: {
                email: "info@fashionbar.online",
                name: "Fashionbar.online"
              },
              html: `<h1>New verified registration</h1><div><span>mail: </span><span>${email}</span></div>`,
              subject: "New registration",
              text: "New registration",
              to: [
                {
                  email: "dtohparidi@gmail.com",
                  name: "God of Fashionbar"
                }
              ]
            };

            const answerGetter = (data: any) => {
              console.log(data);
            };
            sendpulse.smtpSendMail(answerGetter, emailObj);
          }

          registration.verified = true;
          registration.save();

          addSubscription();
        }
        console.log(
          `${email} was verified (or not? who knows - maybe it's undefined)`
        );

        // response.end("The email is verified");

        console.log(
          `all verified registrations count: ${
            (await Registration.find({ verified: true }).exec()).length
          }`
        );

        defaultChecker();
        break;
      }
      case "/variables": {
        console.log(requestPath);
        response.end(JSON.stringify({ subscriptionCost: 199 }));
        break;
      }
      case "/auth": {
        const token = v4();
        const data = { token };

        const tokenAwaiting = sha256(token + password);
        authenticationTokensPage.push(tokenAwaiting);

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(data), "utf-8");
        break;
      }
      case "/bagsInfo": {
        const bags = await Bag.find().exec();
        const bagsInfo: IBagData[] = bags.map(
          ({ nameOfModel, price, brandName, id }: IBagData) => ({
            brandName,
            id,
            nameOfModel,
            price
          })
        );

        response.end(JSON.stringify(bagsInfo));
        break;
      }
      case "/setBag": {
        console.log("set bag request");

        let tokensBody = "";
        request.on("data", data => {
          tokensBody += data;

          // Too much POST data, kill the connection!
          // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
          if (tokensBody.length > 1e6) request.connection.destroy();
        });

        request.on("end", async () => {
          try {
            const recievedData = JSON.parse(tokensBody);
            const { token } = recievedData;

            const tokenIndex = authenticationTokensPage.indexOf(token);
            if (tokenIndex === -1) {
              response.writeHead(403);
              response.end();
            } else {
              authenticationTokensPage.splice(tokenIndex, 1);

              console.log("'setBag' request approved");

              const {
                id,
                nameOfModel,
                brandName,
                price
              } = recievedData as IBagData;
              const bag = (await Bag.findOneAndUpdate(
                { id },
                { id, nameOfModel, brandName, price },
                { upsert: true, strict: false }
              ).exec()) as IBag;

              if (bag) await bag.save();

              console.log({ id, nameOfModel, brandName, price });

              console.log(`${bag.id} bag saved`);

              response.end("success");
            }
          } catch (e) {
            console.log(e);
            response.end("error");
          }
        });

        break;
      }
      case "/getDaysData": {
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

            const tokenIndex = authenticationTokensPage.indexOf(token);
            if (tokenIndex === -1) {
              response.writeHead(403);
              response.end();
            } else {
              authenticationTokensPage.splice(tokenIndex, 1);

              console.log("'getDaysData' request approved");

              const days = await Day.find().exec();
              const jsons = days.map(d => d.toJSON());

              response.end(JSON.stringify(jsons));
            }
          } catch (e) {
            console.log(e);
          }
        });

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

            const tokenIndex = authenticationTokensPage.indexOf(token);
            if (tokenIndex === -1) {
              response.writeHead(403);
              response.end();
            } else {
              authenticationTokensPage.splice(tokenIndex, 1);

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
      case "/allBags":
        const bags = Object.entries(bagsMapJSON).reduce(
          (acc: Array<{ name: string; image: string }>, [brend, photos]) => [
            ...acc,
            ...photos.map(ph => ({
              image: `${bagsClientPath}/${brend}/${ph}`,
              name: brend
            }))
          ],
          []
        );

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(bags), "utf-8");
        return;
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

        request.on("end", async () => {
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

            // tslint:disable-next-line:no-object-literal-type-assertion
            const dataR = {
              ...data,
              email: data.email.toLowerCase()
            } as IRegistartionData;
            const id = request.connection.remoteAddress || dataR.id;

            const unique = await isUnique(dataR);
            const emailToken = v4();

            authenticationTokensEmail[emailToken] = dataR.email;

            if (id !== "::1")
              sendHelloEmail(dataR.email, emailToken, dataR.language);

            if (!unique) {
              response.end();
              return;
            }

            saveData({
              ...dataR,
              id
            });

            addRegistration();

            response.end("done");
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
      default:
        defaultChecker();
    }
  })
  .listen(PORT);
console.log(`Server running at http://127.0.0.1:${PORT}/`);

async function sendHelloEmail(
  mail: string,
  token: string,
  language = "en"
): Promise<void> {
  console.log(`send mail to ${mail}`);
  const verifyLink = ` https://fashionbar.online/verifyEmail?token=${token}`;
  const html = language.includes("de")
    ? mailGerman(verifyLink)
    : mailEnglish(verifyLink);

  // create reusable transporter object using the default SMTP transport
  const email = {
    from: {
      email: "info@fashionbar.online",
      name: "Fashionbar.online"
    },
    html,
    subject: "Successful registration",
    text: "Hello mail from fashionbar.online",
    to: [
      {
        email: mail,
        name: "Dear subscriber"
      }
    ]
  };

  const answerGetter = (data: any) => {
    console.log(data);
  };
  sendpulse.smtpSendMail(answerGetter, email);

  console.log("mail sent successfully");
}

async function addSmth(type: keyof IDay): Promise<void> {
  const date = new Date();
  const dateStamp = [date.getFullYear(), date.getMonth(), date.getDate()].join(
    ""
  );
  const day = await Day.findById(dateStamp).exec();

  if (!day) {
    const newDay = new Day({
      _id: dateStamp,
      registrations: 0,
      subscriptions: 0,
      time: date,
      visits: 0,
      ...{ [type]: 1 }
    });

    await newDay.save();
    console.log("new day instance created!");
  } else {
    day[type]++;
    const updatedDay = await day.save();

    console.log(`new ${type}: ${updatedDay[type] - 1} -> ${updatedDay[type]}`);
  }
}

async function addRegistration(): Promise<void> {
  addSmth("registrations");
}

async function addSubscription(): Promise<void> {
  addSmth("subscriptions");
}

async function addVisit(): Promise<void> {
  addSmth("visits");
}

async function isUnique(data: IRegistartionData): Promise<boolean> {
  const { email } = data;

  return (await Registration.findOne({ email }).exec()) === null;
}

async function saveData(data: IRegistartionData): Promise<void> {
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
