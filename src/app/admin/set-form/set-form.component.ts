import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap} from "rxjs";
import {ImageUploadComponent} from "../../components/image-upload/image-upload.component";

@Component({
    selector: 'app-set-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ImageUploadComponent
    ],
    templateUrl: './set-form.component.html',
    styleUrls: ['./set-form.component.scss']
})
export class SetFormComponent {
    private activatedRoute = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private router = inject(Router);

    product!: Product;

    categories = [
        'LEGO® Icons',
        'LEGO® Jurassic World™',
        'LEGO® Star Wars™',
        'LEGO® Technic',
        'LEGO® City',
        'LEGO® Architecture',
        'LEGO® Creator Expert',
        'LEGO® Harry Potter™',
        'LEGO® Monkie Kid™',
        'LEGO® Lord of the Rings™',
        'LEGO® Pokemon™',
        'LEGO® Ideas™',
        'LEGO® NINJAGO®',
        'LEGO® Disney™'
    ];

    saving = false;

    constructor() {
        // Access route parameters
        this.activatedRoute.params
            .pipe(
                switchMap(params => {
                    console.log(params);
                    return this.productService.getProduct(params['id'])
                })
            )
            .subscribe((product) => {
                console.log(product);
                if (product) {
                    this.product = product;
                } else {
                    this.product = {
                        name: '',
                        image: '',
                        images: [
                            '',
                            '',
                            ''
                        ],
                        price: 0,
                        pieces: 0,
                        minRentTime: 1,
                        category: '',
                        inStock: true,
                        legoId: 0,
                        starred: false,
                        link: '',
                        description: ''
                    }
                }
            });
    }

    onNewImageUploaded(url: string): void {
        this.product.images = [...this.product.images || [], url];
    }

    /** Afbeelding verwijderen */
    removeImage(index: number): void {
        this.product.images!.splice(index, 1);
    }

    /** Optioneel: een bestaande afbeelding vervangen */
    replaceImage(index: number, url: string): void {
        this.product.images![index] = url;
    }

    generateLink(): void {
        console.log(this.product.category);
        if (!!this.product.category) {
            this.product.link = this.product.category
                .toLowerCase()
                .trim()
                .replace(/[®™]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }
        this.product.link += `-${this.product.name
            .toLowerCase()
            .trim()
            .replace(/[®™]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')}`;

        if (this.product.legoId) {
            this.product.link += `-${this.product.legoId}`;
        }
    }

    async save(): Promise<void> {

        if (!this.product.name) {
            alert('Vul een naam in.');
            return;
        }

        if (!this.product.legoId) {
            alert('Vul een LEGO setnummer in.');
            return;
        }

        this.saving = true;

        try {

            const documentId =
                await !!this.product.id ? this.productService.updateProduct(this.product) : this.productService.addProduct(this.product);

            console.log(
                'Set succesvol opgeslagen:',
                documentId
            );

            alert('Set succesvol opgeslagen!');

            // eventueel:
            this.router.navigate(['admin','overview']);

        } catch (error) {

            console.error(
                'Fout bij opslaan van set:',
                error
            );

            alert(
                'Er ging iets mis bij het opslaan van de set.'
            );

        } finally {

            this.saving = false;

        }
    }

    cancel(): void {
        console.log('Cancel');
        this.router.navigate(['admin','overview']);
    }

    onMainImageUploaded(url: string) {
        this.product.image = url;
        console.log('Afbeelding geüpload, URL:', url);
    }

    onProgress(progress: number) {
        console.log('Upload progress:', progress);
    }
}
