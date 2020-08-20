import { Request, Response, Router, NextFunction } from "express";
import { validate } from "class-validator";
import { DPiService } from "./DPiService";
import { DPi } from "./types";
import config from "./config";
import { Log } from "./Logger";
import { str } from "envalid";

export class DPiController {

    static dpiService = new DPiService()

    static apiHealth = async (req: Request, res: Response) => {
        res.send({ status: "OK" });
    };

    static getOneDPIImage = async (req: Request, res: Response) => {
        const dpiId = req.params.dpiId
        const download = req.query.download !== undefined ? req.query.download === 'true' : false;
        console.log(download)
        try {
            const status = await DPiController.dpiService.getOneDPiImage(dpiId, download)
            if (download && status.startsWith("Done!")) {
                const path = config.hostDataFolder + '/images/' + dpiId + '/deploy/image_2020-08-20-DCDbian.zip';
                return res.download((path), function (error) {
                    if (error) {
                        Log.error("Failed to serve image " + path + " Error: " + error)
                    } else {
                        Log.info("Served image " + path)
                    }
                })
            }

            return res.status(200).send(status)
        } catch (error) {
            if (error.code === "ENOENT") {
                return res.status(404).send("DPi image not found")
            }
            return res.status(500).send(error)
        }
    };

    static generateNewDPIImage = async (req: Request, res: Response, next: NextFunction) => {
        const dtoDpi = req.body;
        const dpi: DPi = await DPiController.dpiService.generateNewDPi(dtoDpi)
        return res.status(200).json(dpi)
    };

    static cancelDPiImageGeneration = async (req: Request, res: Response, next: NextFunction) => {
        const dtoDpi = req.body;
        try {
            await DPiController.dpiService.cancelDPiImageGeneration(req.params.dpiId)
            return res.status(204).send()
        } catch (error) {
            if (error.message.includes("No such container")) {
                return res.status(404).send('Image generation not found.')
            }
            return res.status(500).send(error)
        }
    };

    static deleteDPiImage = async (req: Request, res: Response, next: NextFunction) => {
        const dtoDpi = req.body;
        await DPiController.dpiService.deleteDPiImage(req.params.dpiId)
        return res.status(204).send()
    };
}

export default DPiController;