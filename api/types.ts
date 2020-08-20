
export interface DPi {
    id: string;
    email: string;
    created_at: number;
    status: string;
    
    img_name: string;
    target_hostname: string;
    keyboard_layout: string;
    timezone_default: string;
    first_user_name: string;
    first_user_pass: string;
    enable_SSH: string;
    home_ESSID?: string;
    home_password?: string;
    wpa_ESSID?: string;
    wpa_password?: string;
    wpa_country?: string;
    keyboard_keymap: string;
    locale_default: string;
}

export interface DTODPi {
    thingId: string;
    email?: string;
    created_at?: number;
    status?: string;
    
    img_name?: string;
    target_hostname?: string;
    keyboard_layout?: string;
    timezone_default?: string;
    first_user_name?: string;
    first_user_pass?: string;
    enable_SSH?: string;
    home_ESSID?: string;
    home_password?: string;
    wpa_ESSID?: string;
    wpa_password?: string;
    wpa_country?: string;
    keyboard_keymap?: string;
    locale_default?: string;
}
