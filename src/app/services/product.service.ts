import {Injectable, inject, runInInjectionContext, EnvironmentInjector} from '@angular/core';
import {
    Firestore,
    collection,
    addDoc, query, orderBy, collectionData, doc, docData, updateDoc, where, limit, getDocs
} from '@angular/fire/firestore';
import {Product} from "../models/product.model";
import {map, Observable, of} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly injector = inject(EnvironmentInjector);

    private firestore = inject(Firestore);

    private productsCollection = collection(
        this.firestore,
        'products'
    );

    async addProduct(set: Product): Promise<string> {
        const docRef = await addDoc(
            this.productsCollection,
            {
                ...set,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        );

        return docRef.id;
    }

    async updateProduct(product: Product): Promise<void> {
        if (!product.id) {
            throw new Error('Product moet een id hebben om te kunnen updaten');
        }

        const productRef = doc(this.firestore, `products/${product.id}`);

        // We willen de id niet opslaan in het document zelf
        const { id, ...dataToUpdate } = product;

        await updateDoc(productRef, {
            ...dataToUpdate,
            updatedAt: new Date()
        });
    }

    getProduct(id: string): Observable<Product | undefined> {

        const setDocument = doc(
            this.firestore,
            `products/${id}`
        );

        return docData(
            setDocument,
            {
                idField: 'id'
            }
        ) as Observable<Product | undefined>;
    }

    getProductByLink(link: string): Observable<Product | undefined> {
        if (!link?.trim()) {
            return of(undefined);
        }

        const q = query(
            this.productsCollection,
            where('link', '==', link.trim()),
            limit(1)
        );

        return collectionData(q, { idField: 'id' }).pipe(
            map(products => products[0] as Product | undefined)
        );
    }

    getProducts(): Observable<Product[]> {

        const setsQuery = query(
            this.productsCollection,
            orderBy('name')
        );
        return runInInjectionContext(this.injector, () =>
             collectionData(
                setsQuery,
                {
                    idField: 'id'
                }
            ) as Observable<Product[]>
        );
    }
}
