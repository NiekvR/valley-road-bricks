import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp, query, where, limit, collectionData, docData, orderBy
} from '@angular/fire/firestore';
import {NewsArticle} from "../models/news-article.model";
import {map, Observable, of} from "rxjs";
import {Product} from "../models/product.model";


@Injectable({
    providedIn: 'root'
})
export class NewsService {

    private firestore = inject(Firestore);

    private newsCollection = collection(
        this.firestore,
        'news'
    );

    getPublishedNews(): Observable<NewsArticle[]> {

        const newsRef = collection(
            this.firestore,
            'news'
        );

        const newsQuery = query(
            newsRef,
            where('published', '==', true)
        );

        return collectionData(
            newsQuery,
            {
                idField: 'id'
            }
        ) as Observable<NewsArticle[]>;
    }

    async createArticle(article: NewsArticle): Promise<string> {

        const docRef = await addDoc(
            this.newsCollection,
            {
                ...article,
                publishedAt: article.published
                    ? serverTimestamp()
                    : null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }
        );

        return docRef.id;
    }


    async updateArticle(
        id: string,
        article: NewsArticle
    ): Promise<void> {

        const articleRef = doc(
            this.firestore,
            'news',
            id
        );

        await updateDoc(
            articleRef,
            {
                ...article,
                publishedAt: article.published
                    ? article.publishedAt ?? serverTimestamp()
                    : null,
                updatedAt: serverTimestamp()
            }
        );
    }

    getArticle(id: string): Observable<NewsArticle | undefined> {

        const setDocument = doc(
            this.firestore,
            `news/${id}`
        );

        return docData(
            setDocument,
            {
                idField: 'id'
            }
        ) as Observable<NewsArticle | undefined>;
    }

    getArticleByLink(link: string): Observable<NewsArticle | undefined> {
        if (!link?.trim()) {
            return of(undefined);
        }

        const q = query(
            this.newsCollection,
            where('slug', '==', link.trim()),
            limit(1)
        );

        return collectionData(q, { idField: 'id' }).pipe(
            map(articles => articles[0] as NewsArticle | undefined)
        );
    }
}
