import {
    Component,
    Input,
    OnInit,
    inject
} from '@angular/core';

import {
    FormsModule
} from '@angular/forms';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import {
    NewsService
} from '../../services/news.service';
import {NewsArticle, NewsBlock, NewsBlockType} from "../../models/news-article.model";
import {ImageUploadComponent} from "../../components/image-upload/image-upload.component";
import {DecimalPipe} from "@angular/common";


@Component({
    selector: 'app-news-editor',
    standalone: true,
    imports: [
        FormsModule,
        ImageUploadComponent,
        DecimalPipe
    ],
    templateUrl: './news-editor.component.html',
    styleUrl: './news-editor.component.scss'
})
export class NewsEditorComponent
    implements OnInit {

    private newsService = inject(NewsService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);


    @Input()
    article?: NewsArticle;


    isSaving = false;

    errorMessage = '';

    savedMessage = '';


    newsArticle!: NewsArticle;

    types = [
        'newSet', 'tips', 'cleanSort', 'family', 'behindTheScenes', 'newsAndActions'
    ]

    isEditMode = false;

    loading = false;


    ngOnInit(): void {

        const articleId = this.route.snapshot.paramMap.get('id');

        if (articleId) {

            this.isEditMode = true;

            this.loadArticle(articleId);

        } else {

            this.isEditMode = false;

            this.createEmptyArticle();

        }

    }


    private createEmptyArticle() {

        this.newsArticle = {
            type: 'newsAndActions',
            title: '',
            slug: '',
            excerpt: '',
            text: '',
            ourAdvice: '',
            heroImage: '',
            published: false,
            blocks: []
        };

    }

    loadArticle(id: string): void {

        this.loading = true;

        this.newsService.getArticle(id)
            .subscribe({

                next: article => {

                    if (!article) {
                        this.router.navigate(['/admin/overview']);
                        return;
                    }

                    this.newsArticle = {
                        ...article,

                        blocks: article.blocks
                            ? [...article.blocks]
                            : []
                    };

                    this.loading = false;

                },

                error: error => {

                    console.error(
                        'Error loading article:',
                        error
                    );

                    this.loading = false;

                }

            });

    }


    /* -------------------------------------------------------
       Slug
    ------------------------------------------------------- */

    generateSlug(): void {

        if (!this.newsArticle.title) {
            return;
        }

        this.newsArticle.slug =
            this.newsArticle.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

    }


    /* -------------------------------------------------------
       Blocks
    ------------------------------------------------------- */

    addBlock(type: NewsBlockType): void {

        const block: NewsBlock = {
            type
        };

        switch (type) {

            case 'text':
                block.title = '';
                block.text = '';
                break;

            case 'image':
                block.image = '';
                block.imageAlt = '';
                block.caption = '';
                break;

            case 'quote':
                block.text = '';
                block.title = '';
                break;

            case 'tip':
                block.title = 'Tip van Valley Road Bricks';
                block.text = '';
                break;

            case 'set':
                block.setId = '';
                block.setName = '';
                block.setImage = '';
                block.legoId = undefined;
                block.pieces = undefined;
                block.price = undefined;
                block.setLink = '';
                break;

            case 'video':
                block.videoUrl = '';
                block.videoTitle = '';
                block.videoDescription = '';
                break;
        }

        this.newsArticle.blocks.push(block);
    }


    removeBlock(index: number): void {

        this.newsArticle.blocks.splice(index, 1);

    }


    moveBlockUp(index: number): void {

        if (index === 0) {
            return;
        }

        const blocks = this.newsArticle.blocks;

        [blocks[index - 1], blocks[index]] =
            [blocks[index], blocks[index - 1]];

    }


    moveBlockDown(index: number): void {

        const blocks = this.newsArticle.blocks;

        if (index >= blocks.length - 1) {
            return;
        }

        [blocks[index], blocks[index + 1]] =
            [blocks[index + 1], blocks[index]];

    }


    /* -------------------------------------------------------
       Save
    ------------------------------------------------------- */

    async save(): Promise<void> {

        this.errorMessage = '';
        this.savedMessage = '';

        if (!this.validate()) {
            return;
        }

        this.isSaving = true;

        try {

            if (this.newsArticle.id) {

                await this.newsService.updateArticle(
                    this.newsArticle.id,
                    this.newsArticle
                );

            } else {

                const id =
                    await this.newsService.createArticle(
                        this.newsArticle
                    );

                this.newsArticle.id = id;

            }

            this.savedMessage =
                'Artikel succesvol opgeslagen.';

        } catch (error) {

            console.error(
                'Error saving news article:',
                error
            );

            this.errorMessage =
                'Er ging iets mis bij het opslaan van het artikel.';

        } finally {

            this.isSaving = false;

        }

    }


    private validate(): boolean {

        if (!this.newsArticle.title.trim()) {

            this.errorMessage =
                'Vul een titel in.';

            return false;

        }

        if (!this.newsArticle.excerpt.trim()) {

            this.errorMessage =
                'Vul een korte omschrijving in.';

            return false;

        }

        return true;

    }


    cancel(): void {

        this.router.navigate([
            '/admin/overview'
        ]);

    }

    onMainImageUploaded(url: string) {
        this.newsArticle.heroImage = url;
        console.log('Afbeelding geüpload, URL:', url);
    }

    onBlockImageUploaded(url: string, blockIndex: number) {
        this.newsArticle.blocks[blockIndex].image = url;
        console.log('Afbeelding geüpload, URL:', url);
    }
}
