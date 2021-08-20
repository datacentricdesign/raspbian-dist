
import { v4 as uuidv4 } from 'uuid';
import { envConfig } from "./config/envConfig";
import { DTODPi, DPi } from './types';
import config from './config';
import * as fs from 'fs'
import { spawn, execSync } from "child_process";
import { Logger, ILogObject } from 'tslog';
import { Log } from './Logger';
import { DCDError } from '@datacentricdesign/types';

export class DPiService {

    /**
     * Get a DPi image
     *
     * @param {strind} dpiId
     * returns DPi
     **/
    async getOneDPiImage(dpiId: string, download: boolean): Promise<any> {
        const path = config.hostDataFolder + '/images/' + dpiId + '/status.json';
        try {
            const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })
            if (data === "") {
                return Promise.resolve({ code: -1, message: "Pending..." });
            } else if (data === "failure") {
                return Promise.reject(new DCDError(500, "Build failed"));
            } else {
                return Promise.resolve(JSON.parse(data));
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Cancel DPi image generation
     *
     * @param {strind} dpiId
     **/
    async cancelDPiImageGeneration(dpiId: string): Promise<void> {
        try {
            const dockerStop = execSync("docker stop pigen_" + dpiId + "_work");
            Log.debug(dockerStop.toString())
            const dockerRm = execSync("docker rm pigen_" + dpiId + "_work");
            Log.debug(dockerRm.toString())
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        } finally {
            this.deleteDPiImage(dpiId)
        }
    }

    /**
     * Cancel DPi image generation
     *
     * @param {strind} dpiId
     **/
    async deleteDPiImage(dpiId: string): Promise<void> {
        const path = config.hostDataFolder + '/images/' + dpiId;
        try {
            fs.rmdirSync(path, { recursive: true });
            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }

    }

    /**
     * Generate a new DPI image.
     *
     * @param {DTODPi} dtoDPi
     * returns DPi
     **/
    async generateNewDPi(dtoDPi: any): Promise<DPi> {
        const dpi: any = {
            id: dtoDPi.id.replace('dcd:things:', ''),
            private_key: dtoDPi.private_key,
            bucket_host: dtoDPi.bucket_host,
            img_name: dtoDPi.img_name !== undefined ? dtoDPi.img_name : config.dpi.img_name,
            keyboard_layout: dtoDPi.keyboard_layout !== undefined ? dtoDPi.keyboard_layout : config.dpi.keyboard_layout,
            keyboard_keymap: dtoDPi.keyboard_keymap !== undefined ? dtoDPi.keyboard_keymap : config.dpi.keyboard_keymap,
            timezone_default: dtoDPi.timezone_default !== undefined ? dtoDPi.timezone_default : config.dpi.timezone_default,
            locale_default: dtoDPi.locale_default !== undefined ? dtoDPi.locale_default : config.dpi.locale_default,
            enable_SSH: dtoDPi.enable_SSH !== undefined ? dtoDPi.enable_SSH : config.dpi.enable_SSH,
            target_hostname: dtoDPi.target_hostname,
            first_user_name: dtoDPi.first_user_name,
            first_user_pass: dtoDPi.first_user_password
        }

        // Home network
        if (dtoDPi.home_ESSID && dtoDPi.home_password) {
            dpi.home_ESSID = dtoDPi.home_ESSID
            dpi.home_password = dtoDPi.home_password
        }

        // enterprise network
        if (dtoDPi.wpa_ESSID && dtoDPi.wpa_password && dtoDPi.wpa_country) {
            dpi.wpa_ESSID = dtoDPi.wpa_ESSID
            dpi.wpa_country = dtoDPi.wpa_country
            dpi.wpa_password = dtoDPi.wpa_password
        }

        // write updates into ./dpi/<dpiId>/status.json
        try {
            await createEnvFile(dpi)
            // bootstrapNewContainer(dpi.id)
            return Promise.resolve(dpi);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

function createEnvFile(dpi: DPi): Promise<void> {
    const path = config.hostDataFolder + '/images/' + dpi.id
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(path, function (error: any) {
            if (error) {
                return reject(error);
            }
            Log.debug("Folder dpi " + dpi.id + " created!");
            let envData = ''
            for (let key in dpi) {
                envData += key.toUpperCase() + '="' + dpi[key] + '"\n'
            }
            try {
                fs.writeFileSync(path + '/.env', envData);
                fs.writeFileSync(config.hostDataFolder + '/images/' + dpi.id + '/status.json', JSON.stringify({ code: -1, message: "Pending" }));
                fs.writeFileSync(config.hostDataFolder + '/images/' + dpi.id + '/status', "");
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    })
}

function bootstrapNewContainer(id: string) {
    // Create a logger with the name of the image
    const log: Logger = new Logger({ name: id, suppressStdOutput: true, type: "pretty" });
    // set logs to go to images/<id>/logs.txt
    setLogToImageFolder(log)

    const ls = spawn("./builder/build-docker.sh", [id, config.hostDataFolder + '/images']);

    ls.stdout.on("data", data => {
        try {
            log.debug(`stdout: ${data}`);
        } catch (error) {

        }
    });

    ls.stderr.on("data", data => {
        try {
            log.error(`stderr: ${data}`);
        } catch (error) {
            Log.error(`stderr: ${data}`);
        }
    });

    ls.on('error', (error) => {
        Log.error(`${error.message}`);
    });

    ls.on("close", code => {
        if (code === 0) {
            Log.info(`PiGen for '${id}' exited with code ${code}.`)
        } else {
            try {
                fs.writeFileSync(config.hostDataFolder + '/images/' + id + '/status.json',
                    JSON.stringify(new DCDError(code, "Generation terminated unexpectedly with code " + code + ".")) + "\n");
            } catch (error) {

            } finally {
                Log.error(`PiGen for '${id}' exited with code ${code}.`)
            }
        }
    });
}

function logToImageFolder(logObject: ILogObject) {
    fs.appendFileSync(config.hostDataFolder + '/images/' + logObject.loggerName + '/logs.txt', JSON.stringify(logObject) + "\n");
}

function setLogToImageFolder(log: Logger) {
    log.attachTransport(
        {
            silly: logToImageFolder,
            debug: logToImageFolder,
            trace: logToImageFolder,
            info: logToImageFolder,
            warn: logToImageFolder,
            error: logToImageFolder,
            fatal: logToImageFolder,
        },
        "debug"
    );
}
