import { Component } from '@angular/core';
import {FooterComponent} from "../../components/footer/footer.component";
import {HeaderComponent} from "../../components/header/header.component";
import {ImageTextComponent} from "../../components/image-text/image-text.component";
import {CollapsePanelComponent} from "../../components/collapse-panel/collapse-panel.component";

@Component({
  selector: 'app-about-us',
    imports: [
        FooterComponent,
        HeaderComponent,
        ImageTextComponent,
        CollapsePanelComponent
    ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {

}
