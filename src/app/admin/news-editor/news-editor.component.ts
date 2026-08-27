import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    CdkDragDrop,
    DragDropModule,
    moveItemInArray
} from '@angular/cdk/drag-drop';
import {NewsService} from "../../services/news.service";

export type NewsBlockType =
    | 'heading'
    | 'text'
    | 'image'
    | 'tip'
    | 'quote'
    | 'set'
    | 'columns'
    | 'button'
    | 'divider';

export interface NewsBlock {
    id: string;
    type: NewsBlockType;
    data: any;
}

@Component({
    selector: 'app-news-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DragDropModule
    ],
    templateUrl: './news-editor.component.html',
    styleUrl: './news-editor.component.scss'
})
export class NewsEditorComponent {

    private newsService = inject(NewsService);

    article = {
        title: '',
        slug: '',
        excerpt: '',
        heroImage: '',
        published: false
    };

    blocks: NewsBlock[] = [];

    selectedBlock: NewsBlock | null = null;

    saving = false;

    addBlock(type: NewsBlockType) {

        const block: NewsBlock = {
            id: crypto.randomUUID(),
            type,
            data: this.getDefaultData(type)
        };

        this.blocks.push(block);

        this.selectBlock(block);
    }

    getDefaultData(type: NewsBlockType) {

        switch (type) {

            case 'heading':
                return {
                    text: 'Nieuwe tussenkop',
                    level: 2
                };

            case 'text':
                return {
                    html: '<p>Schrijf hier je tekst...</p>'
                };

            case 'image':
                return {
                    url: '',
                    alt: '',
                    caption: ''
                };

            case 'tip':
                return {
                    title: 'Onze tip',
                    text: 'Schrijf hier een handige tip.'
                };

            case 'quote':
                return {
                    text: 'Een mooie quote uit het artikel.',
                    author: ''
                };

            case 'set':
                return {
                    setId: '',
                    title: '',
                    description: '',
                    image: '',
                    url: ''
                };

            case 'columns':
                return {
                    left: '<p>Linkerkolom</p>',
                    right: '<p>Rechterkolom</p>'
                };

            case 'button':
                return {
                    text: 'Bekijk de set',
                    url: '#'
                };

            case 'divider':
                return {};

            default:
                return {};
        }
    }

    selectBlock(block: NewsBlock) {
        this.selectedBlock = block;
    }

    removeBlock(block: NewsBlock) {

        const index = this.blocks.indexOf(block);

        if (index !== -1) {
            this.blocks.splice(index, 1);
        }

        if (this.selectedBlock?.id === block.id) {
            this.selectedBlock = null;
        }
    }

    duplicateBlock(block: NewsBlock) {

        const index = this.blocks.indexOf(block);

        const copy: NewsBlock = {
            ...structuredClone(block),
            id: crypto.randomUUID()
        };

        this.blocks.splice(index + 1, 0, copy);

        this.selectBlock(copy);
    }

    drop(event: CdkDragDrop<NewsBlock[]>) {

        moveItemInArray(
            this.blocks,
            event.previousIndex,
            event.currentIndex
        );
    }

    moveUp(block: NewsBlock) {

        const index = this.blocks.indexOf(block);

        if (index > 0) {
            [this.blocks[index - 1], this.blocks[index]] =
                [this.blocks[index], this.blocks[index - 1]];
        }
    }

    moveDown(block: NewsBlock) {

        const index = this.blocks.indexOf(block);

        if (index < this.blocks.length - 1) {
            [this.blocks[index + 1], this.blocks[index]] =
                [this.blocks[index], this.blocks[index + 1]];
        }
    }

    async saveArticle() {

        if (!this.article.title) {
            return;
        }

        this.saving = true;

        try {

            await this.newsService.createArticle({
                ...this.article,
                blocks: this.blocks
            });

            alert('Artikel opgeslagen!');

        } finally {

            this.saving = false;

        }
    }

    generateSlug() {

        this.article.slug = this.article.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    }

}
