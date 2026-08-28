import {Component, inject} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NewsArticle, NewsArticleType} from "../../models/news-article.model";
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from "../../components/footer/footer.component";
import {filter, switchMap} from "rxjs";
import {NewsService} from "../../services/news.service";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {SafeUrlPipe} from "../../services/safe-url.pipe";

@Component({
    selector: 'app-news-detail',
    standalone: true,
    imports: [
        DecimalPipe,
        RouterLink,
        HeaderComponent,
        FooterComponent,
        SafeUrlPipe
    ],
    templateUrl: './news-detail.component.html',
    styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent {
    private activatedRoute = inject(ActivatedRoute);
    private newsService = inject(NewsService);

    public article!: NewsArticle;
    //     {
    //     type: 'cleanSort',
    //     id: '1',
    //     title: 'Hoe ruim je een LEGO®-set op?',
    //     excerpt: 'Een LEGO®-set bouwen is leuk. Maar een grote gebouwde set weer uit elkaar halen? Dat klinkt misschien als het minst leuke onderdeel van de hobby. Toch kan juist dát verrassend satisfying zijn.',
    //     text: 'Een LEGO®-set bouwen is leuk. Maar een grote gebouwde set weer uit elkaar halen? Dat klinkt misschien als het minst leuke onderdeel van de hobby. Toch kan juist dát verrassend satisfying zijn.\n' +
    //         'Bij Valley Road Bricks krijg je bij iedere set duidelijke opruiminstructies. Zo weet je precies hoe je de set weer netjes terugbrengt. Maar je kunt er ook een klein projectje van maken.\n',
    //     heroImage: 'https://firebasestorage.googleapis.com/v0/b/valley-road-bricks.firebasestorage.app/o/images%2Fthumbnails%2F1787315262579_camp-nou-1_800x600.webp?alt=media&token=1179256f-bd6b-4535-98a2-766b29712b4f',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     published: true,
    //     blocks: [
    //         {
    //             type: 'text',
    //             title: 'Stap 1: rustig beginnen',
    //             text: 'Begin niet meteen alles uit elkaar te trekken. Kijk eerst even naar de bouwinstructies. Vrijwel altijd kun je de bouwstappen achteruit volgen. Bij een huis of kasteel, haal je zo bijvoorbeeld eerst het dak eraf, daarna de verdieping en vervolgens de details.',
    //         },
    //         {
    //             type: 'text',
    //             title: 'Stap 2: sorteer per bouwstap',
    //             text: 'Een handige methode is om de onderdelen meteen bij het uit elkaar halen, per bouwstap in het boekje te verzamelen. Alle steentjes van boekje 10 bij elkaar, die van boekje 11 op een andere plek bij elkaar, enzovoorts. Sommige sets zijn modulair, hier kun je eerst de verschillende onderdelen loshalen, en vervolgens het juiste boekje / zakje erbij halen. Anderen hebben een aantal speciale of bijzonder grote onderdelen, die los van de rest gebouwd worden.\n'
    //         },
    //         {
    //             type: 'tip',
    //             text: 'Bij het uit elkaar halen komen vaak al onderdelen los die misschien niet bij het zakje horen waar je mee bezig bent. Leg deze even apart en neem ze er bij het volgende zakje weer bij. Kleine onderdelen die gemakkelijk kwijtraken kun je tijdelijk in een bakje of schaaltje doen.\n',
    //         },
    //         {
    //             type: 'text',
    //             title: 'Stap 3: even controleren',
    //             text: 'Loop voordat je alles inpakt nog één keer door de instructies. Zit er ergens nog een minifiguur, dier of klein accessoire verstopt? Dat zijn precies de onderdelen die makkelijk achterblijven onder de bank.\n' +
    //                 'En dan komt het mooiste moment: alles zit weer netjes in de zakjes en de doos kan dicht.\n' +
    //                 'Een beetje jammer dat het bouwplezier voorbij is? Misschien. Maar het fijne is: de volgende bouwer kan straks weer helemaal opnieuw beginnen.\n' +
    //                 'Bij Valley Road Bricks controleren we iedere set na terugkomst. Zo weet je zeker dat jouw volgende set weer 100% compleet en gecontroleerd klaarstaat.\n',
    //         }
    //     ]
    //
    // }

    constructor() {
        this.activatedRoute.params
            .pipe(
                switchMap(params => this.newsService.getArticleByLink(params['id'])),
                filter(news => !!news),
            )
            .subscribe((article) => {
                if (!!article) {
                    this.article = article;
                }
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

    getYoutubeEmbedUrl(url: string | undefined): string {

        if (!url) {
            return '';
        }

        try {

            const parsedUrl = new URL(url);

            let videoId = '';

            if (parsedUrl.hostname.includes('youtu.be')) {

                videoId = parsedUrl.pathname.substring(1);

            } else if (parsedUrl.hostname.includes('youtube.com')) {

                videoId = parsedUrl.searchParams.get('v') || '';

                if (!videoId && parsedUrl.pathname.startsWith('/shorts/')) {
                    videoId = parsedUrl.pathname.split('/')[2];
                }

            }

            if (!videoId) {
                return '';
            }

            return `https://www.youtube.com/embed/${videoId}`;

        } catch {

            return '';

        }

    }
}
