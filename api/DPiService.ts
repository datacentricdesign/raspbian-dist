
import { v4 as uuidv4 } from 'uuid';
import { envConfig } from "./config/envConfig";
import { DTODPi, DPi } from './types';

export class DPiService {

    /**
     *
     * @constructor
     */
    constructor() {
    }

    /**
     * Get a DPi image
     *
     * @param {strind} dpiId
     * returns DPi
     **/
    async getOneDPIImage(dpiId: string): Promise<DPi> {
        return Promise.reject();
    }

    /**
     * Generate a new DPI image.
     *
     * @param {DTODPi} dtoDPi
     * returns DPi
     **/
    async generateNewDPi(dtoDPi: DTODPi): Promise<DPi> {
        return Promise.reject();
    }
}
