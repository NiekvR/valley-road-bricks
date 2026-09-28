import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RebrickableElement, RebrickablePart, RebrickablePartsResponse} from "../models/rebrickable.model";
import {environment} from "../../environment";

@Injectable({
    providedIn: 'root'
})
export class RebrickableService {

    private readonly http = inject(HttpClient);

    private readonly baseUrl =
        'https://rebrickable.com/api/v3/lego';

    /**
     * Gebruik bij voorkeur een environment variable.
     *
     * LET OP:
     * Een API key in Angular is zichtbaar voor bezoekers.
     * Voor productie liever via Firebase Cloud Functions.
     */
    private readonly apiKey = environment.rebrickable;

    private get headers(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `key ${this.apiKey}`
        });
    }

    /**
     * Eén part ophalen.
     */
    getPart(partId: string): Observable<RebrickablePart> {
        return this.http.get<RebrickablePart>(
            `${this.baseUrl}/parts/${encodeURIComponent(partId)}/`,
            {
                headers: this.headers
            }
        );
    }

    /**
     * Meerdere parts in één API call.
     *
     * Rebrickable adviseert dit boven een request per part.
     */
    getParts(partIds: string[]): Observable<RebrickablePartsResponse> {

        const ids = [...new Set(partIds)]
            .filter(Boolean)
            .join(',');

        return this.http.get<RebrickablePartsResponse>(
            `${this.baseUrl}/parts/`,
            {
                headers: this.headers,
                params: {
                    part_nums: ids,
                    inc_part_details: '1'
                }
            }
        );
    }

    /**
     * LEGO Element ID ophalen.
     *
     * Handig als ItemID in de XML een LEGO element ID blijkt te zijn.
     */
    getElement(elementId: string): Observable<RebrickableElement> {
        return this.http.get<RebrickableElement>(
            `${this.baseUrl}/elements/${encodeURIComponent(elementId)}/`,
            {
                headers: this.headers
            }
        );
    }
}
