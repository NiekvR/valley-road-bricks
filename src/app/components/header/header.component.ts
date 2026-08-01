import { Component, Input } from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";
import {faLeaf, faHouseChimneyCrack} from "@fortawesome/free-solid-svg-icons";
import {NavbarComponent} from "../../shared/navbar/navbar.component";


@Component({
    selector: 'app-header',
    imports: [FontAwesomeModule, NavbarComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    faCircleCheck = faCircleCheck;
    faLeaf = faLeaf;
    faHouseChimneyCrack = faHouseChimneyCrack;
}
