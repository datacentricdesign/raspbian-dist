import { Router } from "express";

import DPiController from "./DPiController";

export const DPIRouter = Router();

/**
 * @api {get} /health
 * @apiGroup DPi
 * @apiDescription Get Health status of DPi API
 *
 * @apiVersion 0.0.1
 *
 * @apiSuccess {object} health status
**/
DPIRouter.get(
    "/health",
    DPiController.apiHealth);

/**
 * @api {get} /
 * @apiGroup DPI
 * @apiDescription Get DPi Image
 *
 * @apiVersion 0.0.1
 *
 * @apiSuccess {DPi}
**/
DPIRouter.get(
    "/:dpiId",
    DPiController.getOneDPIImage);

/**
     * @api {post} /
     * @apiGroup DPi
     * @apiDescription Generate a new DPi Image
     *
     * @apiVersion 0.1.0
     *
     * @apiParam (Body) {DTODPi}
     * @apiHeader {String} Content-type application/json
     *
     * @apiSuccess {DPi}
     **/
DPIRouter.post(
    "/",
    DPiController.generateNewDPIImage);