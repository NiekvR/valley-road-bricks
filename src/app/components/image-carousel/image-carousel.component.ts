import { Component, Input, computed, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-image-carousel',
    standalone: true,
    imports: [NgOptimizedImage],
    templateUrl: './image-carousel.component.html',
    styleUrl: './image-carousel.component.scss',
})
export class ImageCarouselComponent {

    @Input({ required: true })
    images: string[] = [];

    protected currentIndex = signal(0);

    protected currentImage = computed(() =>
        this.images[this.currentIndex()] ?? ''
    );

    next(): void {
        this.currentIndex.update(index =>
            (index + 1) % this.images.length
        );
    }

    previous(): void {
        this.currentIndex.update(index =>
            index === 0
                ? this.images.length - 1
                : index - 1
        );
    }

    goTo(index: number): void {
        this.currentIndex.set(index);
    }
}
