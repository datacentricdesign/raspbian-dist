import { Router } from "express";

import DPiController from "./DPiController";

export const DPiRouter = Router();

/**
 * @api {get} /health
 * @apiGroup DPi
 * @apiDescription Get Health status of DPi API
 *
 * @apiVersion 0.0.1
 *
 * @apiSuccess {object} health status
**/
DPiRouter.get(
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
DPiRouter.get(
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
DPiRouter.post(
    "/",
    DPiController.generateNewDPIImage);

/**
 * @api {delete} /dpi/:dpiId Delete
 * @apiGroup DPi
 * @apiDescription Delete DPi Image
 *
 * @apiVersion 0.1.0
 *
 * @apiSuccess {DPi}
 **/
DPiRouter.delete(
    "/:dpiId",
    DPiController.deleteDPiImage);

/**
 * @api {delete} /dpi/:dpiId Cancel
 * @apiGroup DPi
 * @apiDescription Cancel DPi Image Generation
 *
 * @apiVersion 0.1.0
 *
 * @apiSuccess {DPi}
 **/
DPiRouter.get(
    "/:dpiId/cancel",
    DPiController.cancelDPiImageGeneration);