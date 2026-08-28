import {Component, inject, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {NewsArticle, NewsArticleType} from "../../models/news-article.model";
import {NewsService} from "../../services/news.service";
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from "../../components/footer/footer.component";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {map} from "rxjs";


@Component({
    selector: 'app-news',
    standalone: true,
    imports: [
        RouterLink,
        DatePipe,
        HeaderComponent,
        FooterComponent
    ],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
    private newsService = inject(NewsService);

    articles: NewsArticle[] = [];

    loading = true;

    error = false;

    ngOnInit(): void {
        this.loadNews()
    }


    loadNews(): void {

        this.loading = true;
        this.error = false;

        this.newsService
            .getPublishedNews()
            .pipe(
                map(articles => articles.sort((a, b) => b.publishedAt - a.publishedAt)),
            )
            .subscribe({

                next: (articles) => {
                    console.log(articles);

                    this.articles = articles;

                    this.loading = false;

                },

                error: (error) => {

                    console.error(
                        'Fout bij het laden van nieuwsartikelen:',
                        error
                    );

                    this.error = true;
                    this.loading = false;

                }

            });

    }

    formatPublishedDate(timestamp: Timestamp | null | undefined): string {

        if (!timestamp) {
            return '';
        }

        return timestamp
            .toDate()
            .toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
    }

    correctLabel(type: NewsArticleType): string {
        let label = '';
        switch (type) {
            case 'cleanSort': label = 'Opruimen & sorteren'; break;
            case 'behindTheScenes': label = 'Achter de schermen'; break;
            case "family": label = 'Van ons gezin'; break;
            case "newSet": label = 'Nieuwe sets'; break;
            case "newsAndActions": label = 'Niews & acties'; break;
            case 'tips': label = 'Bouwtips'; break;
        }
        return label;
    }
}
