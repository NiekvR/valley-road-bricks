import { Component } from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {CollapsePanelComponent} from "../../components/collapse-panel/collapse-panel.component";

@Component({
  selector: 'app-faq',
    imports: [
        HeaderComponent,
        CollapsePanelComponent
    ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {

}
