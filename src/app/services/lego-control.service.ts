import { Injectable, inject } from '@angular/core';

import {
    Firestore,
    collection,
    collectionData,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { ControlBag } from '../models/control-bag.model';

@Injectable({
    providedIn: 'root'
})
export class LegoControlService {

    private firestore = inject(Firestore);

    getBags(setId: string): Observable<ControlBag[]> {

        const bagsRef = collection(
            this.firestore,
            `legoSets/${setId}/controlBags`
        );

        const bagsQuery = query(
            bagsRef,
            orderBy('bagNumber', 'asc')
        );

        return collectionData(
            bagsQuery,
            {
                idField: 'id'
            }
        ) as Observable<ControlBag[]>;
    }


    async addBag(
        setId: string,
        bag: ControlBag
    ): Promise<void> {

        const bagsRef = collection(
            this.firestore,
            `legoSets/${setId}/controlBags`
        );

        await addDoc(bagsRef, {
            bagNumber: bag.bagNumber,
            pieces: bag.pieces,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }


    async updateBag(
        setId: string,
        bag: ControlBag
    ): Promise<void> {

        if (!bag.id) {
            throw new Error('Bag heeft geen id.');
        }

        const bagRef = doc(
            this.firestore,
            `legoSets/${setId}/controlBags/${bag.id}`
        );

        await updateDoc(bagRef, {
            bagNumber: bag.bagNumber,
            pieces: bag.pieces,
            updatedAt: new Date()
        });
    }


    async deleteBag(
        setId: string,
        bagId: string
    ): Promise<void> {

        const bagRef = doc(
            this.firestore,
            `legoSets/${setId}/controlBags/${bagId}`
        );

        await deleteDoc(bagRef);
    }
}
