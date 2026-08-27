export interface Rental {
    id?: number;
    setId: string;
    setName: string;
    customerName: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'returned' | 'cancelled';
    createdAt: Date;
}
