import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser'
import * as helmet from "helmet";
import * as cors from "cors";
import config from "./config";
import errorMiddleware from './ErrorMiddleware';
import { DPIRouter } from "./DPiRouter";

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
app.use("/", DPIRouter);
app.use(errorMiddleware)

// Start listening
app.listen(config.http.port, () => {
    console.log("Server started on port " + config.http.port + "!");
});