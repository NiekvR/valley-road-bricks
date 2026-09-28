import {
    Component,
    inject,
    signal
} from '@angular/core';

import {
    SetInventoryImportService
} from './set-inventory-import.service';

import {
    SetInventory
} from './set-inventory.model';

@Component({
    selector: 'app-set-inventory-import',
    standalone: true,
    templateUrl: './set-inventory-import.component.html',
    styleUrl: './set-inventory-import.component.scss'
})
export class SetInventoryImportComponent {

    private readonly importer =
        inject(SetInventoryImportService);

    protected readonly loading =
        signal(false);

    protected readonly error =
        signal<string | null>(null);

    protected readonly inventory =
        signal<SetInventory | null>(null);

    protected readonly selectedFile =
        signal<File | null>(null);

    protected readonly setId =
        signal('');

    onSetIdChange(
        event: Event
    ): void {

        const input =
            event.target as HTMLInputElement;

        this.setId.set(input.value);
    }

    onFileSelected(
        event: Event
    ): void {

        const input =
            event.target as HTMLInputElement;

        const file =
            input.files?.[0];

        if (!file) {
            return;
        }

        this.selectedFile.set(file);
        this.error.set(null);
    }

    async import(): Promise<void> {

        const file =
            this.selectedFile();

        const setId =
            this.setId().trim();

        if (!file) {
            this.error.set(
                'Selecteer eerst een XML-bestand.'
            );

            return;
        }

        if (!setId) {
            this.error.set(
                'Vul eerst een setnummer in.'
            );

            return;
        }

        this.loading.set(true);
        this.error.set(null);
        this.inventory.set(null);

        try {

            const result =
                await this.importer.importXml(
                    file,
                    setId
                );

            this.inventory.set(result);

        } catch (error) {

            console.error(error);

            this.error.set(
                error instanceof Error
                    ? error.message
                    : 'Importeren is mislukt.'
            );

        } finally {

            this.loading.set(false);
        }
    }
}
