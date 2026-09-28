export interface InvoiceLine {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Invoice {
    id?: string;

    invoiceNumber: string;
    rentalId: string;

    customerName: string;
    phoneNumber: string;

    setId: string;
    localSetId: number;
    setName: string;

    rentalStartDate: string;
    rentalEndDate: string;
    weeks: number;

    disassemblyService: boolean;
    sortingPlates: boolean;

    lines: InvoiceLine[];

    subtotal: number;
    total: number;

    deposit: number;

    createdAt?: any;
    updatedAt?: any;
}
