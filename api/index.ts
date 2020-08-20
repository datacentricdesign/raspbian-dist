import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser'
import * as helmet from "helmet";
import * as cors from "cors";
import config from "./config";
import errorMiddleware from './ErrorMiddleware';
import { DPiRouter } from "./DPiRouter";
import { DPiService } from "./DPiService";
import { DTODPi } from "./types";
import { appendFileSync, mkdir } from 'fs'
import { Logger, ILogObject } from "tslog";
import { Log } from "./Logger";

Log.init("dPi")

// Create a new express application instance
const app = express();

// Call middleware
app.use(cors());
app.use(helmet());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set all routes from routes folder
app.use(config.http.baseUrl + "/", DPiRouter);
app.use(errorMiddleware)

// Make sure there is a subfolder to store images
mkdir(config.hostDataFolder + '/images', function(error: any) {
  if (error && error.errno !== -17) {
    return Log.error(error)
  }
  // Start listening for request
  app.listen(config.http.port, () => {
    Log.info("Server started on port " + config.http.port + "!");
  });
  // test()
})

// function test() {
//   const data: DTODPi = {
//     thingId: "dcd:things:test",
//     target_hostname: "my-pi",
//     email: "lab@datacentricdesign.org",
//     first_user_name: "jacky",
//     first_user_pass: "testtest",
//     home_ESSID: 'TELE2-F19630_2.4G',
//     home_password: '7AE697F4739D',
//     wpa_ESSID: 'eduroam',
//     wpa_password: '0332KJ-=BoBo',
//     wpa_country: 'NL'
//   }
  
//   const dpiService = new DPiService()
//   dpiService.generateNewDPi(data)
// }