
export interface DPi {
    id: string;
    email: string;
    createdAt: Date;
    status: string;
    
    imgName: string;
    targetHostname: string;
    keyboardLayout: string;
    timezoneDefault: string;
    firstUserName: string;
    firstUserPass: string;
    enableSSH: string;
    homeESSID: string;
    homePassword: string;
    wpaESSID: string;
    wpaCountry: string;
    keyboardKeymap: string;
    localeDefault: string;
}

export interface DTODPi {
    thingId: string;
    email?: string;
    createdAt?: Date;
    status?: string;
    
    imgName?: string;
    targetHostname?: string;
    keyboardLayout?: string;
    timezoneDefault?: string;
    firstUserName?: string;
    firstUserPass?: string;
    enableSSH?: string;
    homeESSID?: string;
    homePassword?: string;
    wpaESSID?: string;
    wpaCountry?: string;
    keyboardKeymap?: string;
    localeDefault?: string;
}
