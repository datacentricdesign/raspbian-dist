import { Request, Response, Router, NextFunction } from "express";
import { validate } from "class-validator";
import { DPiService } from "./DPiService";
import { DPi } from "./types";
import config from "./config";
import { Log } from "./Logger";
import { str } from "envalid";
import * as fs from 'fs'
import { DCDError } from "@datacentricdesign/types";

export class DPiController {

    static dpiService = new DPiService()

    /**
     * Read the /scheduler.log to check how many running, pending, etc. builds
     * @param req 
     * @param res 
     */
    static apiHealth = async (req: Request, res: Response) => {
        const path = config.hostDataFolder + '/scheduler.log';
        try {
            const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })
            res.send(JSON.parse(data));
        } catch(error) {
            res.status(503).send({ status: "Service not available" });
        }
    };

    static getOneDPIImage = async (req: Request, res: Response) => {
        const dpiId = req.params.dpiId
        const download = req.query.download !== undefined ? req.query.download === 'true' : false;
        try {
            const status = await DPiController.dpiService.getOneDPiImage(dpiId, download)
            if (download && status.code === 0) {
                const path = config.hostDataFolder + '/images/' + dpiId + '/deploy/image_' + req.params.dpiId + '.zip';
                
                return res.download((path), function (error) {
                    if (error) {
                        Log.error("Failed to serve image " + path + " Error: " + error)
                    } else {
                        Log.info("Served image " + path)
                    }
                })
            }
            return res.status(200).json(status)
        } catch (error) {
            if (error.code === "ENOENT") {
                return res.status(404).send(new DCDError(404, "DPi image not found"))
            }
            return res.status(500).send(error)
        }
    };

    static generateNewDPIImage = async (req: Request, res: Response, next: NextFunction) => {
        const dtoDpi = req.body;
        try {
            const dpi: DPi = await DPiController.dpiService.generateNewDPi(dtoDpi)
            return res.status(200).json(dpi)
        } catch(error) {
            console.log(error)
            if (error.code === 'EEXIST') {
                return res.status(409).send(new DCDError(409, 'Image already existing or currently being built.'))
            }
            return res.status(500).send(error)
        }
    };

    static cancelDPiImageGeneration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await DPiController.dpiService.cancelDPiImageGeneration(req.params.dpiId)
            return res.status(204).send()
        } catch (error) {
            if (error.message.includes("No such container")) {
                return res.status(404).send(new DCDError(404,'Image generation not found.'))
            }
            return res.status(500).send(error)
        }
    };

    static deleteDPiImage = async (req: Request, res: Response, next: NextFunction) => {
        await DPiController.dpiService.deleteDPiImage(req.params.dpiId)
        return res.status(204).send()
    };
}

export default DPiController;