import fs from 'fs';
import http from 'http';
import { sha256 } from 'js-sha256';
import mongoose, { Document } from 'mongoose';
import path from 'path';
import url from 'url';
import { v4 } from 'uuid';

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
}

interface IBagData {
  id: string;
  brandName: string;
  nameOfModel: string;
  price: number;
}

type IBag = IBagData & Document;

const registartionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  email: { type: String, required: true },
  id: { type: String, required: true },
  location: {
    required: true,
    type: {
      country: String,
      town: String
    }
  },
  relativeBagBrand: String,
  relativeBagPath: String,
  verified: Boolean
});

const bagSchema = new mongoose.Schema({
  brandName: String,
  id: String,
  nameOfModel: String,
  price: Number
});

const Registration = mongoose.model<IRegistration>(
  "Registration",
  registartionSchema
);

const Bag = mongoose.model<IBag>("Bag", bagSchema);

Bag.find()
  .exec()
  .then(bagsCollection => {
    console.log("bags collection:");
    bagsCollection.forEach(bag =>
      console.log(`\t${bag.brandName}: ${bag.price}`)
    );
  });

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

const authenticationTokensPage: string[] = [];
const authenticationTokensEmail: Record<string, string> = { testToken: "qwe" };

http
  .createServer(async (request, response) => {
    const { pathname: requestPath, query } = url.parse(
      request.url as string,
      true
    );

    switch (requestPath) {
      case "/verifyEmail": {
        const { token } = query;
        const email = authenticationTokensEmail[(token || "").toString()];

        if (!email) {
          response.end(
            "This email was already verified. (or you have used very strange token)"
          );
          return;
        }

        const registration = await Registration.findOne({ email }).exec();
        if (!registration) {
          response.end(
            "Internal error. Please, contact with us via this email: test@test.test"
          );
          return;
        }

        // tslint:disable-next-line:no-delete
        delete authenticationTokensEmail[(token || "").toString()];

        registration.verified = true;
        registration.save();
        console.log(`${email} was verified`);

        response.end("The email is verified");

        console.log(
          `all verified registrations count: ${
            (await Registration.find({ verified: true }).exec()).length
          }`
        );
      }
      case "/variables": {
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

            const dataR = data as IRegistartionData;
            const id = request.connection.remoteAddress || dataR.id;

            const unique = await isUnique(dataR);
            const emailToken = v4();

            if (id !== "::1") sendHelloEmail(dataR.email, emailToken);

            if (!unique) {
              response.end();
              return;
            }

            authenticationTokensEmail[dataR.email] = emailToken;

            saveData({
              ...dataR,
              id
            });

            response.end("already exists");
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
        const filePathAbs = request.url || "/";
        const filePath =
          filePathAbs === "/" ||
          filePathAbs === "/registrations" ||
          filePathAbs === "/manageBags" ||
          filePathAbs === "/verifyEmail"
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

async function sendHelloEmail(mail: string, token: string): Promise<void> {
  console.log(`send mail to ${mail}`);
  const verifyLink = ` https://fashionbar.online/verifyEmail?token=${token}`;

  const htmlEmailBody = `
  <!DOCTYPE html>

  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  
    <head>
      <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <meta content="width=device-width" name="viewport" />
      <!--[if !mso]><!-->
      <meta content="IE=edge" http-equiv="X-UA-Compatible" />
      <!--<![endif]-->
      <title></title>
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Droid+Serif" rel="stylesheet" type="text/css" />
      <!--<![endif]-->
      <style type="text/css">
        body {
          margin: 0;
          padding: 0;
        }
  
        table,
        td,
        tr {
          vertical-align: top;
          border-collapse: collapse;
        }
  
        * {
          line-height: inherit;
        }
  
        a[x-apple-data-detectors=true] {
          color: inherit !important;
          text-decoration: none !important;
        }
  
      </style>
      <style id="media-query" type="text/css">
        @media (max-width: 520px) {
  
          .block-grid,
          .col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
          }
  
          .block-grid {
            width: 100% !important;
          }
  
          .col {
            width: 100% !important;
          }
  
          .col>div {
            margin: 0 auto;
          }
  
          img.fullwidth,
          img.fullwidthOnMobile {
            max-width: 100% !important;
          }
  
          .no-stack .col {
            min-width: 0 !important;
            display: table-cell !important;
          }
  
          .no-stack.two-up .col {
            width: 50% !important;
          }
  
          .no-stack .col.num4 {
            width: 33% !important;
          }
  
          .no-stack .col.num8 {
            width: 66% !important;
          }
  
          .no-stack .col.num4 {
            width: 33% !important;
          }
  
          .no-stack .col.num3 {
            width: 25% !important;
          }
  
          .no-stack .col.num6 {
            width: 50% !important;
          }
  
          .no-stack .col.num9 {
            width: 75% !important;
          }
  
          .video-block {
            max-width: none !important;
          }
  
          .mobile_hide {
            min-height: 0px;
            max-height: 0px;
            max-width: 0px;
            display: none;
            overflow: hidden;
            font-size: 0px;
          }
  
          .desktop_hide {
            display: block !important;
            max-height: none !important;
          }
        }
  
      </style>
      <style>
        .button {
          font-size: 14px;
  
          display: inline-block;
          box-sizing: border-box;
          padding: 12px 20px;
          border-radius: 50px;
          text-align: center;
          background: #0000ff;
          color: white;
  
          width: 100%;
          font-weight: bold;
  
          outline: none;
          box-shadow: none;
          border: none;
  
          transition: background 0.3s ease-in-out;
  
  
  
  
        }
  
        .button :hover {
          background: #0000cc;
        }
  
        .button :active {
          background: #0000dd;
          transition: background 0.1s ease-in;
        }
  
      </style>
    </head>
  
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: white;">
      <h3 style="padding: 0 0.5em; padding-bottom: 0.5em">
        FASHIONBAR.ONLINE
      </h3>
      <!--[if IE]><div class="ie-browser"><![endif]-->
      <table bgcolor="white" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: white; width: 100%;" valign="top" width="100%">
        <tbody>
          <tr style="vertical-align: top;" valign="top">
            <td style='background-size: cover; border-collapse: collapse; line-height: inherit; vertical-align: top; word-break: break-word; background-image: url("https://resize.yandex.net/mailservice?url=https%3A%2F%2Ffashionbar.online%2Fassets%2Fimages%2Femail-background.jpg&proxy=yes&key=c5af2837c3d1ccda9ec3ec0f6f4bd429");' valign="top">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:white"><![endif]-->
              <div style="background-color:transparent;">
                <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                  <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                    <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                      <div style="width:100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                          <!--<![endif]-->
                          <div style="font-size:16px;text-align:center;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif">
                            <div class="our-class" style="background: transparent; height: 3em"></div>
                          </div>
                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 30px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                          <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:30px;padding-right:10px;padding-bottom:10px;padding-left:10px;background:white">
                            <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                              <p style="font-size: 18px; line-height: 1.2; text-align: center; mso-line-height-alt: 22px; margin: 0;"><span style="font-size: 18px;"><strong>Welcome to FASHIONBAR</strong></span></p>
                            </div>
                          </div>
                          <!--[if mso]></td></tr></table><![endif]-->
                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 20px; padding-bottom: 20px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                          <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:20px;padding-right:30px;padding-bottom:20px;padding-left:30px;background:white">
                            <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                              <p style="font-size: 14px; line-height: 1.2; text-align: center; mso-line-height-alt: 17px; margin: 0;">Приветствуем вас, спасибо большое, что Вы подписались на новости от fashionbar.online.</p>
                            </div>
                          </div>
                          <!--[if mso]></td></tr></table><![endif]-->
                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 20px; padding-bottom: 20px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                          <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:20px;padding-right:30px;padding-bottom:20px;padding-left:30px;background:white">
                            <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                              <p style="font-size: 14px; line-height: 1.2; text-align: center; mso-line-height-alt: 17px; margin: 0;">Мы работаем над запуском проекта и сообщим Вам как только будем готовы.</p>
                            </div>
                          </div>
                          <!--[if mso]></td></tr></table><![endif]-->
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:20px;padding-right:30px;padding-bottom:20px;padding-left:30px;background:white">
                          <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                          <a href="${verifyLink}" rel="noopener" style="text-decoration: none; font-weight: bold" target="_blank" class="button">Подтвердить почту</a>
                          </div>
                        </div>
                        <!--[if mso]></td></tr></table><![endif]-->
                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                  <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
              <div style="background-color:transparent;">
                <div class="block-grid three-up" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;background:white">
                  <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                    <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color:transparent;width:166px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                    <div class="col num4" style="max-width: 320px; min-width: 166px; display: table-cell; vertical-align: top; width: 166px;background:white">
                      <div style="width:100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                          <!--<![endif]-->
                          <div class="mobile_hide">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 30px; padding-top: 10px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                            <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:30px;">
                              <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                                <p style="font-size: 12px; line-height: 1.2; mso-line-height-alt: 14px; margin: 0;"><span style="font-size: 12px;"><strong><a href="fashionbar.online" rel="noopener" style="text-decoration: none; color: #555555;" target="_blank">Fashionbar</a></strong></span></p>
                              </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </div>
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    <!--[if (mso)|(IE)]></td><td align="center" width="166" style="background-color:transparent;width:166px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                    <div class="col num4" style="max-width: 320px; min-width: 166px; display: table-cell; vertical-align: top; width: 166px;background:white">
                      <div style="width:100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                          <!--<![endif]-->
                          <div class="mobile_hide">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                            <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                              <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                                <p style="font-size: 14px; line-height: 1.2; text-align: center; mso-line-height-alt: 17px; margin: 0;"><strong><span style="font-size: 12px;"><a href="https://fashionbar.online/unsubscribe" rel="noopener" style="text-decoration: none; color: #555555;" target="_blank">Unsubscribe</a></span></strong></p>
                              </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </div>
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    <!--[if (mso)|(IE)]></td><td align="center" width="166" style="background-color:transparent;width:166px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                    <div class="col num4" style="max-width: 320px; min-width: 166px; display: table-cell; vertical-align: top; width: 166px;background:white">
                      <div style="width:100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                          <!--<![endif]-->
                          <div class="mobile_hide">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                            <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:10px;padding-right:30px;padding-bottom:10px;padding-left:10px;">
                              <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                                <p style="font-size: 12px; line-height: 1.2; text-align: right; mso-line-height-alt: 14px; margin: 0;"><strong><a href="https://www.instagram.com/fashionbar.online/" rel="noopener" style="text-decoration: none; color: #555555;" target="_blank">Instagram</a></strong></p>
                              </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </div>
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
              <div style="background-color:transparent;">
                <div class="block-grid three-up no-stack" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                  <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                    <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color:transparent;width:166px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                    <div class="col num4" style="max-width: 320px; min-width: 166px; display: table-cell; vertical-align: top; width: 166px;background:white">
                      <div style="width:100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                          <!--<![endif]-->
                          <!--[if !mso]><!-->
                          <div class="desktop_hide" style="mso-hide: all; display: none; max-height: 0px; overflow: hidden;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 30px; padding-top: 10px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                            <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:30px;">
                              <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                                <p style="font-size: 10px; line-height: 1.2; mso-line-height-alt: 12px; margin: 0;"><span style="font-size: 10px;"><strong><a href="fashionbar.online" rel="noopener" style="text-decoration: none; color: #555555;" target="_blank">Fashionbar.online</a></strong></span></p>
                              </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </div>
                          <!--<![endif]-->
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    <!--[if (mso)|(IE)]></td><td align="center" width="166" style="background-color:transparent;width:166px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                    <div class="col num4" style="max-width: 320px; min-width: 166px; display: table-cell; vertical-align: top; width: 166px;background:white">
                      <div style="width:100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                          <!--<![endif]-->
                          <!--[if !mso]><!-->
                          <div class="desktop_hide" style="mso-hide: all; display: none; max-height: 0px; overflow: hidden;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                            <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                              <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                                <p style="font-size: 10px; line-height: 1.2; text-align: center; mso-line-height-alt: 12px; margin: 0;"><span style="font-size: 10px;"><strong><span style="font-size: 10px;"><a href="https://fashionbar.online/unsubscribe" rel="noopener" style="text-decoration: none; color: #555555;" target="_blank">Unsubscribe</a></span></strong></span></p>
                              </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </div>
                          <!--<![endif]-->
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    <!--[if (mso)|(IE)]></td><td align="center" width="166" style="background-color:transparent;width:166px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                    <div class="col num4" style="max-width: 320px; min-width: 166px; display: table-cell; vertical-align: top; width: 166px;background:white">
                      <div style="width:100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                          <!--<![endif]-->
                          <!--[if !mso]><!-->
                          <div class="desktop_hide" style="mso-hide: all; display: none; max-height: 0px; overflow: hidden;">
                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                            <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:10px;padding-right:30px;padding-bottom:10px;padding-left:10px;">
                              <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                                <p style="font-size: 10px; line-height: 1.2; text-align: right; mso-line-height-alt: 12px; margin: 0;"><span style="font-size: 10px;"><strong><a href="https://www.instagram.com/fashionbar.online/" rel="noopener" style="text-decoration: none; color: #555555;" target="_blank">Instagram</a></strong></span></p>
                              </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </div>
                          <!--<![endif]-->
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
              <div style="background-color:transparent;">
                <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                  <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                    <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                      <div style="width:100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                          <!--<![endif]-->
                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 30px; padding-top: 10px; padding-bottom: 30px; font-family: Georgia, 'Times New Roman', serif"><![endif]-->
                          <div style="color:#555555;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:30px;padding-left:30px;background:white; display: none">
                            <div style="font-family: 'Droid Serif', Georgia, Times, 'Times New Roman', serif; font-size: 12px; line-height: 1.2; color: #555555; mso-line-height-alt: 14px;">
                              <p style="font-size: 12px; line-height: 1.2; mso-line-height-alt: 14px; margin: 0;"><span style="font-size: 12px;">Fashionbar.online 2019</span></p>
                            </div>
                          </div>
                          <!--[if mso]></td></tr></table><![endif]-->
                          <div style="font-size:16px;text-align:center;font-family:'Droid Serif', Georgia, Times, 'Times New Roman', serif">
                            <div class="our-class" style="background: transparent; height: 3em"></div>
                          </div>
                          <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <span style="font-size: 12px; padding: 1em;">Fashionbar.online 2019</span>
      <!--[if (IE)]></div><![endif]-->
    </body>
  
  </html>


      `;

  // create reusable transporter object using the default SMTP transport
  const email = {
    from: {
      email: "info@fashionbar.online",
      name: "Fashionbar.online"
    },
    html: htmlEmailBody,
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
