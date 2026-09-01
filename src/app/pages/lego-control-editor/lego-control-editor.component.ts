import {
    Component,
    inject,
    OnInit
} from '@angular/core';

import {
    FormArray,
    FormBuilder,
    FormGroup, FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { LegoControlService } from '../../services/lego-control.service';
import {
    ControlBag,
    ControlPiece
} from '../../models/control-bag.model';
import {ProductService} from "../../services/product.service";
import {Product} from "../../models/product.model";


@Component({
    selector: 'app-lego-control-editor',
    standalone: true,

    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],

    templateUrl: './lego-control-editor.component.html',
    styleUrl: './lego-control-editor.component.scss'
})
export class LegoControlEditorComponent implements OnInit {

    private fb = inject(FormBuilder);
    private controlService = inject(LegoControlService);
    private productService = inject(ProductService);


    sets: Product[] = [];


    selectedSetId = '';


    bags: ControlBag[] = [];


    loading = false;
    saving = false;


    bagForm = this.fb.group({

        bagNumber: [
            1,
            [
                Validators.required,
                Validators.min(1)
            ]
        ],

        pieces: this.fb.array([])
    });


    ngOnInit(): void {
        this.loadSets();

        this.addPiece();
    }


    get pieces(): FormArray {
        return this.bagForm.get('pieces') as FormArray;
    }


    /**
     * Selecteer een LEGO set.
     */
    onSetChange(): void {

        if (!this.selectedSetId) {
            this.bags = [];
            return;
        }

        this.loadBags();
    }

    loadSets(): void {

        this.productService.getProducts().subscribe(
            products => {
                this.sets = products;
            }
        );

    }


    /**
     * Bestaande zakjes ophalen.
     */
    loadBags(): void {

        this.loading = true;

        this.controlService
            .getBags(this.selectedSetId)
            .subscribe({

                next: bags => {
                    this.bags = bags;

                    this.loading = false;
                },

                error: error => {
                    console.error(
                        'Fout bij ophalen zakjes:',
                        error
                    );

                    this.loading = false;
                }

            });
    }


    /**
     * Nieuw steentje toevoegen.
     */
    addPiece(): void {

        const piece = this.fb.group({

            brickId: [
                '',
                Validators.required
            ],

            quantity: [
                1,
                [
                    Validators.required,
                    Validators.min(1)
                ]
            ]

        });

        this.pieces.push(piece);
    }


    /**
     * Steentje verwijderen.
     */
    removePiece(index: number): void {

        this.pieces.removeAt(index);

    }


    /**
     * Formulier leegmaken.
     */
    resetForm(): void {

        this.bagForm.reset({
            bagNumber: this.getNextBagNumber()
        });

        this.pieces.clear();

        this.addPiece();
    }


    /**
     * Bepaal automatisch het volgende zaknummer.
     */
    getNextBagNumber(): number {

        if (!this.bags.length) {
            return 1;
        }

        return Math.max(
            ...this.bags.map(bag => bag.bagNumber)
        ) + 1;
    }


    /**
     * Zakje opslaan.
     */
    async saveBag(): Promise<void> {

        if (!this.selectedSetId) {
            return;
        }

        if (this.bagForm.invalid) {
            this.bagForm.markAllAsTouched();
            return;
        }

        this.saving = true;

        try {

            const formValue = this.bagForm.getRawValue();

            // @ts-ignore
            const bag: ControlBag = {

                bagNumber: formValue.bagNumber!,

                pieces: (formValue.pieces || [])
                    .map(piece =>  {
                        const p = piece as ControlPiece;
                        return {
                            brickId: p.brickId,
                            quantity: Number(p.quantity)
                        }
                    })

            };


            await this.controlService.addBag(
                this.selectedSetId,
                bag
            );


            this.resetForm();

            this.loadBags();

        } catch (error) {

            console.error(
                'Fout bij opslaan zakje:',
                error
            );

        } finally {

            this.saving = false;

        }
    }


    /**
     * Zakje verwijderen.
     */
    async deleteBag(bag: ControlBag): Promise<void> {

        if (!bag.id || !this.selectedSetId) {
            return;
        }

        const confirmed = confirm(
            `Zakje ${bag.bagNumber} verwijderen?`
        );

        if (!confirmed) {
            return;
        }

        await this.controlService.deleteBag(
            this.selectedSetId,
            bag.id
        );

        this.loadBags();
    }


    /**
     * Totaal aantal steentjes in een zakje.
     */
    getBagPieceCount(bag: ControlBag): number {

        return bag.pieces.reduce(
            (total, piece) =>
                total + piece.quantity,
            0
        );
    }

}
