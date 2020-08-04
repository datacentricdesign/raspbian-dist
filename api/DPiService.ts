
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
    async getOneDPiImage(dpiId: string, download: boolean): Promise<DPi> {
        // TODO: read and return file in ./dpi/<dpiId>
        // TODO: if download and image ready, send file
        return Promise.reject();
    }

    /**
     * Generate a new DPI image.
     *
     * @param {DTODPi} dtoDPi
     * returns DPi
     **/
    async generateNewDPi(dtoDPi: DTODPi): Promise<DPi> {
        // TODO: use the values from dtoDPi as env var
        // TODO: generate an id
        // TODO: run container
        // TODO: write updates into ./dpi/<dpiId>

        return Promise.reject();
    }
}
