import {Component, Input, computed, signal, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'app-image-carousel',
    standalone: true,
    templateUrl: './image-carousel.component.html',
    styleUrl: './image-carousel.component.scss',
})
export class ImageCarouselComponent {
    @ViewChild('viewport')
    viewport!: ElementRef<HTMLElement>;

    @Input({ required: true })
    images: string[] = [];
    @Input() dots = true;

    protected currentIndex = signal(0);

    protected currentImage = computed(() =>
        this.images[this.currentIndex()] ?? ''
    );

    next(): void {
        const nextIndex = Math.min(
            this.currentIndex() + 1,
            this.images.length - 1
        );

        this.goTo(nextIndex);
    }

    previous(): void {
        const previousIndex = Math.max(
            this.currentIndex() - 1,
            0
        );

        this.goTo(previousIndex);
    }

    goTo(index: number): void {
        const viewport = this.viewport.nativeElement;

        viewport.scrollTo({
            left: index * viewport.clientWidth,
            behavior: 'smooth'
        });

        this.currentIndex.set(index);
    }

    onScroll(): void {
        const viewport = this.viewport.nativeElement;

        const index = Math.round(
            viewport.scrollLeft / viewport.clientWidth
        );

        if (index !== this.currentIndex()) {
            this.currentIndex.set(index);
        }
    }
}
