import {Injectable, inject, runInInjectionContext, EnvironmentInjector} from '@angular/core';
import {
    Firestore,
    collection,
    addDoc, query, orderBy, collectionData, doc, docData, updateDoc, where, limit, getDocs
} from '@angular/fire/firestore';
import {map, Observable, of} from "rxjs";
import {Rental} from "../models/rental.modal";

@Injectable({
    providedIn: 'root'
})
export class RentalsService {
    private readonly injector = inject(EnvironmentInjector);

    private firestore = inject(Firestore);

    private rentalsCollection = collection(
        this.firestore,
        'rentals'
    );

    getActiveRentals(): Observable<Rental[]> {

        const rentalsRef = collection(
            this.firestore,
            'rentals'
        );

        const today = new Date();

        const rentalsQuery = query(
            rentalsRef,
            where('endDate', '>=', today.toISOString().split('T')[0])
        );

        return collectionData(
            rentalsQuery,
            {
                idField: 'id'
            }
        ) as Observable<Rental[]>;
    }

    getActiveRentalsForSet(setId: string): Observable<Rental[]> {
        const rentalsRef = collection(
            this.firestore,
            'rentals'
        );

        const today = new Date();

        const rentalsQuery = query(
            rentalsRef,
            where('setId', '==', setId),
            where('endDate', '>=', today.toISOString().split('T')[0])
        );

        return collectionData(
            rentalsQuery,
            {
                idField: 'id'
            }
        ) as Observable<Rental[]>;
    }

    async addRental(set: Rental): Promise<string> {
        const docRef = await addDoc(
            this.rentalsCollection,
            {
                ...set,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        );

        return docRef.id;
    }

    async updateRental(rental: Rental): Promise<void> {
        if (!rental.id) {
            throw new Error('Rental moet een id hebben om te kunnen updaten');
        }

        const rentalRef = doc(this.firestore, `rentals/${rental.id}`);

        // We willen de id niet opslaan in het document zelf
        const { id, ...dataToUpdate } = rental;

        await updateDoc(rentalRef, {
            ...dataToUpdate,
            updatedAt: new Date()
        });
    }

    getRental(id: string): Observable<Rental | undefined> {

        const setDocument = doc(
            this.firestore,
            `rentals/${id}`
        );

        return docData(
            setDocument,
            {
                idField: 'id'
            }
        ) as Observable<Rental | undefined>;
    }

    getRentalByLink(link: string): Observable<Rental | undefined> {
        if (!link?.trim()) {
            return of(undefined);
        }

        const q = query(
            this.rentalsCollection,
            where('link', '==', link.trim()),
            limit(1)
        );

        return collectionData(q, { idField: 'id' }).pipe(
            map(rentals => rentals[0] as Rental | undefined)
        );
    }

    getRentals(): Observable<Rental[]> {

        const setsQuery = query(
            this.rentalsCollection,
            orderBy('name')
        );
        return runInInjectionContext(this.injector, () =>
             collectionData(
                setsQuery,
                {
                    idField: 'id'
                }
            ) as Observable<Rental[]>
        );
    }
}
