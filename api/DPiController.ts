import {Request, Response, Router, NextFunction} from "express";
import {validate} from "class-validator";
import { DPiService } from "./DPIService";

export class DPiController {

    static dpiService = new DPiService()

    static apiHealth = async (req: Request, res: Response) => {
        res.send({status: "OK"});
    };

    static getOneDPIImage = async (req: Request, res: Response) => {
        const dpiId = req.params.dpiId
        DPiController.dpiService.getOneDPIImage(dpiId)
    };

    static generateNewDPIImage = async (req: Request, res: Response, next: NextFunction) => {
        const dtoDpi = req.body;
        DPiController.dpiService.generateNewDPi(dtoDpi)
    };
}

export default DPiController;