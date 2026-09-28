export interface Piece {
    partId: string;

    /**
     * LEGO/Rebrickable element ID indien bekend.
     */
    elementId?: string;

    /**
     * Rebrickable part/design number.
     */
    colorId: number;
    colorName: string;

    /**
     * Originele XML gegevens.
     */
    condition?: string;

    isSpare?: boolean;

    /**
     * Rebrickable gegevens.
     */
    name?: string;
    imageUrl?: string;
    categoryId?: number;
}

export interface SetPart {
    partId: string;
    quantity: number;
}

export interface SetBag {
    bagId: number;
    parts: SetPart[];
}

export interface SetInventory {
    setId: string;

    bags: SetBag[];

    /**
     * Optioneel handig voor administratie/debugging.
     */
    source?: 'xml' | 'rebrickable' | 'xml+rebrickable';

    importedAt?: Date;
}
