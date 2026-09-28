export interface RebrickablePart {
    part_num: string;
    name: string;
    part_cat_id?: number;
    part_url?: string;
    part_img_url?: string;

    external_ids?: {
        LEGO?: string[];
        BrickLink?: string[];
        BrickOwl?: string[];
        LDraw?: string[];
    };
}

export interface RebrickableColor {
    id: number;
    name: string;
    rgb?: string;
}

export interface RebrickableElement {
    element_id: string;
    part: string;
    color: RebrickableColor;
    design_id?: string;
    element_img_url?: string;
    part_img_url?: string;
}

export interface RebrickablePartsResponse {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: RebrickablePart[];
}
