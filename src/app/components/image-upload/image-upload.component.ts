// image-upload.component.ts (aangepaste versie)

import {Component, EventEmitter, Output, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Storage, ref, uploadBytesResumable, getDownloadURL, getMetadata} from '@angular/fire/storage';

@Component({
    selector: 'app-image-upload',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
    private storage = inject(Storage);
    @Input() change: boolean = false;

    @Output() imageUrlReady = new EventEmitter<string>();
    @Output() uploadProgress = new EventEmitter<number>();

    isUploading = false;
    progress = 0;
    errorMessage: string | null = null;
    previewUrl: string | null = null;

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        if (!file.type.startsWith('image/')) {
            this.errorMessage = 'Alleen afbeeldingen toegestaan';
            return;
        }

        this.errorMessage = null;
        this.previewUrl = URL.createObjectURL(file);
        this.uploadImage(file);

        // Reset input zodat dezelfde file opnieuw gekozen kan worden
        input.value = '';
    }

    private uploadImage(file: File): void {
        this.isUploading = true;
        this.progress = 0;

        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(this.storage, `images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                this.progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.uploadProgress.emit(this.progress);
            },
            (error) => {
                console.error(error);
                this.errorMessage = 'Upload mislukt';
                this.isUploading = false;
            },
            async () => {
                const downloadURL = await this.getThumbnailUrlWhenReady(fileName);
                this.imageUrlReady.emit(downloadURL);
                this.isUploading = false;
                this.previewUrl = null; // optioneel: preview wissen na upload
            }
        );
    }

    private buildThumbnailPath(name: string, size: string): string {
        // Split pad en bestandsnaam
        // Verwijder extensie
        const nameWithoutExt = name.replace(/\.[^/.]+$/, '');     // "1787141851592_T-rex-1"

        // Nieuw pad volgens de Resize Images extension
        // (pas dit aan als jouw extensie-instellingen anders zijn)
        return `/images/thumbnails/${nameWithoutExt}_${size}.webp`;
    }

    async getThumbnailUrlWhenReady(
        fileName: string,
        size: string = '800x600',
        options: {
            maxAttempts?: number;   // max aantal pogingen
            delayMs?: number;        // wachttijd tussen pogingen
            timeoutMs?: number;      // totale timeout
        } = {}
    ): Promise<string> {
        const {
            maxAttempts = 5,
            delayMs = 5000,         // 1 seconde tussen elke poging
            timeoutMs = 26000       // max 20 seconden wachten
        } = options;

        const thumbnailPath = this.buildThumbnailPath(fileName, size);
        const thumbnailRef = ref(this.storage, thumbnailPath);

        const startTime = Date.now();
        let attempt = 0;

        while (attempt < maxAttempts) {
            // Timeout check
            if (Date.now() - startTime > timeoutMs) {
                throw new Error(`Timeout: thumbnail ${thumbnailPath} is niet binnen ${timeoutMs}ms aangemaakt`);
            }

            try {
                // Probeer metadata op te halen → als dit lukt bestaat het bestand
                await getMetadata(thumbnailRef);

                // Bestand bestaat → download URL ophalen
                return await getDownloadURL(thumbnailRef);
            } catch (error: any) {
                // Alleen doorgaan als het bestand nog niet bestaat
                if (error?.code === 'storage/object-not-found') {
                    attempt++;
                    console.log(`Thumbnail nog niet klaar (poging ${attempt}/${maxAttempts})...`);
                    await this.delay(delayMs);
                    continue;
                }

                // Andere fout → meteen stoppen
                throw error;
            }
        }

        throw new Error(`Thumbnail ${thumbnailPath} is na ${maxAttempts} pogingen nog niet aangemaakt`);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
