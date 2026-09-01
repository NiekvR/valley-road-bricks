export interface Rental {
    id?: number;
    setId: string;
    setName: string;
    customerName: string;
    phoneNumber: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'returned' | 'cancelled';
    weeks: number;
    disassemblyService: boolean;
    sortingPlates: boolean;
    createdAt: Date;
}
