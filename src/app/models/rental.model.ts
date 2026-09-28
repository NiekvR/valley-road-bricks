export interface Rental {
    id?: number;
    setId: string;
    localSetId: number
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
    weeklyPrice: number;
    disassemblyPrice: number;
    sortingPlatesPrice: number;
    totalPrice: number;
}
