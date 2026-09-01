import { Component } from '@angular/core';
import {FooterComponent} from "../../components/footer/footer.component";
import {HeaderComponent} from "../../components/header/header.component";
import {ImageTextComponent} from "../../components/image-text/image-text.component";
import {CollapsePanelComponent} from "../../components/collapse-panel/collapse-panel.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";
import {faHouseChimneyCrack, faLeaf} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-about-us',
    imports: [
        FooterComponent,
        HeaderComponent,
        ImageTextComponent,
        FaIconComponent,
    ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {

    protected readonly faCircleCheck = faCircleCheck;
    protected readonly faLeaf = faLeaf;
    protected readonly faHouseChimneyCrack = faHouseChimneyCrack;
}
