export interface ControlPiece {
    brickId: string;
    quantity: number;
}

export interface ControlBag {
    id?: string;

    bagNumber: number;

    pieces: ControlPiece[];

    createdAt?: any;
    updatedAt?: any;
}
