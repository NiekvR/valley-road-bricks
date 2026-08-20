import { Component } from '@angular/core';

import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import {ImageTextComponent} from "../../components/image-text/image-text.component";

@Component({
    selector: 'app-how-it-works',
    imports: [HeaderComponent, FooterComponent, ImageTextComponent],
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {}
