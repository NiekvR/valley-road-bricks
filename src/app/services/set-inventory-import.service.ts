import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { RebrickableService } from './rebrickable.service';
import {SetInventory, SetPart} from "../models/set-inventory.model";
import {RebrickablePart} from "../models/rebrickable.model";

interface XmlPart {
    itemId: string;
    itemTypeId: string;
    colorId: number;
    quantity: number;
    condition?: string;
    remarks?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SetInventoryImportService {

    private readonly rebrickable = inject(RebrickableService);

    /**
     * XML bestand omzetten naar SetInventory.
     */
    async importXml(
        file: File,
        setId: string
    ): Promise<SetInventory> {

        const xmlText = await file.text();

        const xml = new DOMParser()
            .parseFromString(xmlText, 'application/xml');

        const parserError = xml.querySelector('parsererror');

        if (parserError) {
            throw new Error(
                'Het XML-bestand kon niet worden gelezen.'
            );
        }

        const xmlParts = this.parseXml(xml);

        if (xmlParts.length === 0) {
            throw new Error(
                'Geen <Item> elementen gevonden in het XML-bestand.'
            );
        }

        const parts = await this.enrichWithRebrickable(xmlParts);

        return {
            setId,
            parts,
            source: 'xml+rebrickable',
            importedAt: new Date()
        };
    }

    /**
     * XML parsen.
     */
    private parseXml(xml: Document): XmlPart[] {

        const items = Array.from(
            xml.querySelectorAll('Item')
        );

        return items
            .map(item => {

                const itemId =
                    this.getText(item, 'ItemID');

                const itemTypeId =
                    this.getText(item, 'ItemTypeID');

                const colorId =
                    Number(this.getText(item, 'ColorID'));

                const quantity =
                    Number(this.getText(item, 'Qty'));

                const condition =
                    this.getText(item, 'Condition');

                const remarks =
                    this.getText(item, 'Remarks');

                return {
                    itemId,
                    itemTypeId,
                    colorId,
                    quantity,
                    condition,
                    remarks
                };
            })
            .filter(item => {

                // Alleen echte parts verwerken.
                if (item.itemTypeId !== 'P') {
                    return false;
                }

                if (!item.itemId) {
                    return false;
                }

                if (!Number.isFinite(item.quantity)) {
                    return false;
                }

                return true;
            });
    }

    /**
     * XML item uitlezen.
     */
    private getText(
        parent: Element,
        tagName: string
    ): string {

        return parent
            .querySelector(tagName)
            ?.textContent
            ?.trim() ?? '';
    }

    /**
     * XML parts verrijken met Rebrickable informatie.
     */
    private async enrichWithRebrickable(
        xmlParts: XmlPart[]
    ): Promise<SetPart[]> {

        /**
         * Unieke part IDs.
         *
         * Bijvoorbeeld:
         *
         * 20482
         * 20482
         * 3001
         * 3001
         *
         * wordt:
         *
         * 20482
         * 3001
         */
        const partIds = [
            ...new Set(
                xmlParts.map(part => part.itemId)
            )
        ];

        const response =
            await firstValueFrom(
                this.rebrickable.getParts(partIds)
            );

        const rebrickableParts =
            new Map<string, RebrickablePart>(
                response.results.map(part => [
                    part.part_num,
                    part
                ])
            );

        return xmlParts.map(xmlPart => {

            const rbPart =
                rebrickableParts.get(xmlPart.itemId);

            return {
                partId: xmlPart.itemId,

                colorId: xmlPart.colorId,
                colorName: this.getColorName(
                    xmlPart.colorId
                ),

                quantity: xmlPart.quantity,

                bag: xmlPart.remarks,

                condition: xmlPart.condition,

                name: rbPart?.name,

                imageUrl: rbPart?.part_img_url,

                categoryId: rbPart?.part_cat_id
            };
        });
    }

    /**
     * Dit kun je later vervangen door een Rebrickable
     * color lookup/cache.
     */
    private getColorName(
        colorId: number
    ): string {

        return `Rebrickable color ${colorId}`;
    }
}
