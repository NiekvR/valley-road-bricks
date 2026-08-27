import { Injectable, inject } from '@angular/core';

import {
    Firestore,
    collection,
    addDoc,
    serverTimestamp
} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    private firestore = inject(Firestore);

    async createArticle(article: any) {

        const articlesRef = collection(
            this.firestore,
            'news'
        );

        return addDoc(articlesRef, {

            ...article,

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()

        });
    }

}
