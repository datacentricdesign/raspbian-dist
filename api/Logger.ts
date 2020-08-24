import { Logger, ILogObject } from "tslog";
import { appendFileSync } from "fs";
import config from "./config";



export class Log {

  static logger: Logger;
  static silly: Function;
  static debug: Function;
  static trace: Function;
  static info: Function;
  static warn: Function;
  static error: Function;
  static fatal: Function;

  static init(name: string) {
    if (config.env.env === 'development') {
      Log.logger = new Logger({ name: name, type: 'pretty' });
    } else {
      Log.logger = new Logger({ name: name, type: 'hidden' });
    }

    Log.logger.attachTransport(
      {
        silly: logToTransport,
        debug: logToTransport,
        trace: logToTransport,
        info: logToTransport,
        warn: logToTransport,
        error: logToTransport,
        fatal: logToTransport,
      },
      "debug"
    );

    Log.silly = Log.logger.silly.bind(Log.logger)
    Log.debug = Log.logger.debug.bind(Log.logger)
    Log.trace = Log.logger.trace.bind(Log.logger)
    Log.info = Log.logger.info.bind(Log.logger)
    Log.warn = Log.logger.warn.bind(Log.logger)
    Log.error = Log.logger.error.bind(Log.logger)
    Log.fatal = Log.logger.fatal.bind(Log.logger)
  }


}

function logToTransport(logObject: ILogObject) {
  appendFileSync(config.hostDataFolder + '/logs/log.txt', JSON.stringify(logObject) + "\n");
}
