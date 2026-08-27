import { Component } from '@angular/core';
import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";
import {faLeaf, faHouseChimneyCrack} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-hero',
    imports: [
        FaIconComponent,
        RouterLink
    ],
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
    faCircleCheck = faCircleCheck;
    faLeaf = faLeaf;
    faHouseChimneyCrack = faHouseChimneyCrack;
}
